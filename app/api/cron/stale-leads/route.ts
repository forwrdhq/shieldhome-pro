import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/sendgrid'
import { sendSms, formatPhone } from '@/lib/twilio'
import { APP_URL, COMPANY_NAME } from '@/lib/constants'

/**
 * Stale leads cron — runs daily
 *
 * Identifies leads that are falling through the cracks and alerts
 * both the admin (email) and the sales rep (SMS).
 *
 * Three categories:
 * 1. "Never contacted" — submitted 2+ hours ago, no contact at all
 * 2. "Gone cold" — last contact was 48+ hours ago, still open
 * 3. "High value at risk" — HOT/HIGH priority leads with no activity in 24h
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)

    // Category 1: Never contacted
    const neverContacted = await prisma.lead.findMany({
      where: {
        status: 'NEW',
        lastContactDate: null,
        firstContactAt: null,
        submittedAt: { lt: twoHoursAgo },
      },
      orderBy: { leadScore: 'desc' },
    })

    // Category 2: Gone cold — contacted but no recent activity
    const goneCold = await prisma.lead.findMany({
      where: {
        status: { in: ['CONTACTED', 'NO_ANSWER'] },
        lastContactDate: { lt: fortyEightHoursAgo },
      },
      orderBy: { leadScore: 'desc' },
    })

    // Category 3: High-value at risk
    const highValueAtRisk = await prisma.lead.findMany({
      where: {
        priority: { in: ['HOT', 'HIGH'] },
        status: { in: ['NEW', 'CONTACTED', 'NO_ANSWER'] },
        OR: [
          { lastContactDate: { lt: twentyFourHoursAgo } },
          { AND: [{ lastContactDate: null }, { submittedAt: { lt: twoHoursAgo } }] },
        ],
      },
      orderBy: { leadScore: 'desc' },
    })

    const totalStale = new Set([
      ...neverContacted.map(l => l.id),
      ...goneCold.map(l => l.id),
      ...highValueAtRisk.map(l => l.id),
    ]).size

    // --- Send admin email report ---
    if (totalStale > 0 && process.env.ADMIN_EMAIL) {
      const priorityColor: Record<string, string> = {
        HOT: '#ef4444', HIGH: '#f97316', MEDIUM: '#3b82f6', LOW: '#9ca3af'
      }

      function buildTable(leads: typeof neverContacted): string {
        if (leads.length === 0) return '<p style="color: #999;">None — great job!</p>'
        return `
          <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-size: 14px; margin: 8px 0;">
            <thead>
              <tr style="background: #f8f9fa; text-align: left;">
                <th style="border-bottom: 2px solid #eee; padding: 8px;">Name</th>
                <th style="border-bottom: 2px solid #eee; padding: 8px;">Phone</th>
                <th style="border-bottom: 2px solid #eee; padding: 8px;">Priority</th>
                <th style="border-bottom: 2px solid #eee; padding: 8px;">Score</th>
                <th style="border-bottom: 2px solid #eee; padding: 8px;">Submitted</th>
                <th style="border-bottom: 2px solid #eee; padding: 8px;">SMS Sent</th>
              </tr>
            </thead>
            <tbody>
              ${leads.map(l => `
                <tr style="border-bottom: 1px solid #f0f0f0;">
                  <td style="padding: 8px;"><a href="${APP_URL}/leads/${l.id}" style="color: #00C853; font-weight: 600;">${l.fullName}</a></td>
                  <td style="padding: 8px;"><a href="tel:${l.phone}" style="color: #333;">${l.phone}</a></td>
                  <td style="padding: 8px;"><span style="color: ${priorityColor[l.priority] || '#999'}; font-weight: 600;">${l.priority}</span></td>
                  <td style="padding: 8px;">${l.leadScore}/100</td>
                  <td style="padding: 8px;">${l.submittedAt.toLocaleDateString()} ${l.submittedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td style="padding: 8px;">${l.smsSent}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `
      }

      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1A1A2E; border-bottom: 2px solid #00C853; padding-bottom: 10px;">
            Daily Lead Health Report — ${COMPANY_NAME}
          </h1>

          <div style="background: ${totalStale > 5 ? '#fef2f2' : '#f0fdf4'}; padding: 16px 20px; border-radius: 8px; margin: 16px 0;">
            <strong style="font-size: 18px; color: ${totalStale > 5 ? '#dc2626' : '#16a34a'};">
              ${totalStale} lead${totalStale === 1 ? '' : 's'} need${totalStale === 1 ? 's' : ''} attention
            </strong>
          </div>

          ${neverContacted.length > 0 ? `
          <h2 style="color: #dc2626; margin-top: 24px;">Never Contacted (${neverContacted.length})</h2>
          <p style="color: #666;">These leads submitted a quote and have received zero human contact. Every minute matters.</p>
          ${buildTable(neverContacted)}
          ` : ''}

          ${highValueAtRisk.length > 0 ? `
          <h2 style="color: #f97316; margin-top: 24px;">High-Value at Risk (${highValueAtRisk.length})</h2>
          <p style="color: #666;">HOT and HIGH priority leads with no activity in 24+ hours.</p>
          ${buildTable(highValueAtRisk)}
          ` : ''}

          ${goneCold.length > 0 ? `
          <h2 style="color: #3b82f6; margin-top: 24px;">Gone Cold (${goneCold.length})</h2>
          <p style="color: #666;">Previously contacted leads with no activity in 48+ hours.</p>
          ${buildTable(goneCold)}
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/leads" style="background: #00C853; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700;">Open CRM Dashboard</a>
          </div>

          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
            This report is generated daily by ${COMPANY_NAME}.
          </p>
        </div>
      `

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `${totalStale > 5 ? '[Action Required]' : '[Report]'} ${totalStale} lead${totalStale === 1 ? '' : 's'} need attention`,
        html,
      })
    }

    // --- Send rep SMS if there are hot leads going stale ---
    const repPhone = process.env.REP_PHONE_NUMBER
    if (repPhone && highValueAtRisk.length > 0) {
      const names = highValueAtRisk.slice(0, 5).map(l =>
        `- ${l.fullName} (${l.priority}, ${l.leadScore}pts) — ${l.phone}`
      ).join('\n')

      await sendSms(formatPhone(repPhone), [
        `DAILY ALERT: ${highValueAtRisk.length} high-value lead${highValueAtRisk.length === 1 ? '' : 's'} at risk`,
        ``,
        names,
        highValueAtRisk.length > 5 ? `\n...and ${highValueAtRisk.length - 5} more` : '',
        ``,
        `These are HOT/HIGH leads with no recent contact. A call today could save them.`,
      ].join('\n'))
    }

    return NextResponse.json({
      success: true,
      totalStale,
      neverContacted: neverContacted.length,
      goneCold: goneCold.length,
      highValueAtRisk: highValueAtRisk.length,
    })
  } catch (err) {
    console.error('Stale leads cron error:', err)
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}

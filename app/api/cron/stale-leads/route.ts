import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/sendgrid'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)

    const staleLeads = await prisma.lead.findMany({
      where: {
        status: { in: ['NEW', 'CONTACTED'] },
        OR: [
          { lastContactDate: { lt: fortyEightHoursAgo } },
          { AND: [{ lastContactDate: null }, { submittedAt: { lt: twoHoursAgo } }] },
        ]
      },
      orderBy: { submittedAt: 'desc' }
    })

    if (staleLeads.length > 0 && process.env.ADMIN_EMAIL) {
      const tableRows = staleLeads.map(l =>
        `<tr><td>${l.fullName}</td><td>${l.phone}</td><td>${l.status}</td><td>${l.submittedAt.toLocaleDateString()}</td><td>${l.priority}</td></tr>`
      ).join('')

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `⚠️ ${staleLeads.length} Stale Leads Need Attention`,
        html: `
          <h2>Stale Leads Report</h2>
          <p>${staleLeads.length} leads have not been contacted in 48+ hours.</p>
          <table border="1" cellpadding="8" cellspacing="0">
            <thead><tr><th>Name</th><th>Phone</th><th>Status</th><th>Submitted</th><th>Priority</th></tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/leads">View in CRM</a></p>
        `
      })
    }

    return NextResponse.json({ success: true, staleCount: staleLeads.length })
  } catch (err) {
    console.error('Stale leads cron error:', err)
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}

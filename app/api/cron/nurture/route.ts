import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/sendgrid'
import { APP_URL } from '@/lib/constants'
import { buildNurtureEmail, type EmailRecipient } from '@/lib/email-templates'

const NURTURE_SCHEDULE_HOURS = [0, 24, 72, 168, 336, 504]

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const leads = await prisma.lead.findMany({
      where: {
        nurtureActive: true,
        nurtureStep: { lt: 6 },
        status: { notIn: ['CLOSED_WON', 'CLOSED_LOST', 'NOT_QUALIFIED', 'CANCELLED'] },
      }
    })

    let sent = 0

    for (const lead of leads) {
      const nextStep = lead.nurtureStep
      const hoursRequired = NURTURE_SCHEDULE_HOURS[nextStep]
      if (hoursRequired === undefined) continue

      const hoursSinceSubmit = (Date.now() - lead.submittedAt.getTime()) / 3600000
      if (hoursSinceSubmit < hoursRequired) continue

      if (!lead.email) continue

      const unsubUrl = `${APP_URL}/unsubscribe?email=${encodeURIComponent(lead.email)}&id=${lead.id}`

      const recipient: EmailRecipient = {
        firstName: lead.firstName,
        email: lead.email,
        phone: lead.phone,
        landingPage: lead.landingPage,
        segment: lead.segment,
        currentProvider: lead.currentProvider,
        contractMonthsRemaining: lead.contractMonthsRemaining,
        currentMonthlyPayment: lead.currentMonthlyPayment,
        propertyType: lead.propertyType,
        timeline: lead.timeline,
        productsInterested: lead.productsInterested || [],
        creditScoreRange: lead.creditScoreRange,
      }

      const emailContent = buildNurtureEmail(nextStep, recipient, unsubUrl)
      const msgId = await sendEmail({ to: lead.email, subject: emailContent.subject, html: emailContent.html })

      if (msgId) {
        await Promise.all([
          prisma.emailLog.create({ data: { leadId: lead.id, type: emailContent.type, subject: emailContent.subject, sendgridId: msgId, status: 'sent' } }),
          prisma.lead.update({ where: { id: lead.id }, data: { nurtureStep: nextStep + 1, emailsSent: { increment: 1 } } }),
          prisma.activity.create({ data: { leadId: lead.id, type: 'NURTURE_EMAIL', description: `Nurture email ${nextStep + 1} sent: ${emailContent.subject}` } }),
        ])
        sent++
      }
    }

    return NextResponse.json({ success: true, sent })
  } catch (err) {
    console.error('Nurture cron error:', err)
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}

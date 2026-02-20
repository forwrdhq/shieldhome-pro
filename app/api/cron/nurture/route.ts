import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/sendgrid'
import { PHONE_NUMBER } from '@/lib/constants'

const NURTURE_SCHEDULE_HOURS = [0, 24, 72, 168, 336, 504]

const NURTURE_EMAILS = [
  {
    subject: "Your Free Home Security Quote — Here's What's Next",
    type: 'welcome',
  },
  {
    subject: 'Why 2 million families chose Vivint',
    type: 'nurture-1',
  },
  {
    subject: '"Is a home security system really worth it?"',
    type: 'nurture-2',
  },
  {
    subject: 'Your exclusive Vivint offer expires soon',
    type: 'nurture-3',
  },
  {
    subject: '{firstName}, still thinking about home security?',
    type: 'nurture-4',
  },
  {
    subject: 'Closing your quote file — last chance',
    type: 'nurture-5',
  },
]

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

      // Check if already sent this step
      const emailInfo = NURTURE_EMAILS[nextStep]
      if (!emailInfo) continue

      const subject = emailInfo.subject.replace('{firstName}', lead.firstName)
      const html = `<html><body><p>Hi ${lead.firstName},</p><p>This is nurture email ${nextStep + 1} from ShieldHome Pro.</p><p>Call us: ${PHONE_NUMBER}</p><p><a href="mailto:unsubscribe@shieldhomepro.com">Unsubscribe</a></p></body></html>`

      const msgId = await sendEmail({ to: lead.email, subject, html })

      if (msgId) {
        await Promise.all([
          prisma.emailLog.create({ data: { leadId: lead.id, type: emailInfo.type, subject, sendgridId: msgId, status: 'sent' } }),
          prisma.lead.update({ where: { id: lead.id }, data: { nurtureStep: nextStep + 1, emailsSent: { increment: 1 } } }),
          prisma.activity.create({ data: { leadId: lead.id, type: 'NURTURE_EMAIL', description: `Nurture email ${nextStep + 1} sent: ${subject}` } }),
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

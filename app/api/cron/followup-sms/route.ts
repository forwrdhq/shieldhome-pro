import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendSms, formatPhone } from '@/lib/twilio'
import { PHONE_NUMBER } from '@/lib/constants'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    
    const leads = await prisma.lead.findMany({
      where: {
        status: 'NEW',
        smsSent: { lt: 3 },
        submittedAt: { lt: twoHoursAgo },
      }
    })

    let sent = 0
    const messages = [
      (name: string) => `Hi ${name}, just following up on your home security quote request! We have a special offer on Vivint systems right now — free installation + free doorbell camera. Ready to chat? Call/text: ${PHONE_NUMBER}`,
      (name: string) => `${name}, your free Vivint security quote is still ready! Most homeowners get fully protected within 48 hours. Want us to call at a specific time? Just reply with a time that works. — ShieldHome Pro`,
      (name: string) => `Hi ${name}, this is our last text about your free security quote. The current promotion (free doorbell camera + install) ends soon. Call ${PHONE_NUMBER} or reply CALL and we'll ring you right away.`,
    ]

    for (const lead of leads) {
      const msgFn = messages[lead.smsSent]
      if (!msgFn) continue

      const body = msgFn(lead.firstName)
      const sid = await sendSms(formatPhone(lead.phone), body)

      if (sid) {
        await Promise.all([
          prisma.smsLog.create({ data: { leadId: lead.id, type: `followup-${lead.smsSent + 1}`, body, twilioSid: sid, status: 'sent' } }),
          prisma.lead.update({ where: { id: lead.id }, data: { smsSent: { increment: 1 }, lastContactDate: new Date() } }),
          prisma.activity.create({ data: { leadId: lead.id, type: 'SMS_SENT', description: `Follow-up SMS ${lead.smsSent + 1} sent` } }),
        ])
        sent++
      }
    }

    return NextResponse.json({ success: true, sent })
  } catch (err) {
    console.error('Follow-up SMS cron error:', err)
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}

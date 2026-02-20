import { NextRequest, NextResponse } from 'next/server'
import { sendSms, formatPhone } from '@/lib/twilio'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { leadId, to, body, type } = await req.json()
    if (!to || !body) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const sid = await sendSms(formatPhone(to), body)

    if (leadId && sid) {
      await prisma.smsLog.create({ data: { leadId, type: type || 'manual', body, twilioSid: sid, status: 'sent' } })
      await prisma.lead.update({ where: { id: leadId }, data: { smsSent: { increment: 1 }, lastContactDate: new Date() } })
      await prisma.activity.create({ data: { leadId, type: 'SMS_SENT', description: `SMS sent: ${body.substring(0, 50)}...` } })
    }

    return NextResponse.json({ success: true, sid })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 })
  }
}

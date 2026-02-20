import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/sendgrid'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { leadId, to, subject, html, type } = await req.json()
    if (!to || !subject || !html) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const msgId = await sendEmail({ to, subject, html })

    if (leadId && msgId) {
      await prisma.emailLog.create({ data: { leadId, type: type || 'manual', subject, sendgridId: msgId, status: 'sent' } })
      await prisma.lead.update({ where: { id: leadId }, data: { emailsSent: { increment: 1 } } })
      await prisma.activity.create({ data: { leadId, type: 'EMAIL_SENT', description: `Email sent: ${subject}` } })
    }

    return NextResponse.json({ success: true, msgId })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

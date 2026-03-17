import { sendSms, formatPhone } from './twilio'
import { sendEmail } from './sendgrid'
import { prisma } from './db'
import { PHONE_NUMBER, APP_URL } from './constants'
import { PROPERTY_TYPE_LABELS, TIMELINE_LABELS, HOMEOWNERSHIP_LABELS, CONCERN_LABELS } from './constants'

interface LeadNotificationData {
  id: string
  firstName: string
  lastName: string
  fullName: string
  phone: string
  email: string
  zipCode?: string | null
  propertyType?: string | null
  homeownership?: string | null
  doorsWindows?: string | null
  timeline?: string | null
  leadScore: number
  priority: string
  source?: string | null
  medium?: string | null
  campaign?: string | null
  productsInterested: string[]
}

export async function sendLeadConfirmationSms(lead: LeadNotificationData) {
  const body = `Hi ${lead.firstName}! This is ShieldHome Pro, your authorized Vivint dealer. We received your free quote request! A Smart Home Pro will call you shortly at this number. Questions? Call/text us: ${PHONE_NUMBER}`
  const sid = await sendSms(formatPhone(lead.phone), body)
  if (sid) {
    await prisma.smsLog.create({
      data: { leadId: lead.id, type: 'confirmation', body, twilioSid: sid, status: 'sent' }
    })
    await prisma.lead.update({
      where: { id: lead.id },
      data: { smsSent: { increment: 1 }, lastContactDate: new Date() }
    })
  }
}

export async function sendRepAlertSms(lead: LeadNotificationData) {
  const repPhones = [
    process.env.REP_PHONE_NUMBERS,
    process.env.REP_PHONE_NUMBER,
  ]
    .filter(Boolean)
    .flatMap(v => v!.split(',').map(p => p.trim()))
    .filter(Boolean)

  if (repPhones.length === 0) return

  const propertyLabel = lead.propertyType ? PROPERTY_TYPE_LABELS[lead.propertyType] || lead.propertyType : 'Unknown'
  const timelineLabel = lead.timeline ? TIMELINE_LABELS[lead.timeline] || lead.timeline : 'Unknown'

  const priorityEmoji: Record<string, string> = { HOT: '🔴', HIGH: '🟠', MEDIUM: '🔵', LOW: '⚪' }
  const products = lead.productsInterested?.length ? lead.productsInterested.join(', ') : 'N/A'
  const source = [lead.source, lead.medium, lead.campaign].filter(Boolean).join(' / ') || 'Direct'

  const body = [
    `${priorityEmoji[lead.priority] || '🔵'} NEW LEAD — ${lead.priority} PRIORITY`,
    ``,
    `👤 ${lead.fullName}`,
    `📞 ${lead.phone}`,
    `📧 ${lead.email}`,
    `📍 ZIP: ${lead.zipCode || 'N/A'}`,
    ``,
    `🏠 Property: ${propertyLabel}`,
    `⏰ Timeline: ${timelineLabel}`,
    `🛡️ Interested in: ${products}`,
    ``,
    `📊 Lead Score: ${lead.leadScore}/100`,
    `📣 Source: ${source}`,
    ``,
    `👉 ${APP_URL}/leads/${lead.id}`,
    `CALL NOW — speed to lead is everything!`,
  ].join('\n')

  await Promise.allSettled(repPhones.map(phone => sendSms(formatPhone(phone), body)))
}

export async function sendWelcomeEmail(lead: LeadNotificationData) {
  const productsLabel = lead.productsInterested.join(', ') || 'N/A'
  const propertyLabel = lead.propertyType ? PROPERTY_TYPE_LABELS[lead.propertyType] || lead.propertyType : 'N/A'
  const timelineLabel = lead.timeline ? TIMELINE_LABELS[lead.timeline] || lead.timeline : 'N/A'

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a2e;">
  <div style="background: #00C853; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">ShieldHome Pro</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Authorized Vivint Smart Home Dealer</p>
  </div>
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1a1a2e;">Your Free Home Security Quote</h2>
    <p>Hi ${lead.firstName},</p>
    <p>Thanks for requesting your free home security quote! You're one step closer to protecting what matters most.</p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00C853;">
      <h3 style="margin-top: 0;">Here's what happens next:</h3>
      <p>📞 A Vivint Smart Home Pro will call you shortly at <strong>${lead.phone}</strong> to discuss your personalized security recommendation.</p>
      <p>During your free consultation, they'll:</p>
      <ul>
        <li>Assess your home's unique security needs</li>
        <li>Recommend the right cameras, sensors, and smart devices</li>
        <li>Provide a custom quote with current promotions</li>
        <li>Answer any questions — zero pressure, zero obligation</li>
      </ul>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">What you told us:</h3>
      <p>🏠 Property: <strong>${propertyLabel}</strong></p>
      <p>🛡️ Interested in: <strong>${productsLabel}</strong></p>
      <p>⏰ Timeline: <strong>${timelineLabel}</strong></p>
    </div>

    <p>Can't wait for the call? Reach us anytime at <a href="tel:${PHONE_NUMBER}" style="color: #00C853;">${PHONE_NUMBER}</a></p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${APP_URL}" style="background: #00C853; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Learn About Vivint Products →</a>
    </div>

    <p style="color: #666; font-size: 12px;">Talk soon,<br>The ShieldHome Pro Team<br>Authorized Vivint Smart Home Dealer</p>
    <p style="color: #999; font-size: 11px;"><a href="${APP_URL}/unsubscribe" style="color: #999;">Unsubscribe</a> | <a href="${APP_URL}/privacy" style="color: #999;">Privacy Policy</a></p>
  </div>
</body>
</html>`

  const msgId = await sendEmail({
    to: lead.email,
    subject: 'Your Free Home Security Quote — Here\'s What\'s Next',
    html,
  })

  if (msgId) {
    await prisma.emailLog.create({
      data: {
        leadId: lead.id,
        type: 'welcome',
        subject: 'Your Free Home Security Quote — Here\'s What\'s Next',
        sendgridId: msgId,
        status: 'sent',
      }
    })
    await prisma.lead.update({
      where: { id: lead.id },
      data: { emailsSent: { increment: 1 } }
    })
  }
}

export async function sendSlackNotification(lead: LeadNotificationData) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  const priorityEmoji: Record<string, string> = {
    HOT: '🔴', HIGH: '🟠', MEDIUM: '🔵', LOW: '⚪'
  }

  const propertyLabel = lead.propertyType ? PROPERTY_TYPE_LABELS[lead.propertyType] || lead.propertyType : 'N/A'
  const timelineLabel = lead.timeline ? TIMELINE_LABELS[lead.timeline] || lead.timeline : 'N/A'
  const ownershipLabel = lead.homeownership ? HOMEOWNERSHIP_LABELS[lead.homeownership] || lead.homeownership : 'N/A'
  const concerns = lead.productsInterested?.length
    ? lead.productsInterested.map(c => CONCERN_LABELS[c] || c).join(', ')
    : 'N/A'
  const source = [lead.source, lead.medium, lead.campaign].filter(Boolean).join(' / ') || 'Direct'
  const emoji = priorityEmoji[lead.priority] || '🔵'

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blocks: [
          {
            type: 'header',
            text: { type: 'plain_text', text: `${emoji} New Lead: ${lead.fullName}`, emoji: true }
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*📞 Phone:*\n<tel:${lead.phone}|${lead.phone}>` },
              { type: 'mrkdwn', text: `*📧 Email:*\n${lead.email}` },
              { type: 'mrkdwn', text: `*📍 ZIP Code:*\n${lead.zipCode || 'N/A'}` },
              { type: 'mrkdwn', text: `*🏠 Property:*\n${propertyLabel}` },
            ]
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*🔑 Ownership:*\n${ownershipLabel}` },
              { type: 'mrkdwn', text: `*⏰ Timeline:*\n${timelineLabel}` },
              { type: 'mrkdwn', text: `*🚪 Entry Points:*\n${lead.doorsWindows || 'N/A'}` },
              { type: 'mrkdwn', text: `*🛡️ Concerns:*\n${concerns}` },
            ]
          },
          { type: 'divider' },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*📊 Lead Score:*\n${lead.leadScore}/100` },
              { type: 'mrkdwn', text: `*🔥 Priority:*\n${lead.priority}` },
              { type: 'mrkdwn', text: `*📣 Source:*\n${source}` },
            ]
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: '📞 Call Now' },
                url: `tel:${lead.phone}`,
              },
              {
                type: 'button',
                text: { type: 'plain_text', text: 'View in CRM' },
                url: `${APP_URL}/leads/${lead.id}`,
                style: 'primary'
              }
            ]
          }
        ]
      })
    })
  } catch (err) {
    console.error('Slack webhook error:', err)
  }
}

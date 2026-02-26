import { sendSms, formatPhone } from './twilio'
import { sendEmail } from './sendgrid'
import { prisma } from './db'
import { PHONE_NUMBER, PHONE_NUMBER_RAW, APP_URL, COMPANY_NAME } from './constants'
import { PROPERTY_TYPE_LABELS, TIMELINE_LABELS } from './constants'

interface LeadNotificationData {
  id: string
  firstName: string
  lastName: string
  fullName: string
  phone: string
  email: string
  propertyType?: string | null
  timeline?: string | null
  homeownership?: string | null
  leadScore: number
  priority: string
  source?: string | null
  medium?: string | null
  campaign?: string | null
  productsInterested: string[]
  zipCode?: string | null
}

// ---------------------------------------------------------------------------
// Phase 1: Instant notifications on lead submission
// ---------------------------------------------------------------------------

/**
 * SMS to the lead — sets expectations based on time of day and mirrors their quiz
 */
export async function sendLeadConfirmationSms(lead: LeadNotificationData) {
  const hour = new Date().getHours()
  const isBusinessHours = hour >= 8 && hour < 20

  const timeMessage = isBusinessHours
    ? 'A Vivint Smart Home Pro will call you within the next few minutes.'
    : 'A Vivint Smart Home Pro will call you first thing tomorrow morning.'

  const body = [
    `Hi ${lead.firstName}! Thanks for requesting your free home security quote from ${COMPANY_NAME}.`,
    '',
    timeMessage,
    '',
    `Keep an eye out — we also just sent you an email with your quote details.`,
    '',
    `Questions? Call us anytime: ${PHONE_NUMBER}`,
    '',
    `Reply STOP to opt out.`,
  ].join('\n')

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

/**
 * SMS alert to the sales rep — includes everything needed to call immediately
 */
export async function sendRepAlertSms(lead: LeadNotificationData) {
  const repPhones = [process.env.REP_PHONE_NUMBER, process.env.REP_PHONE_NUMBER_2].filter(Boolean) as string[]
  if (repPhones.length === 0) return

  const propertyLabel = lead.propertyType ? PROPERTY_TYPE_LABELS[lead.propertyType] || lead.propertyType : 'Unknown'
  const timelineLabel = lead.timeline ? TIMELINE_LABELS[lead.timeline] || lead.timeline : 'Unknown'
  const productsLabel = lead.productsInterested.length > 0
    ? lead.productsInterested.join(', ')
    : 'Not specified'

  const priorityEmoji: Record<string, string> = {
    HOT: '🔥🔥🔥', HIGH: '🔥🔥', MEDIUM: '🔥', LOW: '📋'
  }

  const hour = new Date().getHours()
  const urgency = lead.priority === 'HOT'
    ? '⚡ CALL WITHIN 60 SECONDS — this one is hot!'
    : lead.priority === 'HIGH'
    ? '📞 CALL NOW — high-intent lead!'
    : hour >= 8 && hour < 20
    ? '📞 Call within 5 minutes for best results.'
    : '☀️ Call first thing tomorrow AM.'

  const body = [
    `${priorityEmoji[lead.priority] || '📋'} NEW LEAD`,
    ``,
    `${lead.fullName}`,
    `📱 ${lead.phone}`,
    `📧 ${lead.email}`,
    `📍 ZIP: ${lead.zipCode || 'N/A'}`,
    ``,
    `Score: ${lead.leadScore}/100 (${lead.priority})`,
    `🏠 ${propertyLabel} | ${lead.homeownership === 'OWN' ? 'Owner' : 'Renter'}`,
    `⏰ ${timelineLabel}`,
    `🛡️ Wants: ${productsLabel}`,
    `📊 Source: ${lead.source || 'Direct'}`,
    ``,
    urgency,
  ].join('\n')

  await Promise.allSettled(repPhones.map(p => sendSms(formatPhone(p), body)))
}

/**
 * Welcome email — rich, personalized based on quiz answers and priority
 */
export async function sendWelcomeEmail(lead: LeadNotificationData) {
  const productsLabel = lead.productsInterested.join(', ') || 'N/A'
  const propertyLabel = lead.propertyType ? PROPERTY_TYPE_LABELS[lead.propertyType] || lead.propertyType : 'N/A'
  const timelineLabel = lead.timeline ? TIMELINE_LABELS[lead.timeline] || lead.timeline : 'N/A'
  const isOwner = lead.homeownership === 'OWN'
  const isHot = lead.priority === 'HOT' || lead.priority === 'HIGH'

  let personalizedNote = ''
  if (isOwner && isHot) {
    personalizedNote = `Based on what you told us, you qualify for our <strong>best available package</strong> — including $0 down, free professional installation, and a free doorbell camera.`
  } else if (isOwner) {
    personalizedNote = `As a homeowner, you're eligible for some great promotions — including free professional installation and a complimentary doorbell camera with qualifying packages.`
  } else {
    personalizedNote = `We have flexible renter-friendly options that work with your situation. Your Smart Home Pro will walk you through the best plans available for renters.`
  }

  const hour = new Date().getHours()
  const callTiming = (hour >= 8 && hour < 20)
    ? `within the next few minutes`
    : `first thing tomorrow morning`

  const html = buildEmailTemplate({
    preheader: `Your free Vivint security quote is being prepared, ${lead.firstName}.`,
    body: `
      <h2 style="color: #1A1A2E; margin-bottom: 8px;">Hi ${lead.firstName}, your free quote is on its way!</h2>

      <p style="color: #555; line-height: 1.6;">${personalizedNote}</p>

      <div style="background: #f0fdf4; border-left: 4px solid #00C853; padding: 18px 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
        <strong style="color: #1A1A2E;">What happens next:</strong>
        <p style="margin: 8px 0 0; color: #333;">A certified Vivint Smart Home Pro will call you ${callTiming} at <strong>${lead.phone}</strong>. The call takes about 5-10 minutes — no pressure, no obligation.</p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
        <tr>
          <td style="padding: 12px 0;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background: #00C853; color: white; width: 28px; height: 28px; border-radius: 50%; text-align: center; font-weight: 700; font-size: 14px; vertical-align: middle;">1</td>
              <td style="padding-left: 14px;">
                <strong style="color: #1A1A2E;">Quick Phone Consultation</strong><br>
                <span style="color: #666; font-size: 14px;">Your Smart Home Pro reviews your answers and recommends the right system for your home.</span>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background: #00C853; color: white; width: 28px; height: 28px; border-radius: 50%; text-align: center; font-weight: 700; font-size: 14px; vertical-align: middle;">2</td>
              <td style="padding-left: 14px;">
                <strong style="color: #1A1A2E;">Custom Quote with Current Deals</strong><br>
                <span style="color: #666; font-size: 14px;">You'll get a personalized quote including any promotions you qualify for.</span>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background: #00C853; color: white; width: 28px; height: 28px; border-radius: 50%; text-align: center; font-weight: 700; font-size: 14px; vertical-align: middle;">3</td>
              <td style="padding-left: 14px;">
                <strong style="color: #1A1A2E;">Professional Installation (If You Decide to Move Forward)</strong><br>
                <span style="color: #666; font-size: 14px;">A Vivint technician comes to your home at a time you choose. Most installations take 2-4 hours.</span>
              </td>
            </tr></table>
          </td>
        </tr>
      </table>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px; color: #1A1A2E; font-size: 16px;">📋 Your Selections</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #666; width: 110px;">Property</td><td style="padding: 6px 0; font-weight: 600; color: #1A1A2E;">${propertyLabel}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Ownership</td><td style="padding: 6px 0; font-weight: 600; color: #1A1A2E;">${isOwner ? 'Homeowner' : 'Renter'}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Interested In</td><td style="padding: 6px 0; font-weight: 600; color: #1A1A2E;">${productsLabel}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Timeline</td><td style="padding: 6px 0; font-weight: 600; color: #1A1A2E;">${timelineLabel}</td></tr>
        </table>
      </div>

      ${isOwner ? `
      <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 16px 20px; border-radius: 8px; margin: 24px 0;">
        <strong style="color: #92400e;">🎁 Current Promotions You May Qualify For:</strong>
        <ul style="margin: 8px 0 0; padding-left: 18px; color: #78350f;">
          <li>FREE Doorbell Camera Pro ($199 value)</li>
          <li>FREE Professional Installation ($199 value)</li>
          <li>$0 Down — no upfront equipment costs</li>
          <li>24/7 professional monitoring from $1.33/day</li>
        </ul>
      </div>
      ` : ''}

      <div style="text-align: center; margin: 30px 0;">
        <a href="tel:${PHONE_NUMBER_RAW}" style="background: #00C853; color: white; padding: 16px 36px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 17px; display: inline-block;">Can't Wait? Call Us Now →</a>
        <p style="color: #999; font-size: 13px; margin-top: 10px;">${PHONE_NUMBER} · Available 8am-9pm ET</p>
      </div>

      <p style="color: #666; font-size: 14px;">Looking forward to helping protect your home,<br><strong>The ${COMPANY_NAME} Team</strong></p>
    `,
  })

  const subject = `${lead.firstName}, your free home security quote is ready`
  const msgId = await sendEmail({ to: lead.email, subject, html })

  if (msgId) {
    await prisma.emailLog.create({
      data: { leadId: lead.id, type: 'welcome', subject, sendgridId: msgId, status: 'sent' }
    })
    await prisma.lead.update({
      where: { id: lead.id },
      data: { emailsSent: { increment: 1 } }
    })
  }
}

/**
 * Slack notification with rich context
 */
export async function sendSlackNotification(lead: LeadNotificationData) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  const priorityEmoji: Record<string, string> = {
    HOT: '🔴', HIGH: '🟠', MEDIUM: '🔵', LOW: '⚪'
  }

  const productsLabel = lead.productsInterested.join(', ') || 'N/A'

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blocks: [
          {
            type: 'header',
            text: { type: 'plain_text', text: `${priorityEmoji[lead.priority] || '🔵'} New Lead: ${lead.fullName} (${lead.leadScore}pts — ${lead.priority})` }
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Phone:*\n<tel:${lead.phone}|${lead.phone}>` },
              { type: 'mrkdwn', text: `*Email:*\n${lead.email}` },
              { type: 'mrkdwn', text: `*Property:*\n${lead.propertyType || 'N/A'} (${lead.homeownership === 'OWN' ? 'Owner' : 'Renter'})` },
              { type: 'mrkdwn', text: `*Timeline:*\n${lead.timeline || 'N/A'}` },
              { type: 'mrkdwn', text: `*Wants:*\n${productsLabel}` },
              { type: 'mrkdwn', text: `*Source:*\n${lead.source || 'Direct'}/${lead.medium || 'N/A'}` }
            ]
          },
          {
            type: 'actions',
            elements: [
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

// ---------------------------------------------------------------------------
// Shared email template builder
// ---------------------------------------------------------------------------

export function buildEmailTemplate({ preheader, body }: { preheader?: string; body: string }): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${preheader ? `<span style="display:none;font-size:1px;color:#fff;max-height:0;overflow:hidden;">${preheader}</span>` : ''}
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin: 0; padding: 0; background: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f5; padding: 20px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr><td style="background: linear-gradient(135deg, #1A1A2E, #0a1a0a); padding: 28px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">🛡️ ${COMPANY_NAME}</h1>
          <p style="color: #00C853; margin: 6px 0 0; font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">Authorized Vivint Smart Home Dealer</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding: 30px; color: #333; line-height: 1.6; font-size: 15px;">
          ${body}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding: 20px 30px; text-align: center; background: #f8f9fa; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; margin: 4px 0;">${COMPANY_NAME} — Authorized Vivint Smart Home Dealer</p>
          <p style="color: #999; font-size: 11px; margin: 4px 0;">
            <a href="${APP_URL}/privacy" style="color: #999;">Privacy Policy</a> ·
            <a href="${APP_URL}/terms" style="color: #999;">Terms</a> ·
            <a href="${APP_URL}/unsubscribe" style="color: #999;">Unsubscribe</a>
          </p>
          <p style="color: #bbb; font-size: 11px; margin: 4px 0;">© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

import { sendSms, formatPhone } from './twilio'
import { sendEmail } from './sendgrid'
import { prisma } from './db'
import { PHONE_NUMBER, APP_URL } from './constants'
import { PROPERTY_TYPE_LABELS, TIMELINE_LABELS, HOMEOWNERSHIP_LABELS, CONCERN_LABELS } from './constants'
import { buildWelcomeEmail, type EmailRecipient } from './email-templates'

const CREDIT_SCORE_LABELS: Record<string, string> = {
  EXCELLENT: 'Excellent (750+)',
  GOOD: 'Good (700–749)',
  FAIR: 'Fair (650–699)',
  BELOW_650: 'Below 650',
  NOT_SURE: 'Not sure',
}

const LANDING_PAGE_LABELS: Record<string, string> = {
  '/': 'Homepage Quiz',
  '/google': 'Google Ads',
  '/get-quote': 'Cost/Pricing (homeshield.pro)',
  '/switch': 'ADT Switch/Buyout',
  '/fb': 'Facebook Ads',
  '/business': 'Commercial / Business Security',
}

interface LeadNotificationData {
  id: string
  firstName: string
  lastName: string
  fullName: string
  phone: string
  email?: string | null
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
  segment?: string | null
  landingPage?: string | null
  currentProvider?: string | null
  contractMonthsRemaining?: string | null
  currentMonthlyPayment?: string | null
  creditScoreRange?: string | null
}

export async function sendLeadConfirmationSms(lead: LeadNotificationData) {
  const isSwitch = lead.segment === 'switch'
  const isUpgrade = lead.segment === 'upgrade'
  const isBusinessSwitch = lead.segment === 'switch-business'
  const isBusiness = lead.segment === 'business'
  let body: string
  if (isBusinessSwitch) {
    body = `Hi ${lead.firstName}! This is ShieldHome Pro. We received your business security audit request${lead.currentProvider ? ` — including your ${lead.currentProvider} contract buyout` : ''}. A Business Security Specialist will call you shortly to go over your options (we cover up to $1,000 in switching costs). Questions? Call/text: ${PHONE_NUMBER}`
  } else if (isBusiness) {
    body = `Hi ${lead.firstName}! This is ShieldHome Pro. We received your free business security audit request! A Business Security Specialist will call you shortly to walk through a custom quote for your business. Questions? Call/text: ${PHONE_NUMBER}`
  } else if (isSwitch) {
    body = `Hi ${lead.firstName}! This is ShieldHome Pro. We received your contract buyout request${lead.currentProvider ? ` for your ${lead.currentProvider} system` : ''}. A Smart Home Pro will call you shortly to discuss your buyout options (up to $1,000 covered). Questions? Call/text us: ${PHONE_NUMBER}`
  } else if (isUpgrade) {
    body = `Hi ${lead.firstName}! This is ShieldHome Pro. We received your upgrade request! A Smart Home Pro will call you shortly to discuss your camera and equipment upgrade options. Questions? Call/text us: ${PHONE_NUMBER}`
  } else {
    body = `Hi ${lead.firstName}! This is ShieldHome Pro, your authorized Vivint dealer. We received your free quote request! A Smart Home Pro will call you shortly at this number. Questions? Call/text us: ${PHONE_NUMBER}`
  }
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

  const priorityEmoji: Record<string, string> = { HOT: '🔴', HIGH: '🟠', MEDIUM: '🔵', LOW: '⚪' }
  const source = [lead.source, lead.medium, lead.campaign].filter(Boolean).join(' / ') || 'Direct'
  const isSwitch = lead.segment === 'switch'
  const isUpgrade = lead.segment === 'upgrade'
  const isBusinessSwitch = lead.segment === 'switch-business'
  const isBusiness = lead.segment === 'business' || isBusinessSwitch
  const creditLabel = lead.creditScoreRange ? (CREDIT_SCORE_LABELS[lead.creditScoreRange] || lead.creditScoreRange) : 'Not provided'
  const lpLabel = lead.landingPage ? (LANDING_PAGE_LABELS[lead.landingPage] || lead.landingPage) : 'Direct'

  let body: string

  if (isBusiness) {
    body = [
      `${priorityEmoji[lead.priority] || '🔵'} 🏢 COMMERCIAL LEAD — ${lead.priority} PRIORITY`,
      ``,
      `👤 ${lead.fullName}`,
      `📞 ${lead.phone}`,
      ``,
      isBusinessSwitch
        ? `🔄 Switching from: ${lead.currentProvider || 'Unknown'}`
        : `🆕 New commercial customer`,
      `📊 Lead Score: ${lead.leadScore}/100`,
      `📣 Source: ${source}`,
      `📍 Page: ${lpLabel}`,
      ``,
      `👉 ${APP_URL}/leads/${lead.id}`,
      isBusinessSwitch
        ? `CALL NOW — business lead switching from ${lead.currentProvider || 'current provider'}, cover up to $1,000 buyout!`
        : `CALL NOW — commercial/business security lead, high intent!`,
    ].join('\n')
  } else if (isSwitch) {
    body = [
      `${priorityEmoji[lead.priority] || '🔵'} CONTRACT BUYOUT LEAD — ${lead.priority} PRIORITY`,
      ``,
      `👤 ${lead.fullName}`,
      `📞 ${lead.phone}`,
      `📧 ${lead.email || 'Not provided'}`,
      `📍 ZIP: ${lead.zipCode || 'N/A'}`,
      ``,
      `🔄 Switching from: ${lead.currentProvider || 'Unknown'}`,
      `📋 Contract left: ${lead.contractMonthsRemaining || 'N/A'}`,
      `💰 Paying now: ${lead.currentMonthlyPayment ? '$' + lead.currentMonthlyPayment + '/mo' : 'Not provided'}`,
      `💳 Credit Score: ${creditLabel}`,
      ``,
      `📊 Lead Score: ${lead.leadScore}/100`,
      `📣 Source: ${source}`,
      `📍 Page: ${lpLabel}`,
      ``,
      `👉 ${APP_URL}/leads/${lead.id}`,
      `CALL NOW — pitch the $1,000 buyout offer!`,
    ].join('\n')
  } else if (isUpgrade) {
    body = [
      `${priorityEmoji[lead.priority] || '🔵'} UPGRADE LEAD — ${lead.priority} PRIORITY`,
      ``,
      `👤 ${lead.fullName}`,
      `📞 ${lead.phone}`,
      `📧 ${lead.email || 'Not provided'}`,
      ``,
      `⬆️ Existing Vivint customer — wants equipment upgrade`,
      `🎯 Offer: Buy 2 cameras get 1 free + up to $500 off`,
      `💳 Credit Score: ${creditLabel}`,
      ``,
      `📊 Lead Score: ${lead.leadScore}/100`,
      `📣 Source: ${source}`,
      `📍 Page: ${lpLabel}`,
      ``,
      `👉 ${APP_URL}/leads/${lead.id}`,
      `CALL NOW — discuss upgrade options!`,
    ].join('\n')
  } else {
    const propertyLabel = lead.propertyType ? PROPERTY_TYPE_LABELS[lead.propertyType] || lead.propertyType : 'Unknown'
    const timelineLabel = lead.timeline ? TIMELINE_LABELS[lead.timeline] || lead.timeline : 'Unknown'
    const products = lead.productsInterested?.length ? lead.productsInterested.join(', ') : 'N/A'

    body = [
      `${priorityEmoji[lead.priority] || '🔵'} NEW LEAD — ${lead.priority} PRIORITY`,
      ``,
      `👤 ${lead.fullName}`,
      `📞 ${lead.phone}`,
      `📧 ${lead.email || 'Not provided'}`,
      `📍 ZIP: ${lead.zipCode || 'N/A'}`,
      ``,
      `🏠 Property: ${propertyLabel}`,
      `⏰ Timeline: ${timelineLabel}`,
      `🛡️ Interested in: ${products}`,
      `💳 Credit Score: ${creditLabel}`,
      ``,
      `📊 Lead Score: ${lead.leadScore}/100`,
      `📣 Source: ${source}`,
      `📍 Page: ${lpLabel}`,
      ``,
      `👉 ${APP_URL}/leads/${lead.id}`,
      `CALL NOW — speed to lead is everything!`,
    ].join('\n')
  }

  await Promise.allSettled(repPhones.map(phone => sendSms(formatPhone(phone), body)))
}

export async function sendWelcomeEmail(lead: LeadNotificationData) {
  if (!lead.email) return

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
    productsInterested: lead.productsInterested,
    creditScoreRange: lead.creditScoreRange,
  }

  const emailContent = buildWelcomeEmail(recipient, unsubUrl)
  const msgId = await sendEmail({ to: lead.email, subject: emailContent.subject, html: emailContent.html })

  if (msgId) {
    await prisma.emailLog.create({
      data: {
        leadId: lead.id,
        type: emailContent.type,
        subject: emailContent.subject,
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
  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL not configured — skipping Slack notification')
    return
  }

  const priorityEmoji: Record<string, string> = {
    HOT: '🔴', HIGH: '🟠', MEDIUM: '🔵', LOW: '⚪'
  }

  const source = [lead.source, lead.medium, lead.campaign].filter(Boolean).join(' / ') || 'Direct'
  const emoji = priorityEmoji[lead.priority] || '🔵'
  const isSwitch = lead.segment === 'switch'
  const isUpgrade = lead.segment === 'upgrade'
  const isBusinessSwitch = lead.segment === 'switch-business'
  const isBusiness = lead.segment === 'business' || isBusinessSwitch
  const isGoogleAds = lead.landingPage === '/google' || lead.landingPage === '/get-quote'

  // Build blocks based on lead type
  const headerText = isBusinessSwitch
    ? `${emoji} 🏢 COMMERCIAL BUYOUT LEAD: ${lead.fullName}`
    : isBusiness
    ? `${emoji} 🏢 COMMERCIAL LEAD: ${lead.fullName}`
    : isSwitch
    ? `${emoji} CONTRACT BUYOUT LEAD: ${lead.fullName}`
    : isUpgrade
    ? `${emoji} UPGRADE LEAD: ${lead.fullName}`
    : isGoogleAds
    ? `${emoji} GOOGLE ADS LEAD: ${lead.fullName}`
    : `${emoji} New Lead: ${lead.fullName}`

  const blocks: any[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: headerText, emoji: true }
    },
  ]

  if (isBusiness) {
    blocks.push(
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: isBusinessSwitch
            ? `🏢 *Commercial customer switching from ${lead.currentProvider || 'current provider'}* — contract buyout up to $1,000`
            : `🏢 *New commercial/business security lead* — $39.99/mo monitoring, no commercial markup`,
        }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*📞 Phone:*\n${lead.phone}` },
          { type: 'mrkdwn', text: `*🏢 Current Provider:*\n${lead.currentProvider || 'None / New'}` },
          { type: 'mrkdwn', text: `*📊 Lead Score:*\n${lead.leadScore}/100` },
          { type: 'mrkdwn', text: `*🔥 Priority:*\n${lead.priority}` },
        ]
      },
    )
  } else if (isUpgrade) {
    blocks.push(
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `⬆️ *Existing Vivint customer* — wants equipment upgrade` }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*📞 Phone:*\n${lead.phone}` },
          { type: 'mrkdwn', text: `*📧 Email:*\n${lead.email || 'Not provided'}` },
          { type: 'mrkdwn', text: `*📊 Lead Score:*\n${lead.leadScore}/100` },
          { type: 'mrkdwn', text: `*🔥 Priority:*\n${lead.priority}` },
        ]
      },
    )
  } else if (isSwitch) {
    // Switch-specific: provider & contract info
    blocks.push(
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `🔄 *Switching from ${lead.currentProvider || 'Unknown Provider'}* — wants contract buyout`,
        }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*📞 Phone:*\n${lead.phone}` },
          { type: 'mrkdwn', text: `*📧 Email:*\n${lead.email || 'Not provided'}` },
          { type: 'mrkdwn', text: `*📍 ZIP Code:*\n${lead.zipCode || 'N/A'}` },
          { type: 'mrkdwn', text: `*🏢 Current Provider:*\n${lead.currentProvider || 'N/A'}` },
        ]
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*📋 Contract Remaining:*\n${lead.contractMonthsRemaining || 'N/A'}` },
          { type: 'mrkdwn', text: `*💰 Current Monthly:*\n${lead.currentMonthlyPayment ? '$' + lead.currentMonthlyPayment + '/mo' : 'Not provided'}` },
          { type: 'mrkdwn', text: `*📊 Lead Score:*\n${lead.leadScore}/100` },
          { type: 'mrkdwn', text: `*🔥 Priority:*\n${lead.priority}` },
        ]
      },
    )
  } else {
    // Quiz / Google Ads lead: property & concerns info
    const propertyLabel = lead.propertyType ? PROPERTY_TYPE_LABELS[lead.propertyType] || lead.propertyType : 'N/A'
    const timelineLabel = lead.timeline ? TIMELINE_LABELS[lead.timeline] || lead.timeline : 'N/A'
    const ownershipLabel = lead.homeownership ? HOMEOWNERSHIP_LABELS[lead.homeownership] || lead.homeownership : 'N/A'
    const concerns = lead.productsInterested?.length
      ? lead.productsInterested.map(c => CONCERN_LABELS[c] || c).join(', ')
      : 'N/A'

    if (isGoogleAds) {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: `🎯 *Google Ads Landing Page* — /get-quote direct lead capture` }
      })
    }

    blocks.push(
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*📞 Phone:*\n${lead.phone}` },
          { type: 'mrkdwn', text: `*📧 Email:*\n${lead.email || 'Not provided'}` },
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
    )
  }

  // Credit score + landing page
  const creditLabel = lead.creditScoreRange ? CREDIT_SCORE_LABELS[lead.creditScoreRange] || lead.creditScoreRange : 'Not provided'
  const landingPageLabel = lead.landingPage ? LANDING_PAGE_LABELS[lead.landingPage] || lead.landingPage : 'Direct'

  // Common footer blocks
  blocks.push(
    { type: 'divider' },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*📊 Lead Score:*\n${lead.leadScore}/100` },
        { type: 'mrkdwn', text: `*🔥 Priority:*\n${lead.priority}` },
        { type: 'mrkdwn', text: `*📣 Source:*\n${source}` },
        { type: 'mrkdwn', text: `*📍 Landing Page:*\n${landingPageLabel}` },
      ]
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*💳 Credit Score:*\n${creditLabel}` },
      ]
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: isBusinessSwitch
            ? `⚡ *COMMERCIAL BUYOUT — pitch contract buyout up to $1,000 + $39.99/mo business monitoring. Call now!*`
            : isBusiness
            ? `⚡ *COMMERCIAL LEAD — pitch $39.99/mo business monitoring, no commercial markup. Call now!*`
            : isSwitch
            ? `⚡ *BUYOUT LEAD — pitch the $1,000 contract buyout offer. Call now!*`
            : isUpgrade
            ? `⚡ *UPGRADE LEAD — existing customer, discuss camera & equipment upgrade options!*`
            : isGoogleAds
            ? `⚡ *GOOGLE ADS LEAD — high intent, call immediately!*`
            : `⚡ *Speed to lead is everything — call now!*`,
        }
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
  )

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks })
    })
    if (!response.ok) {
      const text = await response.text()
      console.error(`Slack webhook failed (${response.status}):`, text)
    }
  } catch (err) {
    console.error('Slack webhook error:', err)
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { sendSms, formatPhone } from '@/lib/twilio'
import { sendEmail } from '@/lib/sendgrid'
import { APP_URL } from '@/lib/constants'

const META_PHONE = process.env.NEXT_PUBLIC_META_PHONE || '(801) 348-6050'

const metaLeadSchema = z.object({
  // Contact (phone-first: email + zip are optional, captured in Step B)
  firstName: z.string().min(1).max(50),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(20),
  zipCode: z.string().length(5).optional(),
  smsConsent: z.boolean().default(false),
  tcpaConsent: z.boolean().default(false),

  // Quiz answers
  quizAnswers: z.object({
    propertyType: z.string().optional(),
    ownership: z.string().optional(),
    topConcern: z.string().optional(),
    neighborhood: z.string().optional(),
    currentSystem: z.string().optional(),
    features: z.array(z.string()).optional(),
    timeline: z.string().optional(),
  }),

  // Computed
  securityScore: z.number().min(0).max(100),
  riskLevel: z.string(),
  recommendedPackage: z.string(),
  vulnerabilities: z.array(z.string()).optional(),
  leadScore: z.number().default(0),
  priority: z.string().default('MEDIUM'),
  urgencyLevel: z.string().default('researching'),

  // Funnel tracking
  quizStartedAt: z.string().optional(),

  // Attribution
  fbclid: z.string().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
  utmSource: z.string().default('facebook'),
  utmMedium: z.string().default('paid'),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  utmAdset: z.string().optional(),
  utmAdId: z.string().optional(),
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
  deviceType: z.string().optional(),
  browser: z.string().optional(),
  eventId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = metaLeadSchema.parse(body)

    // Rate limit: max 5 submissions per IP per hour
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || undefined
    if (ipAddress) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const recentFromIP = await prisma.metaQuizLead.count({
        where: { ipAddress, createdAt: { gte: oneHourAgo } },
      })
      if (recentFromIP >= 5) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
      }
    }

    // Check for duplicate phone in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const orConditions: Array<{ phone?: string; email?: string }> = [{ phone: data.phone }]
    if (data.email) orConditions.push({ email: data.email })

    const existing = await prisma.metaQuizLead.findFirst({
      where: {
        OR: orConditions,
        createdAt: { gte: thirtyDaysAgo },
      },
    })

    if (existing) {
      await prisma.metaQuizLead.update({
        where: { id: existing.id },
        data: { notes: (existing.notes || '') + '\n[Duplicate submission]' },
      })

      // Still alert reps for duplicates
      await Promise.allSettled([
        sendMetaRepAlertSms(existing),
        sendMetaSlackNotification(existing),
      ])

      return NextResponse.json({ success: true, leadId: existing.id, message: 'Assessment received' })
    }

    // Create the lead
    const lead = await prisma.metaQuizLead.create({
      data: {
        firstName: data.firstName,
        email: data.email || null,
        phone: data.phone,
        zipCode: data.zipCode || null,

        quizAnswers: data.quizAnswers,
        securityScore: data.securityScore,
        riskLevel: data.riskLevel,
        recommendedPackage: data.recommendedPackage,
        urgencyLevel: data.urgencyLevel,

        isHomeowner: data.quizAnswers.ownership === 'own' || data.quizAnswers.ownership === 'buying',
        propertyType: data.quizAnswers.propertyType,
        hasCurrentSystem: data.quizAnswers.currentSystem,
        topConcern: data.quizAnswers.topConcern,

        quizStartedAt: data.quizStartedAt ? new Date(data.quizStartedAt) : null,
        quizCompletedAt: new Date(),
        contactSubmittedAt: new Date(),

        fbclid: data.fbclid,
        fbp: data.fbp,
        fbc: data.fbc,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        utmContent: data.utmContent,
        utmTerm: data.utmTerm,
        utmAdset: data.utmAdset,
        utmAdId: data.utmAdId,
        landingPage: data.landingPage,
        referrer: data.referrer,
        deviceType: data.deviceType,
        browser: data.browser,
        ipAddress,

        leadScore: data.leadScore,
        priority: data.priority,

        smsConsent: data.smsConsent,
        tcpaConsent: data.tcpaConsent,
        tcpaConsentAt: data.tcpaConsent ? new Date() : null,
      },
    })

    // Fire all notifications + CAPI in parallel — must be awaited or Vercel kills them
    const notifications: Promise<unknown>[] = [
      sendMetaLeadConfirmationSms(lead),
      sendMetaRepAlertSms(lead),
      sendMetaSlackNotification(lead),
      sendMetaCapiEvent(lead, data, ipAddress, req.headers.get('user-agent') || undefined),
    ]
    // Only send email if we have an email address (may come later in Step B)
    if (lead.email) {
      notifications.push(sendMetaLeadEmail(lead))
    }
    await Promise.allSettled(notifications)

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      securityScore: lead.securityScore,
      riskLevel: lead.riskLevel,
      recommendedPackage: lead.recommendedPackage,
    })
  } catch (err: unknown) {
    console.error('Meta lead creation error:', err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid form data', details: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================
// META-SPECIFIC NOTIFICATION FUNCTIONS
// ============================================

interface MetaLeadData {
  id: string
  firstName: string
  email: string | null
  phone: string
  zipCode: string | null
  securityScore: number
  riskLevel: string
  recommendedPackage: string
  leadScore: number
  priority: string
  urgencyLevel: string
  propertyType: string | null
  hasCurrentSystem: string | null
  topConcern: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  landingPage: string | null
  notes: string | null
}

async function sendMetaLeadConfirmationSms(lead: MetaLeadData) {
  const body = `Hi ${lead.firstName}! Your Home Security Score is ready: ${lead.securityScore}/100. A ShieldHome specialist will review your results and call you shortly. Questions? Call/text us: ${META_PHONE} \u2014 ShieldHome Pro`
  await sendSms(formatPhone(lead.phone), body)

  await prisma.metaQuizLead.update({
    where: { id: lead.id },
    data: { smsToLeadSent: true },
  })
}

async function sendMetaRepAlertSms(lead: MetaLeadData) {
  const repPhones = [
    process.env.REP_PHONE_NUMBERS,
    process.env.REP_PHONE_NUMBER,
  ]
    .filter(Boolean)
    .flatMap(v => v!.split(',').map(p => p.trim()))
    .filter(Boolean)

  if (repPhones.length === 0) return

  const priorityEmoji: Record<string, string> = { HOT: '\u{1F534}', HIGH: '\u{1F7E0}', MEDIUM: '\u{1F535}', LOW: '\u{26AA}' }
  const source = [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(' / ') || 'Meta Ads'

  const body = [
    `${priorityEmoji[lead.priority] || '\u{1F535}'} NEW META LEAD \u2014 ${lead.priority}`,
    '',
    `\u{1F464} ${lead.firstName}`,
    `\u{1F4DE} ${lead.phone}`,
    `\u{1F4E7} ${lead.email || 'Not provided yet'}`,
    `\u{1F4CD} ZIP: ${lead.zipCode || 'Not provided yet'}`,
    '',
    `\u{1F3E0} ${lead.propertyType || 'N/A'} | ${lead.hasCurrentSystem || 'N/A'}`,
    `\u{23F0} Timeline: ${lead.urgencyLevel}`,
    `\u{1F6E1}\u{FE0F} Concern: ${lead.topConcern || 'N/A'}`,
    `\u{1F4CA} Security Score: ${lead.securityScore}/100`,
    `\u{1F525} Lead Score: ${lead.leadScore}/100`,
    '',
    `\u{1F4E3} Source: ${source}`,
    '',
    `\u{1F449} ${APP_URL}/meta-leads/${lead.id}`,
    `CALL NOW \u2014 speed to lead is everything!`,
  ].join('\n')

  await Promise.allSettled(repPhones.map(phone => sendSms(formatPhone(phone), body)))

  await prisma.metaQuizLead.update({
    where: { id: lead.id },
    data: { smsToRepSent: true },
  })
}

async function sendMetaSlackNotification(lead: MetaLeadData) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  const priorityEmoji: Record<string, string> = { HOT: '\u{1F534}', HIGH: '\u{1F7E0}', MEDIUM: '\u{1F535}', LOW: '\u{26AA}' }
  const emoji = priorityEmoji[lead.priority] || '\u{1F535}'
  const source = [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(' / ') || 'Meta Ads'

  const riskEmoji = lead.riskLevel === 'high' ? '\u{1F534}' : lead.riskLevel === 'medium' ? '\u{1F7E1}' : '\u{1F7E2}'

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `${emoji} META QUIZ LEAD: ${lead.firstName}`, emoji: true },
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: `${riskEmoji} *Security Score: ${lead.securityScore}/100* \u2014 Risk Level: *${lead.riskLevel.toUpperCase()}*` },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*\u{1F4DE} Phone:*\n${lead.phone}` },
        { type: 'mrkdwn', text: `*\u{1F4E7} Email:*\n${lead.email}` },
        { type: 'mrkdwn', text: `*\u{1F4CD} ZIP Code:*\n${lead.zipCode}` },
        { type: 'mrkdwn', text: `*\u{1F3E0} Property:*\n${lead.propertyType || 'N/A'}` },
      ],
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*\u{23F0} Timeline:*\n${lead.urgencyLevel}` },
        { type: 'mrkdwn', text: `*\u{1F6E1}\u{FE0F} Concern:*\n${lead.topConcern || 'N/A'}` },
        { type: 'mrkdwn', text: `*\u{1F4CA} Lead Score:*\n${lead.leadScore}/100` },
        { type: 'mrkdwn', text: `*\u{1F525} Priority:*\n${lead.priority}` },
      ],
    },
    { type: 'divider' },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*\u{1F4E3} Source:*\n${source}` },
        { type: 'mrkdwn', text: `*\u{1F4E6} Package:*\n${lead.recommendedPackage}` },
      ],
    },
    {
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: `\u{26A1} *META QUIZ LEAD \u2014 call now! Security Score ${lead.securityScore}/100 creates urgency.*` },
      ],
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'View Lead' },
          url: `${APP_URL}/meta-leads/${lead.id}`,
          style: 'primary',
        },
      ],
    },
  ]

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    })
    if (!response.ok) {
      console.error(`Meta Slack webhook failed (${response.status}):`, await response.text())
    }

    await prisma.metaQuizLead.update({
      where: { id: lead.id },
      data: { slackNotifSent: true },
    })
  } catch (err) {
    console.error('Meta Slack webhook error:', err)
  }
}

async function sendMetaLeadEmail(lead: MetaLeadData) {
  if (!lead.email) return

  const bookingUrl = `tel:+18013486050`
  const riskColor = lead.riskLevel === 'high' ? '#EF4444' : lead.riskLevel === 'medium' ? '#F59E0B' : '#10B981'

  const subject = `Your Home Security Score: ${lead.securityScore}/100 \u2014 Here's Your Plan`

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1E293B; font-size: 24px; margin: 0;">Your Home Security Score</h1>
      </div>

      <div style="text-align: center; padding: 24px; background: #F8FAFC; border-radius: 12px; margin-bottom: 24px;">
        <div style="font-size: 48px; font-weight: bold; color: ${riskColor};">${lead.securityScore}/100</div>
        <div style="font-size: 14px; color: #64748B; margin-top: 4px;">Risk Level: <strong style="color: ${riskColor};">${lead.riskLevel.toUpperCase()}</strong></div>
      </div>

      <p style="color: #334155; font-size: 16px; line-height: 1.6;">
        Hi ${lead.firstName},
      </p>
      <p style="color: #334155; font-size: 16px; line-height: 1.6;">
        Based on your Home Security Assessment, your home has some vulnerabilities that should be addressed.
        We've put together a personalized protection plan based on your answers.
      </p>

      <div style="background: #ECFDF5; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #065F46; font-size: 18px; margin: 0 0 12px;">Your Recommended Package</h2>
        <p style="color: #047857; font-size: 14px; margin: 0;">
          <strong>The Total Shield Package</strong> \u2014 Complete Vivint Smart Home system with professional
          installation, 24/7 monitoring, and our Welcome Home Reward.
        </p>
        <p style="color: #047857; font-size: 14px; margin: 8px 0 0;">
          <strong>Your cost: $0 down + as low as $39.99/mo</strong>
        </p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${bookingUrl}" style="display: inline-block; background: #10B981; color: white; font-weight: bold; font-size: 16px; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
          Book My Free Home Assessment
        </a>
        <p style="color: #94A3B8; font-size: 12px; margin-top: 8px;">Free \u2022 No obligation \u2022 Takes 15 minutes</p>
      </div>

      <p style="color: #64748B; font-size: 14px; line-height: 1.6;">
        Or call us directly: <a href="tel:+18013486050" style="color: #10B981; font-weight: bold;">${META_PHONE}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;" />

      <p style="color: #94A3B8; font-size: 12px; text-align: center;">
        ShieldHome Pro \u2014 Authorized Vivint Smart Home Dealer<br/>
        You received this email because you completed a Home Security Assessment at shieldhomepro.com.
      </p>
    </div>
  `

  await sendEmail({ to: lead.email, subject, html })

  await prisma.metaQuizLead.update({
    where: { id: lead.id },
    data: { emailToLeadSent: true },
  })
}

async function sendMetaCapiEvent(
  lead: MetaLeadData,
  data: z.infer<typeof metaLeadSchema>,
  ipAddress: string | undefined,
  userAgent: string | undefined,
) {
  if (!process.env.META_CAPI_ACCESS_TOKEN) return

  try {
    await fetch(`${APP_URL}/api/meta-capi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'Lead',
        eventId: data.eventId || lead.id,
        sourceUrl: `${APP_URL}/meta`,
        userData: {
          email: lead.email,
          phone: lead.phone,
          firstName: lead.firstName,
          zipCode: lead.zipCode,
          fbp: data.fbp,
          fbc: data.fbc,
          clientIpAddress: ipAddress,
          clientUserAgent: userAgent,
        },
        customData: {
          value: 50.0,
          currency: 'USD',
          content_name: 'meta_quiz_lead',
          content_category: 'home_security',
          security_score: lead.securityScore,
          risk_level: lead.riskLevel,
        },
      }),
    })
  } catch (err) {
    console.error('Meta CAPI call failed:', err)
  }
}

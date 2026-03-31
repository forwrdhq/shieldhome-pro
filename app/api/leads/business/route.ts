import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { businessLeadSchema, businessQualifySchema } from '@/lib/validation'
import { calculateLeadScore } from '@/lib/lead-scoring'
import { sendLeadConfirmationSms, sendRepAlertSms, sendSlackNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = businessLeadSchema.parse(body)

    // Rate limit: max 5 submissions per IP per hour
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || undefined
    if (ipAddress) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const recentFromIP = await prisma.lead.count({
        where: { ipAddress, createdAt: { gte: oneHourAgo } }
      })
      if (recentFromIP >= 5) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
      }
    }

    // Check for duplicate phone in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const existing = await prisma.lead.findFirst({
      where: { phone: data.phone, createdAt: { gte: thirtyDaysAgo } }
    })
    if (existing) {
      await prisma.lead.update({
        where: { id: existing.id },
        data: { notes: (existing.notes || '') + '\n[Business LP duplicate submission]' }
      })
      const notifData = buildNotifData(existing)
      await Promise.allSettled([
        sendSlackNotification(notifData),
        sendRepAlertSms(notifData),
      ])
      return NextResponse.json({ success: true, leadId: existing.id })
    }

    // Parse full name into first/last
    const nameParts = data.fullName.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || ''

    // Determine segment
    const switchProviders = ['ADT', 'Ring', 'SimpliSafe', 'Brinks']
    const isSwitcher = data.currentProvider && switchProviders.includes(data.currentProvider)
    const segment = isSwitcher ? 'switch-business' : 'business'

    // Score with business defaults
    const { score, priority } = calculateLeadScore({
      homeownership: 'OWN',
      propertyType: 'BUSINESS',
      timeline: 'ASAP',
      productsInterested: ['FULL_SYSTEM'],
      source: data.source || 'google',
      deviceType: data.deviceType || undefined,
      segment,
    })

    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        fullName: data.fullName.trim(),
        email: '',
        phone: data.phone,
        zipCode: '',
        propertyType: 'BUSINESS',
        source: data.source || 'google',
        medium: data.medium || 'cpc',
        campaign: data.campaign,
        gclid: data.gclid,
        fbclid: data.fbclid,
        kwParam: data.kwParam,
        utmContent: data.utmContent,
        keyword: data.keyword,
        landingPage: data.landingPage || '/business',
        referrer: data.referrer,
        deviceType: data.deviceType,
        browser: data.browser,
        currentProvider: data.currentProvider,
        segment,
        ipAddress,
        leadScore: score,
        priority: priority as any,
        notes: `[Business LP — ${data.businessType || 'business'}${data.currentProvider ? ` switching from ${data.currentProvider}` : ''} — ${data.numLocations || '1'} location(s)]`,
      }
    })

    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: 'LEAD_CREATED',
        description: `Business landing page lead created. Score: ${score}/${priority}. Segment: ${segment}`,
      }
    })

    // Fire notifications immediately — speed to lead
    const notifData = buildNotifData(lead)
    await Promise.allSettled([
      sendRepAlertSms(notifData),
      sendSlackNotification(notifData),
      sendLeadConfirmationSms(notifData),
    ])

    return NextResponse.json({ success: true, leadId: lead.id })
  } catch (err: any) {
    console.error('Business lead creation error:', err)
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid form data', details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PATCH — Step 2 qualifier enrichment ──────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const data = businessQualifySchema.parse(body)

    const lead = await prisma.lead.findUnique({ where: { id: data.leadId } })
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const switchProviders = ['ADT', 'Ring', 'SimpliSafe', 'Brinks']
    const isSwitcher = data.currentProvider && switchProviders.includes(data.currentProvider)
    const segment = isSwitcher ? 'switch-business' : 'business'

    const updatedLead = await prisma.lead.update({
      where: { id: data.leadId },
      data: {
        currentProvider: data.currentProvider || lead.currentProvider,
        segment,
        notes: (lead.notes || '') + `\n[Qualified: ${data.numLocations || '1'} location(s), ${data.monthsRemaining || 'no contract'} remaining${data.currentProvider ? `, switching from ${data.currentProvider}` : ''}]`,
      },
    })

    await prisma.activity.create({
      data: {
        leadId: data.leadId,
        type: 'NOTE_ADDED',
        description: `Step 2 qualification: provider=${data.currentProvider || 'none'}, locations=${data.numLocations}, contract=${data.monthsRemaining}`,
      },
    })

    return NextResponse.json({ success: true, leadId: updatedLead.id })
  } catch (err: any) {
    console.error('Business qualify error:', err)
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function buildNotifData(lead: any) {
  return {
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    fullName: lead.fullName,
    phone: lead.phone,
    email: lead.email,
    zipCode: lead.zipCode,
    propertyType: lead.propertyType,
    homeownership: lead.homeownership,
    doorsWindows: lead.doorsWindows,
    timeline: lead.timeline,
    leadScore: lead.leadScore,
    priority: lead.priority,
    source: lead.source,
    medium: lead.medium,
    campaign: lead.campaign,
    productsInterested: lead.productsInterested || [],
    segment: lead.segment,
    landingPage: lead.landingPage,
    currentProvider: lead.currentProvider,
    contractMonthsRemaining: lead.contractMonthsRemaining,
    currentMonthlyPayment: lead.currentMonthlyPayment,
    creditScoreRange: lead.creditScoreRange,
  }
}

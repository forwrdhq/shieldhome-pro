import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { leadSchema } from '@/lib/validation'
import { calculateLeadScore } from '@/lib/lead-scoring'
import { sendLeadConfirmationSms, sendRepAlertSms, sendWelcomeEmail, sendSlackNotification, sendCallinglyWebhook } from '@/lib/notifications'

// Callingly dials for confirmed 650+ and for unknowns (NOT_SURE / missing) —
// a sizeable share of real buyers don't know their score off the top of their
// head. Only confirmed below-650 is held back.
const CALLINGLY_SKIP_CREDIT = new Set(['BELOW_650'])
function shouldTriggerCallingly(creditScoreRange: string | null | undefined) {
  return !creditScoreRange || !CALLINGLY_SKIP_CREDIT.has(creditScoreRange)
}

// Rep-facing alerts (Slack + SMS to Gunnar) are suppressed for confirmed
// below-650 leads — they still save to the DB and get the customer-facing
// confirmation email, reps just don't get pinged.
const REP_ALERT_SKIP_CREDIT = new Set(['BELOW_650'])
function shouldAlertRep(creditScoreRange: string | null | undefined) {
  return !creditScoreRange || !REP_ALERT_SKIP_CREDIT.has(creditScoreRange)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = leadSchema.parse(body)

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

    // Check for duplicates in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const existing = await prisma.lead.findFirst({
      where: {
        OR: [{ phone: data.phone }, { email: data.email }],
        createdAt: { gte: thirtyDaysAgo },
      }
    })
    if (existing) {
      // Merge incoming fields into the existing lead — the hero form creates a
      // partial record, and the full quiz submission is where the real data
      // (segment, credit score, property type, etc.) finally shows up. Without
      // this merge, reps see a stale notification with "Not provided" fields.
      const merged = {
        firstName: data.firstName || existing.firstName,
        lastName: data.lastName || existing.lastName,
        email: data.email ?? existing.email,
        zipCode: data.zipCode || existing.zipCode,
        fullName: [data.firstName || existing.firstName, data.lastName || existing.lastName].filter(Boolean).join(' '),
        propertyType: (data.propertyType as any) ?? existing.propertyType,
        homeownership: (data.homeownership as any) ?? existing.homeownership,
        productsInterested: data.productsInterested?.length ? data.productsInterested : existing.productsInterested,
        timeline: (data.timeline as any) ?? existing.timeline,
        doorsWindows: data.entryPoints ?? existing.doorsWindows,
        segment: data.segment ?? existing.segment,
        currentProvider: data.currentProvider ?? existing.currentProvider,
        contractMonthsRemaining: data.contractMonthsRemaining ?? existing.contractMonthsRemaining,
        currentMonthlyPayment: data.currentMonthlyPayment ?? existing.currentMonthlyPayment,
        creditScoreRange: data.creditScoreRange ?? existing.creditScoreRange,
        source: data.source ?? existing.source,
        medium: data.medium ?? existing.medium,
        campaign: data.campaign ?? existing.campaign,
        adSet: data.adSet ?? existing.adSet,
        adId: data.adId ?? existing.adId,
        keyword: data.keyword ?? existing.keyword,
        utmContent: data.utmContent ?? existing.utmContent,
        gclid: data.gclid ?? existing.gclid,
        fbclid: data.fbclid ?? existing.fbclid,
        kwParam: data.kwParam ?? existing.kwParam,
        landingPage: data.landingPage ?? existing.landingPage,
        referrer: data.referrer ?? existing.referrer,
        tcpaConsent: existing.tcpaConsent || (data.tcpaConsent ?? false),
        tcpaConsentAt: existing.tcpaConsentAt ?? (data.tcpaConsent ? new Date() : null),
      }

      const { score, priority } = calculateLeadScore({
        homeownership: merged.homeownership || 'OWN',
        propertyType: merged.propertyType || 'HOUSE',
        timeline: merged.timeline || 'ASAP',
        productsInterested: merged.productsInterested?.length ? merged.productsInterested : ['FULL_SYSTEM'],
        source: merged.source || undefined,
        deviceType: existing.deviceType || undefined,
        segment: merged.segment || undefined,
      })

      const updated = await prisma.lead.update({
        where: { id: existing.id },
        data: {
          ...merged,
          leadScore: score,
          priority: priority as any,
          notes: (existing.notes || '') + '\n[Duplicate submission — merged]',
        }
      })

      const dupNotifData = {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        fullName: updated.fullName,
        phone: updated.phone,
        email: updated.email,
        zipCode: updated.zipCode,
        propertyType: updated.propertyType,
        homeownership: updated.homeownership,
        doorsWindows: updated.doorsWindows,
        timeline: updated.timeline,
        leadScore: updated.leadScore,
        priority: updated.priority,
        source: updated.source,
        medium: updated.medium,
        campaign: updated.campaign,
        productsInterested: updated.productsInterested,
        segment: updated.segment,
        landingPage: updated.landingPage,
        currentProvider: updated.currentProvider,
        contractMonthsRemaining: updated.contractMonthsRemaining,
        currentMonthlyPayment: updated.currentMonthlyPayment,
        creditScoreRange: updated.creditScoreRange,
      }

      const dupNotifications: Promise<unknown>[] = []
      if (shouldAlertRep(updated.creditScoreRange)) {
        dupNotifications.push(sendSlackNotification(dupNotifData))
        dupNotifications.push(sendRepAlertSms(dupNotifData))
      }
      if (shouldTriggerCallingly(updated.creditScoreRange)) {
        dupNotifications.push(sendCallinglyWebhook(dupNotifData))
      }
      await Promise.allSettled(dupNotifications)

      return NextResponse.json({ success: true, leadId: updated.id, message: 'Quote request received' })
    }

    // Score the lead — provide defaults for switch leads (high-intent buyout leads)
    const { score, priority } = calculateLeadScore({
      homeownership: data.homeownership || 'OWN',
      propertyType: data.propertyType || 'HOUSE',
      timeline: data.timeline || 'ASAP',
      productsInterested: data.productsInterested?.length ? data.productsInterested : ['FULL_SYSTEM'],
      source: data.source || undefined,
      deviceType: data.deviceType || undefined,
      segment: data.segment || undefined,
    })

    // Create the lead
    const lead = await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        zipCode: data.zipCode || null,
        fullName: [data.firstName, data.lastName].filter(Boolean).join(' '),
        propertyType: (data.propertyType as any) || null,
        homeownership: (data.homeownership as any) || null,
        productsInterested: data.productsInterested || [],
        timeline: (data.timeline as any) || null,
        doorsWindows: data.entryPoints,
        segment: data.segment,
        currentProvider: data.currentProvider,
        contractMonthsRemaining: data.contractMonthsRemaining,
        currentMonthlyPayment: data.currentMonthlyPayment,
        creditScoreRange: data.creditScoreRange,
        leadScore: score,
        priority: priority as any,
        source: data.source,
        medium: data.medium,
        campaign: data.campaign,
        adSet: data.adSet,
        adId: data.adId,
        keyword: data.keyword,
        utmContent: data.utmContent,
        gclid: data.gclid,
        fbclid: data.fbclid,
        kwParam: data.kwParam,
        landingPage: data.landingPage,
        referrer: data.referrer,
        deviceType: data.deviceType,
        browser: data.browser,
        ipAddress,
        tcpaConsent: data.tcpaConsent ?? false,
        tcpaConsentAt: data.tcpaConsent ? new Date() : null,
      }
    })

    // Log creation activity
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: 'LEAD_CREATED',
        description: `Lead created via ${data.source || 'direct'} with score ${score}/${priority}${data.segment === 'switch' ? ` [SWITCH from ${data.currentProvider || 'unknown'}]` : ''}`,
      }
    })

    // Fire notifications — must be awaited or Vercel kills them before completion
    const notifData = {
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
      productsInterested: lead.productsInterested,
      segment: lead.segment,
      landingPage: lead.landingPage,
      currentProvider: lead.currentProvider,
      contractMonthsRemaining: lead.contractMonthsRemaining,
      currentMonthlyPayment: lead.currentMonthlyPayment,
      creditScoreRange: lead.creditScoreRange,
    }

    const notifications: Promise<unknown>[] = [
      sendLeadConfirmationSms(notifData),
      sendWelcomeEmail(notifData),
    ]
    if (shouldAlertRep(lead.creditScoreRange)) {
      notifications.push(sendRepAlertSms(notifData))
      notifications.push(sendSlackNotification(notifData))
    }
    if (shouldTriggerCallingly(lead.creditScoreRange)) {
      notifications.push(sendCallinglyWebhook(notifData))
    }

    await Promise.allSettled(notifications)

    return NextResponse.json({ success: true, leadId: lead.id, message: 'Quote request received' })
  } catch (err: any) {
    console.error('Lead creation error:', err)
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid form data', details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const source = searchParams.get('source')
    const priority = searchParams.get('priority')
    const assignedRepId = searchParams.get('assignedRepId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sort = searchParams.get('sort') || 'submittedAt'
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc'

    const where: any = {}
    if (status) where.status = status
    if (source) where.source = source
    if (priority) where.priority = priority
    if (assignedRepId) where.assignedRepId = assignedRepId
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ]
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          assignedRep: { select: { id: true, name: true, email: true } }
        }
      }),
      prisma.lead.count({ where })
    ])

    // Stats
    const [byStatus, avgScore] = await Promise.all([
      prisma.lead.groupBy({ by: ['status'], _count: true }),
      prisma.lead.aggregate({ _avg: { leadScore: true, speedToContact: true } })
    ])

    return NextResponse.json({
      leads,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      stats: {
        total,
        byStatus: byStatus.reduce((acc: any, s) => { acc[s.status] = s._count; return acc }, {}),
        avgLeadScore: Math.round(avgScore._avg.leadScore || 0),
        avgSpeedToContact: Math.round(avgScore._avg.speedToContact || 0),
      }
    })
  } catch (err) {
    console.error('Get leads error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

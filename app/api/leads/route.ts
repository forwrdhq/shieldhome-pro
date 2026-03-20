import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { leadSchema } from '@/lib/validation'
import { calculateLeadScore } from '@/lib/lead-scoring'
import { sendLeadConfirmationSms, sendRepAlertSms, sendWelcomeEmail, sendSlackNotification } from '@/lib/notifications'
import { syncLeadToGhl } from '@/lib/gohighlevel'

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
      // Update the existing lead rather than reject
      await prisma.lead.update({
        where: { id: existing.id },
        data: { notes: (existing.notes || '') + '\n[Duplicate submission]' }
      })

      // Still fire notifications for duplicates so reps are alerted
      const dupNotifData = {
        id: existing.id,
        firstName: existing.firstName,
        lastName: existing.lastName,
        fullName: existing.fullName,
        phone: existing.phone,
        email: existing.email,
        zipCode: existing.zipCode,
        propertyType: existing.propertyType,
        homeownership: existing.homeownership,
        doorsWindows: existing.doorsWindows,
        timeline: existing.timeline,
        leadScore: existing.leadScore,
        priority: existing.priority,
        source: existing.source,
        medium: existing.medium,
        campaign: existing.campaign,
        productsInterested: existing.productsInterested,
      }

      Promise.allSettled([
        sendSlackNotification(dupNotifData),
        sendRepAlertSms(dupNotifData),
      ]).catch(console.error)

      return NextResponse.json({ success: true, leadId: existing.id, message: 'Quote request received' })
    }

    // Score the lead
    const { score, priority } = calculateLeadScore({
      homeownership: data.homeownership,
      propertyType: data.propertyType,
      timeline: data.timeline,
      productsInterested: data.productsInterested,
      source: data.source || undefined,
      deviceType: data.deviceType || undefined,
    })

    // Create the lead
    const lead = await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        zipCode: data.zipCode,
        fullName: [data.firstName, data.lastName].filter(Boolean).join(' '),
        propertyType: data.propertyType as any,
        homeownership: data.homeownership as any,
        productsInterested: data.productsInterested,
        timeline: data.timeline as any,
        doorsWindows: data.entryPoints,
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
        description: `Lead created via ${data.source || 'direct'} with score ${score}/${priority}`,
      }
    })

    // Fire notifications asynchronously (don't block response)
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
    }

    Promise.allSettled([
      sendLeadConfirmationSms(notifData),
      sendRepAlertSms(notifData),
      sendWelcomeEmail(notifData),
      sendSlackNotification(notifData),
      syncLeadToGhl({
        ...notifData,
        fullName: lead.fullName,
        status: lead.status,
        saleAmount: lead.saleAmount,
      }),
    ]).catch(console.error)

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

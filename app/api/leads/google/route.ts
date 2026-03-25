import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { googleStep1Schema, googleStep2Schema, googleStep3Schema } from '@/lib/validation'
import { calculateLeadScore } from '@/lib/lead-scoring'
import { sendLeadConfirmationSms, sendRepAlertSms, sendWelcomeEmail, sendSlackNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = googleStep1Schema.parse(body)

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
        data: { notes: (existing.notes || '') + '\n[Google LP duplicate submission]' }
      })
      // Still alert reps for duplicates
      const notifData = buildNotifData(existing)
      await Promise.allSettled([
        sendSlackNotification(notifData),
        sendRepAlertSms(notifData),
      ])
      return NextResponse.json({ success: true, leadId: existing.id })
    }

    // Parse full name into first/last
    const nameParts = data.firstName.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || ''

    // Score with defaults for missing fields
    const { score, priority } = calculateLeadScore({
      homeownership: 'OWN',
      propertyType: 'HOUSE',
      timeline: 'ASAP',
      productsInterested: ['FULL_SYSTEM'],
      source: 'google',
      deviceType: data.deviceType || undefined,
    })

    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        fullName: data.firstName.trim(),
        email: '',
        phone: data.phone,
        zipCode: data.zipCode,
        source: data.source || 'google',
        medium: data.medium || 'cpc',
        campaign: data.campaign,
        gclid: data.gclid,
        fbclid: data.fbclid,
        kwParam: data.kwParam,
        utmContent: data.utmContent,
        keyword: data.keyword,
        landingPage: data.landingPage || '/google',
        referrer: data.referrer,
        deviceType: data.deviceType,
        browser: data.browser,
        ipAddress,
        leadScore: score,
        priority: priority as any,
        notes: '[Google LP Step 1 — phone-only lead]',
      }
    })

    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: 'LEAD_CREATED',
        description: `Google Ads lead created (Step 1 — phone only) with score ${score}/${priority}`,
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
    console.error('Google lead creation error:', err)
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid form data', details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const step = body.step as number

    if (step === 2) {
      const data = googleStep2Schema.parse(body)

      const isBuyoutCandidate = data.hasSystem && data.currentProvider &&
        ['ADT', 'Ring', 'SimpliSafe'].includes(data.currentProvider)

      const updateData: any = {
        homeownership: data.homeownership as any,
        notes: undefined,
      }

      if (data.hasSystem && data.currentProvider) {
        updateData.currentProvider = data.currentProvider
        if (isBuyoutCandidate) {
          updateData.segment = 'switch'
        }
      }

      // Recalculate lead score with new data
      const existing = await prisma.lead.findUnique({ where: { id: data.leadId } })
      if (!existing) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
      }

      const { score, priority } = calculateLeadScore({
        homeownership: data.homeownership,
        propertyType: existing.propertyType || 'HOUSE',
        timeline: existing.timeline || 'ASAP',
        productsInterested: existing.productsInterested || ['FULL_SYSTEM'],
        source: 'google',
        deviceType: existing.deviceType || undefined,
        segment: isBuyoutCandidate ? 'switch' : undefined,
      })

      updateData.leadScore = score
      updateData.priority = priority as any
      updateData.notes = (existing.notes || '') + `\n[Step 2 completed — ${data.homeownership}, ${data.hasSystem ? 'has system' : 'no system'}${data.currentProvider ? `, ${data.currentProvider}` : ''}]`

      await prisma.lead.update({
        where: { id: data.leadId },
        data: updateData,
      })

      return NextResponse.json({ success: true })
    }

    if (step === 3) {
      const data = googleStep3Schema.parse(body)

      const existing = await prisma.lead.findUnique({ where: { id: data.leadId } })
      if (!existing) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
      }

      // Map timeline values to Prisma enum
      const timelineMap: Record<string, string> = {
        ASAP: 'ASAP',
        WITHIN_30_DAYS: 'ONE_MONTH',
        RESEARCHING: 'JUST_RESEARCHING',
      }

      const { score, priority } = calculateLeadScore({
        homeownership: existing.homeownership || 'OWN',
        propertyType: existing.propertyType || 'HOUSE',
        timeline: timelineMap[data.timeline] || 'ASAP',
        productsInterested: existing.productsInterested || ['FULL_SYSTEM'],
        source: 'google',
        deviceType: existing.deviceType || undefined,
        segment: existing.segment || undefined,
      })

      await prisma.lead.update({
        where: { id: data.leadId },
        data: {
          email: data.email || '',
          timeline: (timelineMap[data.timeline] || 'ASAP') as any,
          tcpaConsent: data.tcpaConsent,
          tcpaConsentAt: new Date(),
          leadScore: score,
          priority: priority as any,
          notes: (existing.notes || '') + '\n[Step 3 completed — fully qualified lead]',
        },
      })

      await prisma.activity.create({
        data: {
          leadId: data.leadId,
          type: 'LEAD_SCORED',
          description: `Google Ads lead fully qualified (Step 3). Score: ${score}/${priority}. Email: ${data.email}`,
        }
      })

      // Now we have email — send welcome email and confirmation SMS
      const updatedLead = await prisma.lead.findUnique({ where: { id: data.leadId } })
      if (updatedLead) {
        const notifData = buildNotifData(updatedLead)
        await Promise.allSettled([
          sendWelcomeEmail(notifData),
        ])
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid step' }, { status: 400 })
  } catch (err: any) {
    console.error('Google lead update error:', err)
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid form data', details: err.errors }, { status: 400 })
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
  }
}

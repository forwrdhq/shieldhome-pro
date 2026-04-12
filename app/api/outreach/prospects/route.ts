import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyOutreachAuth } from '@/lib/outreach/auth'
import { getNiche } from '@/lib/outreach/niches'

/**
 * POST /api/outreach/prospects — Bulk add outreach prospects
 * Called by Paperclip Prospector agent after sourcing businesses.
 */
export async function POST(req: NextRequest) {
  try {
    const authError = verifyOutreachAuth(req)
    if (authError) return authError

    const body = await req.json()
    const { prospects, campaignId } = body as {
      prospects: Array<{
        email: string
        firstName?: string
        lastName?: string
        businessName: string
        phone?: string
        website?: string
        nicheSlug: string
        dmaId?: string
        city?: string
        state?: string
        zipCode?: string
        source: string
        instantlyLeadId?: string
      }>
      campaignId?: string
    }

    if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
      return NextResponse.json({ error: 'prospects array is required' }, { status: 400 })
    }

    // Deduplicate against suppression list
    const emails = prospects.map((p) => p.email.toLowerCase())
    const suppressed = await prisma.suppressionList.findMany({
      where: { email: { in: emails } },
      select: { email: true },
    })
    const suppressedSet = new Set(suppressed.map((s) => s.email))

    // Deduplicate against existing prospects
    const existingProspects = await prisma.outreachProspect.findMany({
      where: { email: { in: emails } },
      select: { email: true },
    })
    const existingSet = new Set(existingProspects.map((p) => p.email))

    // Deduplicate against existing CRM leads (email-based, skip empty strings)
    const nonEmptyEmails = emails.filter((e) => e.length > 0)
    const existingLeads = nonEmptyEmails.length > 0
      ? await prisma.lead.findMany({
          where: { email: { in: nonEmptyEmails } },
          select: { email: true },
        })
      : []
    const leadSet = new Set(existingLeads.map((l) => l.email))

    const filtered = prospects.filter((p) => {
      const email = p.email.toLowerCase()
      if (!email || !getNiche(p.nicheSlug)) return false
      return !suppressedSet.has(email) && !existingSet.has(email) && !leadSet.has(email)
    })

    if (filtered.length === 0) {
      return NextResponse.json({
        success: true,
        created: 0,
        skipped: prospects.length,
        reasons: { suppressed: suppressed.length, duplicate_prospect: existingProspects.length, existing_lead: existingLeads.length },
      })
    }

    // Batch create
    const created = await prisma.outreachProspect.createMany({
      data: filtered.map((p) => ({
        email: p.email.toLowerCase(),
        firstName: p.firstName || null,
        lastName: p.lastName || null,
        businessName: p.businessName,
        phone: p.phone || null,
        website: p.website || null,
        nicheSlug: p.nicheSlug,
        dmaId: p.dmaId || null,
        city: p.city || null,
        state: p.state || null,
        zipCode: p.zipCode || null,
        source: p.source,
        instantlyLeadId: p.instantlyLeadId || null,
        campaignId: campaignId || null,
      })),
      skipDuplicates: true,
    })

    return NextResponse.json({
      success: true,
      created: created.count,
      skipped: prospects.length - created.count,
    })
  } catch (err: any) {
    console.error('Outreach prospect creation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/outreach/prospects — List prospects with filters
 */
export async function GET(req: NextRequest) {
  try {
    const authError = verifyOutreachAuth(req)
    if (authError) return authError

    const { searchParams } = new URL(req.url)
    const nicheSlug = searchParams.get('niche')
    const dmaId = searchParams.get('dma')
    const status = searchParams.get('status')
    const campaignId = searchParams.get('campaign')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const where: any = {}
    if (nicheSlug) where.nicheSlug = nicheSlug
    if (dmaId) where.dmaId = dmaId
    if (status) where.status = status
    if (campaignId) where.campaignId = campaignId

    const [prospects, total] = await Promise.all([
      prisma.outreachProspect.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: { campaign: { select: { name: true, status: true } } },
      }),
      prisma.outreachProspect.count({ where }),
    ])

    return NextResponse.json({ prospects, total, limit, offset })
  } catch (err: any) {
    console.error('Outreach prospect list error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

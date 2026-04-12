import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import * as instantly from '@/lib/instantly'
import { getNiche } from '@/lib/outreach/niches'
import { verifyOutreachAuth } from '@/lib/outreach/auth'

/**
 * POST /api/outreach/campaigns — Create an outreach campaign
 * Creates it in our DB and optionally in Instantly.
 */
export async function POST(req: NextRequest) {
  try {
    const authError = verifyOutreachAuth(req)
    if (authError) return authError

    const body = await req.json()
    const { name, nicheSlug, dmaId, createInInstantly } = body as {
      name: string
      nicheSlug: string
      dmaId?: string
      createInInstantly?: boolean
    }

    if (!name || !nicheSlug) {
      return NextResponse.json({ error: 'name and nicheSlug are required' }, { status: 400 })
    }

    const niche = getNiche(nicheSlug)
    if (!niche) {
      return NextResponse.json({ error: `Unknown niche: ${nicheSlug}` }, { status: 400 })
    }

    let instantlyCampaignId: string | null = null

    if (createInInstantly) {
      const instantlyCampaign = await instantly.createCampaign({ name })
      instantlyCampaignId = instantlyCampaign.id
    }

    const campaign = await prisma.outreachCampaign.create({
      data: {
        name,
        nicheSlug,
        dmaId: dmaId || null,
        instantlyCampaignId,
        status: 'DRAFT',
      },
    })

    return NextResponse.json({ success: true, campaign })
  } catch (err: any) {
    console.error('Outreach campaign creation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/outreach/campaigns — List outreach campaigns with stats
 */
export async function GET(req: NextRequest) {
  try {
    const authError = verifyOutreachAuth(req)
    if (authError) return authError

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const nicheSlug = searchParams.get('niche')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    const where: any = {}
    if (status) where.status = status
    if (nicheSlug) where.nicheSlug = nicheSlug

    const campaigns = await prisma.outreachCampaign.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        dma: { select: { metroName: true } },
        _count: { select: { prospects: true } },
      },
    })

    return NextResponse.json({ campaigns })
  } catch (err: any) {
    console.error('Outreach campaign list error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

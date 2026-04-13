import { NextRequest, NextResponse } from 'next/server'
import { verifyOutreachAuth } from '@/lib/outreach/auth'
import { getNiche } from '@/lib/outreach/niches'
import { enrichFromSuperSearch } from '@/lib/instantly'
import { prisma } from '@/lib/db'

/**
 * POST /api/outreach/supersearch — Proxy for Instantly SuperSearch enrichment
 *
 * Accepts a nicheSlug + dmaId, builds the appropriate industry/state filters,
 * and triggers an Instantly `enrich-leads-from-supersearch` job.
 *
 * Used by Paperclip agents to kick off B2B lead enrichment without needing
 * direct Instantly API access.
 *
 * Body: { nicheSlug: string, dmaId: string, limit?: number }
 * Returns: { success: true, resourceId: string, listId: string, listName: string }
 */

/**
 * Maps niche slugs to Instantly SuperSearch valid industry enum values.
 * Full valid list: Agriculture & Mining, Business Services, Computers & Electronics,
 * Consumer Services, Education, Energy & Utilities, Financial Services, Government,
 * Healthcare Pharmaceuticals & Biotech, Manufacturing, Media & Entertainment,
 * Non-Profit, Other, Real Estate & Construction, Retail, Software & Internet,
 * Telecommunications, Transportation & Storage, Travel Recreation and Leisure,
 * Wholesale & Distribution
 */
/**
 * Maps niche slugs to Instantly SuperSearch valid industry + subIndustry enum values.
 *
 * Valid industries: Agriculture & Mining, Business Services, Computers & Electronics,
 *   Consumer Services, Education, Energy & Utilities, Financial Services, Government,
 *   Healthcare Pharmaceuticals & Biotech, Manufacturing, Media & Entertainment,
 *   Non-Profit, Other, Real Estate & Construction, Retail, Software & Internet,
 *   Telecommunications, Transportation & Storage, Travel Recreation and Leisure,
 *   Wholesale & Distribution
 */
/**
 * Maps niche slugs (from niches.ts) to Instantly SuperSearch valid industry + subIndustry enum values.
 * Valid industry enum: Agriculture & Mining, Business Services, Computers & Electronics,
 *   Consumer Services, Education, Energy & Utilities, Financial Services, Government,
 *   Healthcare Pharmaceuticals & Biotech, Manufacturing, Media & Entertainment,
 *   Non-Profit, Other, Real Estate & Construction, Retail, Software & Internet,
 *   Telecommunications, Transportation & Storage, Travel Recreation and Leisure,
 *   Wholesale & Distribution
 */
const NICHE_INDUSTRY_MAP: Record<string, {
  industries: string[]
  subIndustries?: string[]
  titleKeywords: string[]
}> = {
  dispensary: {
    industries: ['Retail'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
  },
  gun_shop: {
    industries: ['Retail'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
  },
  pawn_shop: {
    industries: ['Retail'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
  },
  jewelry_store: {
    industries: ['Retail'],
    subIndustries: ['Luxury Goods & Jewelry'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
  },
  liquor_store: {
    industries: ['Retail'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
  },
  convenience_store: {
    industries: ['Retail'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
  },
  bar_nightclub: {
    industries: ['Travel, Recreation, and Leisure'],
    subIndustries: ['Restaurants', 'Wine and Spirits', 'Entertainment'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
  },
  restaurant: {
    industries: ['Travel, Recreation, and Leisure'],
    subIndustries: ['Restaurants'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
  },
  hotel: {
    industries: ['Travel, Recreation, and Leisure'],
    subIndustries: ['Hospitality'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director', 'gm'],
  },
  gym: {
    industries: ['Travel, Recreation, and Leisure'],
    subIndustries: ['Recreational Facilities and Services', 'Sporting Goods', 'Sports'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
  },
  car_wash: {
    industries: ['Consumer Services'],
    subIndustries: ['Consumer Services'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
  },
  pharmacy: {
    industries: ['Healthcare, Pharmaceuticals, & Biotech'],
    subIndustries: ['Pharmaceuticals', 'Medical Practice'],
    titleKeywords: ['owner', 'founder', 'pharmacist', 'pharmacy manager', 'ceo', 'president', 'director'],
  },
  vet_clinic: {
    industries: ['Healthcare, Pharmaceuticals, & Biotech'],
    subIndustries: ['Veterinary'],
    titleKeywords: ['owner', 'founder', 'veterinarian', 'practice manager', 'ceo', 'president', 'director'],
  },
  medical_office: {
    industries: ['Healthcare, Pharmaceuticals, & Biotech'],
    subIndustries: ['Medical Practice', 'Hospital & Health Care'],
    titleKeywords: ['owner', 'founder', 'physician', 'practice manager', 'ceo', 'president', 'director'],
  },
  auto_dealer: {
    industries: ['Manufacturing'],
    subIndustries: ['Automotive'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'dealer principal', 'general manager', 'sales manager', 'director'],
  },
  warehouse: {
    industries: ['Wholesale & Distribution'],
    subIndustries: ['Wholesale'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'operations manager', 'director'],
  },
  self_storage: {
    industries: ['Real Estate & Construction'],
    subIndustries: ['Real Estate'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
  },
  property_mgmt: {
    industries: ['Real Estate & Construction'],
    subIndustries: ['Real Estate', 'Commercial Real Estate'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'property manager', 'general manager', 'director'],
  },
}

export async function POST(req: NextRequest) {
  const authError = verifyOutreachAuth(req)
  if (authError) return authError

  let body: { nicheSlug?: string; dmaId?: string; limit?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { nicheSlug, dmaId, limit = 50 } = body

  if (!nicheSlug) {
    return NextResponse.json({ error: 'nicheSlug is required' }, { status: 400 })
  }
  if (!dmaId) {
    return NextResponse.json({ error: 'dmaId is required' }, { status: 400 })
  }

  // 1. Look up niche
  const niche = getNiche(nicheSlug)
  if (!niche) {
    return NextResponse.json({ error: `Unknown niche: ${nicheSlug}` }, { status: 400 })
  }

  // 2. Look up DMA from database
  const dma = await prisma.outreachDMA.findUnique({ where: { id: dmaId } })
  if (!dma) {
    return NextResponse.json({ error: `Unknown DMA: ${dmaId}` }, { status: 400 })
  }

  // 3. Build industry filter
  const nicheMapping = NICHE_INDUSTRY_MAP[nicheSlug]
  if (!nicheMapping) {
    return NextResponse.json(
      { error: `No industry mapping defined for niche: ${nicheSlug}` },
      { status: 400 }
    )
  }

  // 4. Build state filter — if niche is state-restricted, intersect with DMA states
  let states: string[] = dma.states as string[]
  if (niche.legalStatesOnly) {
    states = states.filter((s) => niche.legalStatesOnly!.includes(s))
    if (states.length === 0) {
      return NextResponse.json(
        {
          error: `Niche "${nicheSlug}" has no legal states overlapping with DMA "${dmaId}" (${(dma.states as string[]).join(', ')})`,
        },
        { status: 400 }
      )
    }
  }

  // 5. Call Instantly SuperSearch enrichment with correct v2 filter format
  try {
    const searchFilters: Record<string, unknown> = {
      locations: {
        include: states.map((state) => ({ state, country: 'United States' })),
      },
      industry: { include: nicheMapping.industries },
      title: { include: nicheMapping.titleKeywords },
    }
    if (nicheMapping.subIndustries?.length) {
      searchFilters.subIndustry = { include: nicheMapping.subIndustries }
    }

    const result = await enrichFromSuperSearch({
      search_filters: searchFilters,
      show_one_lead_per_company: true,
      skip_owned_leads: true,
      limit,
    }) as Record<string, unknown>

    return NextResponse.json({
      success: true,
      resourceId: result.id ?? result.resource_id ?? null,
      listId: result.list_id ?? null,
      listName: result.list_name ?? null,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('SuperSearch enrichment error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

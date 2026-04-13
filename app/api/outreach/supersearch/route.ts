import { NextRequest, NextResponse } from 'next/server'
import { verifyOutreachAuth } from '@/lib/outreach/auth'
import { getNiche } from '@/lib/outreach/niches'
import { buildSearchFilters } from '@/lib/outreach/industry-map'
import { enrichFromSuperSearch } from '@/lib/instantly'
import { prisma } from '@/lib/db'

/**
 * POST /api/outreach/supersearch — Proxy for Instantly SuperSearch enrichment
 *
 * Accepts a nicheSlug + dmaId, builds the appropriate industry/state filters,
 * and triggers an Instantly `enrich-leads-from-supersearch` job.
 *
 * Body: { nicheSlug: string, dmaId: string, limit?: number }
 * Returns: { success: true, resourceId: string, listId: string, listName: string }
 */

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

  // 3. Build state filter — if niche is state-restricted, intersect with DMA states
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

  // 4. Build industry/title/location filters
  const searchFilters = buildSearchFilters(nicheSlug, states)
  if (!searchFilters) {
    return NextResponse.json(
      { error: `No industry mapping defined for niche: ${nicheSlug}` },
      { status: 400 }
    )
  }

  // 5. Call Instantly SuperSearch enrichment
  try {
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

import { NextRequest, NextResponse } from 'next/server'
import { NICHES } from '@/lib/outreach/niches'
import { verifyOutreachAuth } from '@/lib/outreach/auth'

/**
 * GET /api/outreach/niches — List all niche definitions
 *
 * Returns the full niche catalog including email sequences.
 * Campaign Manager uses this to configure Instantly campaigns.
 *
 * Query params:
 *   ?tier=A|B|C  — filter by tier
 *   ?sequences=false — omit email sequence bodies (lighter response)
 */
export async function GET(req: NextRequest) {
  const authError = verifyOutreachAuth(req)
  if (authError) return authError

  const { searchParams } = new URL(req.url)
  const tier = searchParams.get('tier') as 'A' | 'B' | 'C' | null
  const includeSequences = searchParams.get('sequences') !== 'false'

  let niches = tier ? NICHES.filter((n) => n.tier === tier) : NICHES

  const payload = niches.map((n) => ({
    slug: n.slug,
    name: n.name,
    tier: n.tier,
    score: n.score,
    decisionMaker: n.decisionMaker,
    avgDealRange: n.avgDealRange,
    complianceAngle: n.complianceAngle,
    legalStatesOnly: n.legalStatesOnly,
    ...(includeSequences ? { sequence: n.sequence } : {}),
  }))

  return NextResponse.json({ niches: payload, total: payload.length })
}

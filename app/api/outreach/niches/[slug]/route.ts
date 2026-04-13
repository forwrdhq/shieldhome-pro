import { NextRequest, NextResponse } from 'next/server'
import { getNiche } from '@/lib/outreach/niches'
import { verifyOutreachAuth } from '@/lib/outreach/auth'

/**
 * GET /api/outreach/niches/[slug] — Get a single niche definition
 *
 * Returns the full niche config including all 3 email sequence steps.
 * Campaign Manager uses this to build Instantly campaign sequences.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const authError = verifyOutreachAuth(req)
  if (authError) return authError

  const niche = getNiche(params.slug)
  if (!niche) {
    return NextResponse.json({ error: `Unknown niche: ${params.slug}` }, { status: 404 })
  }

  return NextResponse.json({ niche })
}

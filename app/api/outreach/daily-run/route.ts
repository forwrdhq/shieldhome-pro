import { NextRequest, NextResponse } from 'next/server'
import { pickDailyRotation, logRotation } from '@/lib/outreach/rotation'

/**
 * POST /api/outreach/daily-run — Trigger the daily outreach rotation
 *
 * This endpoint is called by Paperclip agents or a cron job.
 * It picks today's niche+DMA combo and returns it so the agent
 * can proceed with prospecting and campaign creation.
 *
 * The actual prospecting (SuperSearch, scraping) is handled by
 * the Paperclip Prospector agent, not this endpoint.
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authorization (fail-closed)
    const expectedToken = process.env.OUTREACH_API_TOKEN?.trim()
    if (!expectedToken) {
      console.error('OUTREACH_API_TOKEN is not configured')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pick = await pickDailyRotation()

    if (!pick) {
      return NextResponse.json({
        success: true,
        action: 'skip',
        reason: 'All niche+DMA combos are within cooldown window. No outreach today.',
      })
    }

    // Log the rotation
    await logRotation(pick.dmaId, pick.niche.slug)

    return NextResponse.json({
      success: true,
      action: 'proceed',
      rotation: {
        nicheSlug: pick.niche.slug,
        nicheName: pick.niche.name,
        nicheTier: pick.niche.tier,
        dmaId: pick.dmaId,
        dmaName: pick.dmaName,
        complianceAngle: pick.niche.complianceAngle,
        decisionMaker: pick.niche.decisionMaker,
        sequence: pick.niche.sequence,
      },
    })
  } catch (err: any) {
    console.error('Daily run error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

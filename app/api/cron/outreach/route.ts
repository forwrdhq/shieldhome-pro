import { NextRequest, NextResponse } from 'next/server'
import { pickDailyRotation, logRotation } from '@/lib/outreach/rotation'
import { buildSearchFilters } from '@/lib/outreach/industry-map'
import {
  createCampaign,
  enrichFromSuperSearch,
  activateCampaign,
} from '@/lib/instantly'
import { prisma } from '@/lib/db'

/**
 * GET /api/cron/outreach — Daily outreach pipeline
 *
 * Runs Mon–Fri at 9am CT (14:00 UTC).
 * 1. Pick today's niche + DMA via rotation engine
 * 2. Create Instantly campaign with email sequence
 * 3. Trigger SuperSearch enrichment directly into campaign
 * 4. Activate campaign
 * 5. Log rotation
 *
 * Triggered by Vercel Cron. Can also be manually triggered with
 * Authorization: Bearer {OUTREACH_API_TOKEN}
 */
export async function GET(req: NextRequest) {
  // Accept both CRON_SECRET (Vercel) and OUTREACH_API_TOKEN (manual)
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const outreachToken = process.env.OUTREACH_API_TOKEN?.trim()

  const isAuthorized =
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    (outreachToken && authHeader === `Bearer ${outreachToken}`)

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Pick today's rotation
    const pick = await pickDailyRotation()

    if (!pick) {
      console.log('[outreach-cron] All niche+DMA combos in cooldown — skipping today')
      return NextResponse.json({
        success: true,
        action: 'skip',
        reason: 'All niche+DMA combos are within cooldown window.',
      })
    }

    const today = new Date()
    const dateStr = `${today.toLocaleString('en-US', { month: 'short' }).toLowerCase()}${today.getDate()}`
    const campaignName = `${pick.dmaId}-${pick.niche.slug.replace(/_/g, '-')}-${dateStr}`

    console.log(`[outreach-cron] Starting: ${campaignName}`)

    // 2. Get DMA states for filter
    const dma = await prisma.outreachDMA.findUnique({ where: { id: pick.dmaId } })
    if (!dma) throw new Error(`DMA not found: ${pick.dmaId}`)

    let states = dma.states as string[]
    if (pick.niche.legalStatesOnly) {
      states = states.filter((s) => pick.niche.legalStatesOnly!.includes(s))
      if (states.length === 0) {
        return NextResponse.json({
          success: false,
          error: `Niche "${pick.niche.slug}" has no legal states in DMA "${pick.dmaId}"`,
        })
      }
    }

    // 3. Build search filters
    const searchFilters = buildSearchFilters(pick.niche.slug, states)
    if (!searchFilters) {
      return NextResponse.json({
        success: false,
        error: `No industry mapping for niche: ${pick.niche.slug}`,
      })
    }

    // 4. Create Instantly campaign with schedule + sequences
    const steps = pick.niche.sequence.map((step) => ({
      type: 'email',
      delay: step.delayDays,
      variants: [{ subject: step.subject, body: step.body }],
    }))

    const instantlyCampaign = await createCampaign({
      name: campaignName,
      daily_limit: 25,
      campaign_schedule: {
        schedules: [{
          name: 'Default',
          timing: { from: '08:00', to: '18:00' },
          days: { '0': false, '1': true, '2': true, '3': true, '4': true, '5': true, '6': false },
          timezone: 'America/Chicago',
        }],
      },
      sequences: [{ steps }],
    })
    const campaignId = instantlyCampaign.id
    console.log(`[outreach-cron] Created campaign: ${campaignId}`)

    // 6. Trigger SuperSearch enrichment directly into campaign
    const enrichResult = await enrichFromSuperSearch({
      search_filters: searchFilters,
      campaign_id: campaignId,
      show_one_lead_per_company: true,
      skip_owned_leads: false, // include leads already in workspace (avoids skipped_count: 50)
      work_email_enrichment: true,
      limit: 50,
    }) as Record<string, unknown>

    const resourceId = enrichResult.id ?? enrichResult.resource_id ?? null
    console.log(`[outreach-cron] SuperSearch enrichment triggered: ${resourceId}`)

    // 7. Activate campaign
    await activateCampaign(campaignId)
    console.log(`[outreach-cron] Campaign activated`)

    // 8. Log rotation + save to DB
    await logRotation(pick.dmaId, pick.niche.slug, campaignId, 50)

    await prisma.outreachCampaign.create({
      data: {
        name: campaignName,
        nicheSlug: pick.niche.slug,
        dmaId: pick.dmaId,
        instantlyCampaignId: campaignId,
        status: 'ACTIVE',
      },
    })

    return NextResponse.json({
      success: true,
      action: 'proceed',
      campaignName,
      campaignId,
      niche: pick.niche.name,
      dma: pick.dmaName,
      enrichmentResourceId: resourceId,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[outreach-cron] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

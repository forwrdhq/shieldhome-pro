import { NextRequest, NextResponse } from 'next/server'
import { pickDailyRotation, logRotation } from '@/lib/outreach/rotation'
import { buildSearchFilters } from '@/lib/outreach/industry-map'
import {
  createCampaign,
  enrichFromSuperSearch,
  activateCampaign,
  waitForEnrichment,
  listLeads,
  getSendingAccounts,
} from '@/lib/instantly'
import { prisma } from '@/lib/db'

// Allow up to 5 minutes — enrichment polling can take 1-2 minutes
export const maxDuration = 300

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

    // 4. Preflight: verify sending accounts are configured
    const sendingAccounts = getSendingAccounts()
    if (sendingAccounts.length === 0) {
      console.error('[outreach-cron] No sending accounts configured (INSTANTLY_SENDING_EMAILS is empty)')
      return NextResponse.json({
        success: false,
        error: 'No sending accounts configured. Set INSTANTLY_SENDING_EMAILS env var.',
      }, { status: 500 })
    }
    console.log(`[outreach-cron] Sending accounts: ${sendingAccounts.join(', ')}`)

    // 5. Create Instantly campaign with schedule + sequences
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
      skip_owned_leads: false,
      work_email_enrichment: true,
      limit: 50,
    }) as Record<string, unknown>

    const resourceId = (enrichResult.id ?? enrichResult.resource_id ?? null) as string | null
    console.log(`[outreach-cron] SuperSearch enrichment triggered: ${resourceId}`)

    // 7. Wait for enrichment to complete before activating
    let enrichedCount = 0
    if (resourceId) {
      try {
        const finalStatus = await waitForEnrichment(resourceId, {
          maxWaitMs: 90_000,  // 90s — generous for Vercel function timeout
          intervalMs: 5_000,
        })
        enrichedCount = finalStatus.enriched_count ?? finalStatus.total_count ?? 0
        console.log(`[outreach-cron] Enrichment complete: ${enrichedCount} leads enriched, ${finalStatus.skipped_count ?? 0} skipped`)
      } catch (pollErr) {
        console.error(`[outreach-cron] Enrichment polling failed:`, pollErr)
        // Still try to activate — leads may trickle in async
      }
    }

    // 8. Verify leads exist in campaign before activating
    let leadCount = 0
    try {
      const leadsResult = await listLeads({ campaign_id: campaignId, limit: 1 })
      leadCount = leadsResult.items?.length ?? 0
    } catch {
      // Non-fatal — proceed with activation attempt
    }

    if (leadCount === 0 && enrichedCount === 0) {
      console.warn(`[outreach-cron] WARNING: Campaign ${campaignId} has 0 leads after enrichment. Activating anyway — leads may still be processing.`)
    }

    // 9. Activate campaign
    await activateCampaign(campaignId)
    console.log(`[outreach-cron] Campaign activated (${enrichedCount} leads enriched)`)

    // 10. Log rotation + save to DB
    await logRotation(pick.dmaId, pick.niche.slug, campaignId, enrichedCount)

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
      enrichedCount,
      leadCount,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[outreach-cron] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

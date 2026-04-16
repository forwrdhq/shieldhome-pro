import { NextRequest, NextResponse } from 'next/server'
import { pickDailyRotation, logRotation } from '@/lib/outreach/rotation'
import { buildSearchFilters } from '@/lib/outreach/industry-map'
import {
  createCampaign,
  enrichFromSuperSearch,
  activateCampaign,
  waitForEnrichment,
  listLeads,
  listAccounts,
  getSendingAccounts,
  countSuperSearchLeads,
  deleteCampaign,
  addLeads,
  type InstantlyLead,
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

    // 3a. Preflight count — don't create a campaign if the filter finds nothing
    let availableLeadCount = -1
    try {
      const countResult = await countSuperSearchLeads(searchFilters)
      availableLeadCount = typeof countResult.number_of_leads === 'number' ? countResult.number_of_leads : -1
      console.log(`[outreach-cron] SuperSearch preflight count: ${availableLeadCount} leads available`)
    } catch (err) {
      console.warn('[outreach-cron] Preflight count failed (proceeding anyway):', err)
    }

    if (availableLeadCount === 0) {
      return NextResponse.json({
        success: false,
        action: 'skip',
        reason: 'SuperSearch returned 0 matching leads for filter',
        niche: pick.niche.slug,
        dma: pick.dmaId,
        searchFilters,
      })
    }

    // 4. Preflight: verify sending accounts are configured AND exist in Instantly workspace
    const sendingAccounts = getSendingAccounts()
    if (sendingAccounts.length === 0) {
      console.error('[outreach-cron] No sending accounts configured (INSTANTLY_SENDING_EMAILS is empty)')
      return NextResponse.json({
        success: false,
        error: 'No sending accounts configured. Set INSTANTLY_SENDING_EMAILS env var.',
      }, { status: 500 })
    }
    console.log(`[outreach-cron] Configured sending accounts: ${sendingAccounts.join(', ')}`)

    // Verify accounts actually exist in the Instantly workspace the API key has access to
    let workspaceAccountEmails: string[] = []
    try {
      const accountsResult = await listAccounts({ limit: 100 })
      workspaceAccountEmails = (accountsResult.items ?? []).map((a) => a.email.toLowerCase())
      console.log(`[outreach-cron] Instantly workspace has ${workspaceAccountEmails.length} account(s): ${workspaceAccountEmails.join(', ')}`)
    } catch (err) {
      console.error('[outreach-cron] Failed to list Instantly accounts:', err)
    }

    const missingAccounts = sendingAccounts.filter(
      (e) => !workspaceAccountEmails.includes(e.toLowerCase())
    )
    if (workspaceAccountEmails.length > 0 && missingAccounts.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Sending accounts not found in Instantly workspace: ${missingAccounts.join(', ')}. The INSTANTLY_API_KEY may be scoped to a different workspace than where these accounts are connected.`,
        workspaceAccounts: workspaceAccountEmails,
        configuredAccounts: sendingAccounts,
      }, { status: 500 })
    }

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

    // 6. Trigger SuperSearch enrichment. IMPORTANT: do NOT pass campaign_id
    // here — despite accepting the param, enrichment ignores it and leads
    // land in a Supersearch Lead List (resource_id === list_id), never in
    // the campaign. We attach leads to the campaign explicitly below via
    // /leads/add, which mirrors what the Instantly UI does (leads in the
    // hotel campaign that worked were all upload_method=api).
    const enrichResult = await enrichFromSuperSearch({
      search_filters: searchFilters,
      show_one_lead_per_company: true,
      skip_owned_leads: false,
      work_email_enrichment: true,
      limit: 50,
    }) as Record<string, unknown>

    const resourceId = (enrichResult.id ?? enrichResult.resource_id ?? null) as string | null
    console.log(`[outreach-cron] SuperSearch enrichment triggered: ${resourceId}`)

    // 7. Wait for enrichment to complete
    let hasNoLeads = false
    if (resourceId) {
      try {
        const finalStatus = await waitForEnrichment(resourceId, {
          maxWaitMs: 180_000,
          intervalMs: 5_000,
        })
        hasNoLeads = finalStatus.has_no_leads === true
        console.log(`[outreach-cron] Enrichment complete. has_no_leads=${hasNoLeads}, in_progress=${finalStatus.in_progress}`)
      } catch (pollErr) {
        console.error(`[outreach-cron] Enrichment polling failed:`, pollErr)
      }
    }

    // 8. Pull enriched leads out of the Supersearch list the enrichment
    // created, then explicitly add them to the campaign. Skip leads that
    // didn't get an email back from enrichment — they're not reachable.
    let enrichedLeadCount = 0
    const leadsToAdd: InstantlyLead[] = []
    if (resourceId) {
      try {
        const listResult = await listLeads({ list_id: resourceId, limit: 200 })
        const listItems = (listResult.items ?? []) as Array<Record<string, unknown>>
        enrichedLeadCount = listItems.length
        for (const item of listItems) {
          const email = (item.email as string | undefined) || ''
          if (!email) continue
          const payload = (item.payload as Record<string, unknown> | undefined) ?? {}
          leadsToAdd.push({
            email,
            first_name: (item.first_name as string) || (payload.firstName as string) || '',
            last_name: (item.last_name as string) || (payload.lastName as string) || '',
            company_name: (item.company_name as string) || (payload.companyName as string) || '',
          })
        }
        console.log(`[outreach-cron] Enrichment list ${resourceId}: ${enrichedLeadCount} total, ${leadsToAdd.length} with emails`)
      } catch (err) {
        console.warn('[outreach-cron] Failed to fetch enriched list:', err)
      }
    }

    // 9. Push the emailable leads into the campaign via /leads/add.
    let leadCount = 0
    if (leadsToAdd.length > 0) {
      try {
        const addResult = (await addLeads({
          campaign_id: campaignId,
          leads: leadsToAdd,
          skip_if_in_workspace: false,
        })) as { leads_uploaded?: number; total_sent?: number }
        leadCount = addResult.leads_uploaded ?? addResult.total_sent ?? leadsToAdd.length
        console.log(`[outreach-cron] Added ${leadCount} leads to campaign ${campaignId}`)
      } catch (addErr) {
        console.error('[outreach-cron] /leads/add failed:', addErr)
      }
    }

    if (leadCount === 0) {
      // Tear down the empty campaign so it doesn't clutter the Instantly
      // dashboard as a "Completed 100%" with 0 sends.
      try {
        await deleteCampaign(campaignId)
        console.warn(`[outreach-cron] Deleted empty campaign ${campaignId}`)
      } catch (delErr) {
        console.warn(`[outreach-cron] Failed to delete empty campaign:`, delErr)
      }

      const reason = hasNoLeads
        ? 'SuperSearch reported has_no_leads=true. Check filter — keyword may not match any real businesses.'
        : enrichedLeadCount === 0
        ? `SuperSearch reported ${availableLeadCount} preview matches but enriched 0 leads into the list. Check Lead Finder plan credits or widen the filter.`
        : `Enriched ${enrichedLeadCount} leads but none had a valid email after work-email enrichment. Try a niche with more corporate targets.`

      console.error(`[outreach-cron] ${reason}`)
      return NextResponse.json({
        success: false,
        action: 'abort',
        reason,
        campaignName,
        searchFilters,
        availableLeadCount,
        hasNoLeads,
        enrichmentResourceId: resourceId,
      }, { status: 200 })
    }

    // 9. Activate campaign
    await activateCampaign(campaignId)
    console.log(`[outreach-cron] Campaign activated with ${leadCount} leads`)

    // 10. Log rotation + save to DB
    await logRotation(pick.dmaId, pick.niche.slug, campaignId, leadCount)

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
      availableLeadCount,
      leadCount,
      hasNoLeads,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[outreach-cron] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

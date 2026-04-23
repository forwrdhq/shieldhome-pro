import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import {
  createCampaign,
  activateCampaign,
  addLeads,
  getCampaignAnalytics,
  getSendingAccounts,
  type InstantlyLead,
} from '@/lib/instantly'
import { getNiche } from '@/lib/outreach/niches'

// Enrichment + multi-campaign creation can take several minutes
export const maxDuration = 300

/**
 * GET /api/cron/campaigns — Campaign Launch & Sync
 *
 * Runs daily at 11am CT (16:00 UTC).
 * 1. Group QUEUED prospects by niche+DMA, create Instantly campaigns,
 *    add leads, activate, and link back to prospects in DB.
 * 2. Activate DRAFT campaigns that already have an instantlyCampaignId.
 * 3. Pull analytics from Instantly for all ACTIVE campaigns and sync stats.
 *
 * Accepts both CRON_SECRET (Vercel) and OUTREACH_API_TOKEN (manual).
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const outreachToken = process.env.OUTREACH_API_TOKEN?.trim()

  const isAuthorized =
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    (outreachToken && authHeader === `Bearer ${outreachToken}`)

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const launched: Array<{ campaignName: string; niche: string; dma: string | null; leadCount: number }> = []
  const activated: string[] = []
  const synced: string[] = []
  const errors: string[] = []

  // ─────────────────────────────────────────────────────────────
  // 1. Launch campaigns for QUEUED prospects
  // ─────────────────────────────────────────────────────────────
  try {
    if (getSendingAccounts().length === 0) {
      errors.push('No sending accounts configured — set INSTANTLY_SENDING_EMAILS to launch campaigns.')
    } else {
      const queuedProspects = await prisma.outreachProspect.findMany({
        where: { status: 'QUEUED', campaignId: null },
        orderBy: { createdAt: 'asc' },
      })

      // Group by nicheSlug + dmaId (null dmaId is treated as empty string key)
      const groups = new Map<string, typeof queuedProspects>()
      for (const p of queuedProspects) {
        const key = `${p.nicheSlug}||${p.dmaId ?? ''}`
        const existing = groups.get(key) ?? []
        existing.push(p)
        groups.set(key, existing)
      }

      const today = new Date()
      const dateStr = `${today.toLocaleString('en-US', { month: 'short' }).toLowerCase()}${today.getDate()}`

      for (const [key, prospects] of groups) {
        const [nicheSlug, dmaId] = key.split('||')
        const niche = getNiche(nicheSlug)
        if (!niche) {
          errors.push(`Skipped unknown niche: ${nicheSlug}`)
          continue
        }

        const campaignName = `${dmaId || 'general'}-${nicheSlug.replace(/_/g, '-')}-${dateStr}`
        console.log(`[campaigns-cron] Launching: ${campaignName} (${prospects.length} queued prospects)`)

        try {
          const steps = niche.sequence.map((step) => ({
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
          const instantlyId = instantlyCampaign.id

          const leadsToAdd: InstantlyLead[] = prospects.map((p) => ({
            email: p.email,
            first_name: p.firstName ?? '',
            last_name: p.lastName ?? '',
            company_name: p.businessName,
          }))

          const addResult = (await addLeads({
            campaign_id: instantlyId,
            leads: leadsToAdd,
            skip_if_in_workspace: false,
          })) as { leads_uploaded?: number; total_sent?: number }
          const leadCount = addResult.leads_uploaded ?? addResult.total_sent ?? leadsToAdd.length

          await activateCampaign(instantlyId)

          const dbCampaign = await prisma.outreachCampaign.create({
            data: {
              name: campaignName,
              nicheSlug,
              dmaId: dmaId || null,
              instantlyCampaignId: instantlyId,
              status: 'ACTIVE',
              totalProspects: leadCount,
            },
          })

          await prisma.outreachProspect.updateMany({
            where: { id: { in: prospects.map((p) => p.id) } },
            data: { campaignId: dbCampaign.id, status: 'ACTIVE' },
          })

          launched.push({ campaignName, niche: niche.name, dma: dmaId || null, leadCount })
          console.log(`[campaigns-cron] Launched ${campaignName}: ${leadCount} leads`)
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err)
          errors.push(`Launch failed for ${campaignName}: ${msg}`)
          console.error(`[campaigns-cron] Launch error for ${campaignName}:`, msg)
        }
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    errors.push(`QUEUED prospects query failed: ${msg}`)
  }

  // ─────────────────────────────────────────────────────────────
  // 2. Activate DRAFT campaigns with an Instantly campaign ID
  // ─────────────────────────────────────────────────────────────
  try {
    const draftCampaigns = await prisma.outreachCampaign.findMany({
      where: { status: 'DRAFT', instantlyCampaignId: { not: null } },
    })

    for (const campaign of draftCampaigns) {
      try {
        await activateCampaign(campaign.instantlyCampaignId!)
        await prisma.outreachCampaign.update({
          where: { id: campaign.id },
          data: { status: 'ACTIVE' },
        })
        activated.push(campaign.name)
        console.log(`[campaigns-cron] Activated draft: ${campaign.name}`)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        errors.push(`Activate failed for ${campaign.name}: ${msg}`)
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    errors.push(`DRAFT campaigns query failed: ${msg}`)
  }

  // ─────────────────────────────────────────────────────────────
  // 3. Sync stats for ACTIVE campaigns
  // ─────────────────────────────────────────────────────────────
  try {
    const activeCampaigns = await prisma.outreachCampaign.findMany({
      where: { status: 'ACTIVE', instantlyCampaignId: { not: null } },
    })

    for (const campaign of activeCampaigns) {
      try {
        const raw = await getCampaignAnalytics({ campaign_id: campaign.instantlyCampaignId! })
        // Instantly v2 returns an array; unwrap if needed
        const analytics = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown> | undefined
        if (!analytics) continue

        await prisma.outreachCampaign.update({
          where: { id: campaign.id },
          data: {
            totalProspects: (analytics.total_leads_count ?? analytics.leads_count ?? campaign.totalProspects) as number,
            totalSent: (analytics.total_emails_sent_count ?? analytics.emails_sent_count ?? analytics.sent_count ?? campaign.totalSent) as number,
            totalOpens: (analytics.open_count ?? analytics.total_open_count ?? analytics.opens ?? campaign.totalOpens) as number,
            totalClicks: (analytics.link_click_count ?? analytics.total_link_click_count ?? analytics.clicks ?? campaign.totalClicks) as number,
            totalReplies: (analytics.reply_count ?? analytics.total_reply_count ?? analytics.replies ?? campaign.totalReplies) as number,
            totalInterested: (analytics.interested_lead_count ?? analytics.total_interested_count ?? campaign.totalInterested) as number,
          },
        })

        synced.push(campaign.name)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        errors.push(`Stats sync failed for ${campaign.name}: ${msg}`)
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    errors.push(`ACTIVE campaigns query failed: ${msg}`)
  }

  return NextResponse.json({
    success: errors.length === 0,
    launched,
    activated,
    synced,
    errors: errors.length > 0 ? errors : undefined,
  })
}

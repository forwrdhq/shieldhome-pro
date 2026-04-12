/**
 * Daily Niche + DMA Rotation Engine
 *
 * Ensures we never hit the same niche+DMA combo within a 4-week window.
 * Tier A niches rotate every 2 weeks (to new DMAs each cycle).
 * Tier B niches cycle once per month.
 * Tier C fills gaps and tests new copy angles.
 */

import { prisma } from '@/lib/db'
import { NICHES, type NicheDefinition, isNicheAvailableInState } from './niches'

const ROTATION_COOLDOWN_DAYS = 28 // 4-week window before re-contacting same niche+DMA
const TIER_A_COOLDOWN_DAYS = 14  // Tier A niches can rotate back after 2 weeks (new DMA)

/**
 * 14 priority DMAs covering ~55% of US commercial establishments.
 * Seed data for the OutreachDMA table.
 */
export const SEED_DMAS = [
  { id: 'new-york', metroName: 'New York', states: ['NY', 'NJ', 'CT'] },
  { id: 'los-angeles', metroName: 'Los Angeles', states: ['CA'] },
  { id: 'chicago', metroName: 'Chicago', states: ['IL'] },
  { id: 'philadelphia', metroName: 'Philadelphia', states: ['PA'] },
  { id: 'dallas-fort-worth', metroName: 'Dallas-Fort Worth', states: ['TX'] },
  { id: 'houston', metroName: 'Houston', states: ['TX'] },
  { id: 'washington-dc', metroName: 'Washington DC', states: ['DC', 'MD', 'VA'] },
  { id: 'miami', metroName: 'Miami-Fort Lauderdale', states: ['FL'] },
  { id: 'atlanta', metroName: 'Atlanta', states: ['GA'] },
  { id: 'seattle', metroName: 'Seattle-Tacoma', states: ['WA'] },
  { id: 'minneapolis', metroName: 'Minneapolis-St. Paul', states: ['MN'] },
  { id: 'phoenix', metroName: 'Phoenix', states: ['AZ'] },
  { id: 'denver', metroName: 'Denver', states: ['CO'] },
  { id: 'las-vegas', metroName: 'Las Vegas', states: ['NV'] },
]

export interface RotationPick {
  niche: NicheDefinition
  dmaId: string
  dmaName: string
}

/**
 * Pick today's niche + DMA combo based on rotation rules.
 *
 * Algorithm:
 * 1. Get all active DMAs
 * 2. Get recent rotation logs (within cooldown window)
 * 3. For each niche (ordered by tier priority + score), find a DMA that hasn't been contacted recently
 * 4. Return the best available combo
 */
export async function pickDailyRotation(): Promise<RotationPick | null> {
  const activeDmas = await prisma.outreachDMA.findMany({
    where: { isActive: true },
  })

  if (activeDmas.length === 0) return null

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - ROTATION_COOLDOWN_DAYS)

  const recentLogs = await prisma.outreachRotationLog.findMany({
    where: { contactedAt: { gte: cutoffDate } },
    select: { dmaId: true, nicheSlug: true, contactedAt: true },
  })

  // Build a set of recently contacted niche+DMA combos
  const recentCombos = new Set(
    recentLogs.map((log) => `${log.nicheSlug}::${log.dmaId}`)
  )

  // Sort niches: Tier A first (highest score), then B, then C
  const sortedNiches = [...NICHES].sort((a, b) => {
    const tierOrder = { A: 0, B: 1, C: 2 }
    if (tierOrder[a.tier] !== tierOrder[b.tier]) {
      return tierOrder[a.tier] - tierOrder[b.tier]
    }
    return b.score - a.score
  })

  // For Tier A, use shorter cooldown
  const tierACutoff = new Date()
  tierACutoff.setDate(tierACutoff.getDate() - TIER_A_COOLDOWN_DAYS)
  const tierARecentLogs = recentLogs.filter(
    (log) => log.contactedAt >= tierACutoff
  )
  const tierARecentCombos = new Set(
    tierARecentLogs.map((log) => `${log.nicheSlug}::${log.dmaId}`)
  )

  for (const niche of sortedNiches) {
    const cooldownSet = niche.tier === 'A' ? tierARecentCombos : recentCombos

    // Fisher-Yates shuffle for unbiased randomization
    const shuffledDmas = [...activeDmas]
    for (let i = shuffledDmas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDmas[i], shuffledDmas[j]] = [shuffledDmas[j], shuffledDmas[i]]
    }

    for (const dma of shuffledDmas) {
      const comboKey = `${niche.slug}::${dma.id}`

      // Skip if recently contacted
      if (cooldownSet.has(comboKey)) continue

      // Skip if niche is state-restricted and DMA doesn't match
      if (niche.legalStatesOnly) {
        const dmaHasLegalState = dma.states.some((s) =>
          isNicheAvailableInState(niche.slug, s)
        )
        if (!dmaHasLegalState) continue
      }

      return {
        niche,
        dmaId: dma.id,
        dmaName: dma.metroName,
      }
    }
  }

  // All combos recently contacted — return null (skip today)
  return null
}

/**
 * Record that a niche+DMA combo was contacted today.
 */
export async function logRotation(
  dmaId: string,
  nicheSlug: string,
  campaignId?: string,
  prospectsQueued?: number
): Promise<void> {
  await prisma.outreachRotationLog.create({
    data: {
      dmaId,
      nicheSlug,
      campaignId: campaignId ?? null,
      prospectsQueued: prospectsQueued ?? 0,
    },
  })
}

/**
 * Get rotation history for analytics and debugging.
 */
export async function getRotationHistory(days: number = 30) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  return prisma.outreachRotationLog.findMany({
    where: { contactedAt: { gte: cutoff } },
    include: { dma: true },
    orderBy: { contactedAt: 'desc' },
  })
}

/**
 * Seed the OutreachDMA table with the 14 priority DMAs.
 */
export async function seedDMAs(): Promise<void> {
  for (const dma of SEED_DMAS) {
    await prisma.outreachDMA.upsert({
      where: { id: dma.id },
      update: { metroName: dma.metroName, states: dma.states },
      create: dma,
    })
  }
}

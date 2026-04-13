/**
 * Paperclip Seed Script
 *
 * Seeds the database with the 14 priority DMAs and validates that the
 * outreach rotation system is ready to run.
 *
 * Usage:
 *   npx tsx paperclip/seed.ts
 *
 * Or via npm script (add to package.json):
 *   "seed:outreach": "npx tsx paperclip/seed.ts"
 */

import { prisma } from '@/lib/db'
import { seedDMAs, SEED_DMAS } from '@/lib/outreach/rotation'
import { NICHES } from '@/lib/outreach/niches'

async function main() {
  console.log('=== ShieldHome Pro Outreach Seed ===\n')

  // ── 1. Seed DMAs ─────────────────────────────────────────────────────────────
  console.log('Seeding DMAs...')
  await seedDMAs()
  const dmaCount = await prisma.outreachDMA.count()
  console.log(`  ✓ ${dmaCount} DMAs in database`)

  const missingDmas = SEED_DMAS.filter(async (d) => {
    const exists = await prisma.outreachDMA.findUnique({ where: { id: d.id } })
    return !exists
  })
  if (missingDmas.length > 0) {
    console.warn(`  ⚠ Missing DMAs: ${missingDmas.map((d) => d.id).join(', ')}`)
  }

  // ── 2. Niche catalog health check ────────────────────────────────────────────
  console.log('\nNiche catalog:')
  const tierA = NICHES.filter((n) => n.tier === 'A')
  const tierB = NICHES.filter((n) => n.tier === 'B')
  const tierC = NICHES.filter((n) => n.tier === 'C')
  console.log(`  Tier A: ${tierA.length} niches`)
  console.log(`  Tier B: ${tierB.length} niches`)
  console.log(`  Tier C: ${tierC.length} niches`)
  console.log(`  Total:  ${NICHES.length} niches`)

  // Validate each niche has a full 3-step sequence
  const invalidNiches = NICHES.filter((n) => n.sequence.length !== 3)
  if (invalidNiches.length > 0) {
    console.error(`  ✗ Niches with incomplete sequences: ${invalidNiches.map((n) => n.slug).join(', ')}`)
    process.exit(1)
  }
  console.log(`  ✓ All ${NICHES.length} niches have complete 3-step sequences`)

  // Validate slugs are unique
  const slugs = NICHES.map((n) => n.slug)
  const uniqueSlugs = new Set(slugs)
  if (uniqueSlugs.size !== slugs.length) {
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i)
    console.error(`  ✗ Duplicate niche slugs: ${dupes.join(', ')}`)
    process.exit(1)
  }
  console.log(`  ✓ All niche slugs are unique`)

  // ── 3. Rotation health check ──────────────────────────────────────────────────
  console.log('\nRotation health check:')
  const rotationLogs = await prisma.outreachRotationLog.count()
  console.log(`  Total rotation log entries: ${rotationLogs}`)

  const recentCutoff = new Date()
  recentCutoff.setDate(recentCutoff.getDate() - 28)
  const recentLogs = await prisma.outreachRotationLog.count({
    where: { contactedAt: { gte: recentCutoff } },
  })
  console.log(`  Recent (last 28 days): ${recentLogs}`)

  // Calculate coverage: how many niche+DMA combos have been contacted recently
  const totalCombos = NICHES.length * SEED_DMAS.length
  const pct = recentLogs > 0 ? ((recentLogs / totalCombos) * 100).toFixed(1) : '0.0'
  console.log(`  Coverage: ${recentLogs}/${totalCombos} combos contacted recently (${pct}%)`)

  // ── 4. Campaign + prospect summary ───────────────────────────────────────────
  console.log('\nCurrent pipeline:')
  const [campaigns, prospects, suppressed] = await Promise.all([
    prisma.outreachCampaign.count(),
    prisma.outreachProspect.count(),
    prisma.suppressionList.count(),
  ])
  console.log(`  Campaigns:        ${campaigns}`)
  console.log(`  Prospects:        ${prospects}`)
  console.log(`  Suppression list: ${suppressed}`)

  const byStatus = await prisma.outreachProspect.groupBy({
    by: ['status'],
    _count: { status: true },
    orderBy: { _count: { status: 'desc' } },
  })
  if (byStatus.length > 0) {
    console.log('\n  Prospect status breakdown:')
    for (const row of byStatus) {
      console.log(`    ${row.status.padEnd(14)} ${row._count.status}`)
    }
  }

  console.log('\n✓ Seed complete. Outreach system is ready.\n')
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

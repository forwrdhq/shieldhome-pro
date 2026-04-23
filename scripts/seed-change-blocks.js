const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await Promise.all([
    prisma.changeBlock.create({
      data: {
        name: 'Baseline',
        startDate: new Date('2026-04-20T00:00:00Z'),
        endDate: new Date('2026-04-22T23:59:59Z'),
        changes: ['Initial launch configuration'],
        notes: 'First 3 days of live traffic from Meta ads. No changes made during this period.',
        leadCount: 47,
        qualLeadCount: 15,
        qualRate: 31.9,
        optInRate: 39.2,
        formStarts: 97,
        generateLeads: 38,
      },
    }),
    prisma.changeBlock.create({
      data: {
        name: 'Apr 22 Optimizations',
        startDate: new Date('2026-04-23T00:00:00Z'),
        changes: [
          'Removed Not Sure credit score option — forced binary 650+ / Below 650',
          'Step 2 CTA changed to Talk to Our Smart Home Team',
          'Credit score pills grid fixed from 3 to 2 columns',
          'Apartment leads filtered from rep alerts (Slack, Callingly, SMS)',
          'Removed authorized dealer language sitewide',
        ],
        notes: 'Focused on data quality and honest conversion copy. Monitor opt-in rate and qualified lead % vs baseline.',
      },
    }),
  ])
  console.log('Seeded 2 change blocks')
}

main().catch(console.error).finally(() => prisma.$disconnect())

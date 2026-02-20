import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shieldhomepro.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@shieldhomepro.com',
      passwordHash,
      role: 'ADMIN',
      phone: '+18775550100',
    }
  })

  const rep = await prisma.user.upsert({
    where: { email: 'rep@shieldhomepro.com' },
    update: {},
    create: {
      name: 'Sales Rep',
      email: 'rep@shieldhomepro.com',
      passwordHash: await bcrypt.hash('rep123', 12),
      role: 'REP',
      phone: '+18775550101',
    }
  })

  console.log('Seeded users:', { admin: admin.email, rep: rep.email })

  // Seed some sample leads
  const sampleLeads = [
    {
      firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com',
      phone: '5551234567', fullName: 'Sarah Johnson', zipCode: '85001',
      propertyType: 'HOUSE' as const, homeownership: 'OWN' as const,
      productsInterested: ['Home Security System', 'Indoor/Outdoor Cameras'],
      timeline: 'ASAP' as const, leadScore: 85, priority: 'HOT' as const,
      source: 'facebook', medium: 'cpc', assignedRepId: rep.id,
    },
    {
      firstName: 'Robert', lastName: 'Martinez', email: 'robert@example.com',
      phone: '5559876543', fullName: 'Robert Martinez', zipCode: '75001',
      propertyType: 'HOUSE' as const, homeownership: 'OWN' as const,
      productsInterested: ['Home Security System', 'Smart Home Automation'],
      timeline: 'ONE_TWO_WEEKS' as const, leadScore: 70, priority: 'HIGH' as const,
      source: 'google', medium: 'cpc', assignedRepId: rep.id,
      status: 'CONTACTED' as const,
    },
    {
      firstName: 'Jennifer', lastName: 'Kim', email: 'jennifer@example.com',
      phone: '5554567890', fullName: 'Jennifer Kim', zipCode: '30301',
      propertyType: 'TOWNHOME' as const, homeownership: 'OWN' as const,
      productsInterested: ['Home Security System', 'Package Protection'],
      timeline: 'ONE_MONTH' as const, leadScore: 55, priority: 'MEDIUM' as const,
      source: 'organic',
    },
  ]

  for (const lead of sampleLeads) {
    await prisma.lead.upsert({
      where: { id: `seed-${lead.email}` },
      update: {},
      create: { id: `seed-${lead.email}`, ...lead, status: (lead as any).status || 'NEW' } as any
    })
  }

  console.log('Seeded sample leads')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

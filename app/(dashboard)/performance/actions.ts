'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function closeBlockAndStartNew(data: {
  closeId: string
  optInRate: number
  formStarts: number
  generateLeads: number
  newName: string
  changes: string[]
  notes?: string
}) {
  const closing = await prisma.changeBlock.findUnique({ where: { id: data.closeId } })
  if (!closing) throw new Error('Block not found')

  const now = new Date()

  const leadCount = await prisma.lead.count({
    where: { createdAt: { gte: closing.startDate, lte: now } },
  })
  const qualLeadCount = await prisma.lead.count({
    where: { createdAt: { gte: closing.startDate, lte: now }, creditScoreRange: 'ABOVE_650' },
  })
  const qualRate = leadCount > 0 ? (qualLeadCount / leadCount) * 100 : 0

  await prisma.changeBlock.update({
    where: { id: data.closeId },
    data: {
      endDate: now,
      leadCount,
      qualLeadCount,
      qualRate: Math.round(qualRate * 10) / 10,
      optInRate: data.optInRate,
      formStarts: data.formStarts,
      generateLeads: data.generateLeads,
    },
  })

  await prisma.changeBlock.create({
    data: {
      name: data.newName,
      startDate: now,
      changes: data.changes,
      notes: data.notes,
    },
  })

  revalidatePath('/performance')
}

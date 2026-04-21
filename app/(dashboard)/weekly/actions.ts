'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { startOfWeek, endOfWeek } from '@/lib/kpi-math'

type DealInput = {
  customerName: string
  vivintAccountIds: string[]
  product?: string
  upfrontCommission: number
  installDate?: string
  leadId?: string
  notes?: string
}

export async function upsertWeek(input: {
  weekStart: string
  metaSpend: number
  googleSpend: number
  otherSpend: number
  upfrontReceived: number
  backendReceived: number
  notes?: string
  metaCampaigns?: Array<{ name: string; spend: number; leads: number; cpl: number | null }>
  deals: DealInput[]
}) {
  const weekStart = startOfWeek(new Date(input.weekStart))
  const weekEnd = endOfWeek(new Date(input.weekStart))

  const kpi = await prisma.weeklyKpi.upsert({
    where: { weekStart },
    create: {
      weekStart,
      weekEnd,
      metaSpend: input.metaSpend,
      googleSpend: input.googleSpend,
      otherSpend: input.otherSpend,
      upfrontReceived: input.upfrontReceived,
      backendReceived: input.backendReceived,
      notes: input.notes,
      metaCampaigns: input.metaCampaigns as any,
    },
    update: {
      metaSpend: input.metaSpend,
      googleSpend: input.googleSpend,
      otherSpend: input.otherSpend,
      upfrontReceived: input.upfrontReceived,
      backendReceived: input.backendReceived,
      notes: input.notes,
      metaCampaigns: input.metaCampaigns as any,
    },
  })

  // Replace deals for this week
  await prisma.weeklyDeal.deleteMany({ where: { weeklyKpiId: kpi.id } })
  if (input.deals.length > 0) {
    await prisma.weeklyDeal.createMany({
      data: input.deals.map(d => ({
        weeklyKpiId: kpi.id,
        leadId: d.leadId || null,
        customerName: d.customerName,
        vivintAccountIds: d.vivintAccountIds,
        product: d.product || null,
        upfrontCommission: d.upfrontCommission,
        installDate: d.installDate ? new Date(d.installDate) : null,
        notes: d.notes || null,
      })),
    })
  }

  revalidatePath('/weekly')
  return { ok: true, id: kpi.id }
}

export async function deleteWeek(id: string) {
  await prisma.weeklyKpi.delete({ where: { id } })
  revalidatePath('/weekly')
  return { ok: true }
}

'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { AbTestStatus } from '@prisma/client'

export async function createAbTest(data: {
  name: string
  hypothesis: string
  variantA: string
  variantB: string
  metric: string
  notes?: string
}) {
  await prisma.abTest.create({ data })
  revalidatePath('/dashboard/experiments')
}

export async function updateAbTest(id: string, data: {
  status?: AbTestStatus
  winner?: string
  result?: string
  notes?: string
  endDate?: Date
}) {
  await prisma.abTest.update({ where: { id }, data })
  revalidatePath('/dashboard/experiments')
}

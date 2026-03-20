import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const patchSchema = z.object({
  b2bPipelineStage: z.string().optional(),
  qualificationScore: z.number().int().min(1).max(10).nullable().optional(),
  estimatedDealValue: z.number().positive().nullable().optional(),
  notes: z.string().nullable().optional(),
  assessmentDate: z.string().nullable().optional(),
  currentProvider: z.string().nullable().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  })

  if (!lead || lead.leadType !== 'B2B') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(lead)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.issues }, { status: 400 })
    }

    const data = parsed.data
    const updateData: Record<string, any> = {}

    if (data.b2bPipelineStage !== undefined) updateData.b2bPipelineStage = data.b2bPipelineStage
    if (data.qualificationScore !== undefined) updateData.qualificationScore = data.qualificationScore
    if (data.estimatedDealValue !== undefined) updateData.estimatedDealValue = data.estimatedDealValue
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.currentProvider !== undefined) updateData.currentProvider = data.currentProvider
    if (data.assessmentDate !== undefined) {
      updateData.assessmentDate = data.assessmentDate ? new Date(data.assessmentDate) : null
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData,
    })

    // Log stage changes
    if (data.b2bPipelineStage) {
      await prisma.activity.create({
        data: {
          leadId: id,
          type: 'STATUS_CHANGE',
          description: `B2B pipeline stage updated to: ${data.b2bPipelineStage}`,
        },
      })
    }

    return NextResponse.json(lead)
  } catch (err) {
    console.error('PATCH B2B lead error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

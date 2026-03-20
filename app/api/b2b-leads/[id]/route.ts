import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateB2BLeadSchema = z.object({
  b2bPipelineStage: z.string().optional(),
  qualificationScore: z.number().min(1).max(10).optional(),
  estimatedDealValue: z.number().optional().nullable(),
  assessmentDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  numberOfLocations: z.string().optional(),
  currentProvider: z.string().optional().nullable(),
  biggestConcern: z.string().optional().nullable(),
})

/**
 * GET /api/b2b-leads/[id] — Single B2B lead detail
 * PATCH /api/b2b-leads/[id] — Update B2B-specific fields
 *
 * Auth required: ADMIN or MANAGER
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } },
        },
        assignedRep: { select: { id: true, name: true, email: true, phone: true } },
      },
    })

    if (!lead || lead.leadType !== 'B2B') {
      return NextResponse.json({ error: 'B2B lead not found' }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch (err) {
    console.error('[B2B Lead Detail] GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const data = updateB2BLeadSchema.parse(body)

    const existing = await prisma.lead.findUnique({ where: { id } })
    if (!existing || existing.leadType !== 'B2B') {
      return NextResponse.json({ error: 'B2B lead not found' }, { status: 404 })
    }

    const updateData: any = { ...data }

    if (data.assessmentDate) {
      updateData.assessmentDate = new Date(data.assessmentDate)
    }

    // Log stage changes
    if (data.b2bPipelineStage && data.b2bPipelineStage !== existing.b2bPipelineStage) {
      await prisma.activity.create({
        data: {
          leadId: id,
          type: 'STATUS_CHANGE',
          description: `B2B pipeline stage changed from "${existing.b2bPipelineStage || 'New Lead'}" to "${data.b2bPipelineStage}"`,
        },
      })

      // Auto-set Won/Lost status
      if (data.b2bPipelineStage === 'Won') {
        updateData.status = 'CLOSED_WON'
        updateData.saleDate = new Date()
      } else if (data.b2bPipelineStage === 'Lost') {
        updateData.status = 'CLOSED_LOST'
      }
    }

    // Log qualification score changes
    if (data.qualificationScore && data.qualificationScore !== existing.qualificationScore) {
      await prisma.activity.create({
        data: {
          leadId: id,
          type: 'LEAD_SCORED',
          description: `Qualification score updated to ${data.qualificationScore}/10`,
        },
      })
    }

    // Log notes
    if (data.notes && data.notes !== existing.notes) {
      await prisma.activity.create({
        data: {
          leadId: id,
          type: 'NOTE_ADDED',
          description: 'Notes updated',
        },
      })
    }

    const lead = await prisma.lead.update({ where: { id }, data: updateData })
    return NextResponse.json(lead)
  } catch (err: any) {
    console.error('[B2B Lead Detail] PATCH error:', err)
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

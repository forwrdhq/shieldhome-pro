import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  numberOfLocations: z.string().optional(),
  biggestConcern: z.string().optional(),
  source: z.string().optional(),
  b2bPipelineStage: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const stage = searchParams.get('stage')
  const businessType = searchParams.get('businessType')
  const source = searchParams.get('source')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const skip = (page - 1) * limit

  const where: Record<string, any> = { leadType: 'B2B' }
  if (stage) where.b2bPipelineStage = stage
  if (businessType) where.businessType = businessType
  if (source) where.source = source
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    }
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true, firstName: true, lastName: true, fullName: true,
        email: true, phone: true, businessName: true, businessType: true,
        numberOfLocations: true, b2bPipelineStage: true, source: true,
        qualificationScore: true, estimatedDealValue: true, createdAt: true,
        submittedAt: true,
      },
    }),
    prisma.lead.count({ where }),
  ])

  return NextResponse.json({
    leads,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.issues }, { status: 400 })
    }

    const data = parsed.data
    const lead = await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        leadType: 'B2B',
        businessName: data.businessName,
        businessType: data.businessType,
        numberOfLocations: data.numberOfLocations,
        biggestConcern: data.biggestConcern,
        source: data.source || 'internal',
        b2bPipelineStage: data.b2bPipelineStage || 'New Lead',
        submittedAt: new Date(),
      },
    })

    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: 'LEAD_CREATED',
        description: `B2B lead created internally: ${data.businessName || lead.fullName}`,
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (err) {
    console.error('Create B2B lead error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

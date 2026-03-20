import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createB2BLeadSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().max(50).optional().default(''),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  businessName: z.string().min(1).max(100),
  businessType: z.string().optional(),
  numberOfLocations: z.string().optional(),
  currentProvider: z.string().optional(),
  biggestConcern: z.string().optional(),
  b2bPipelineStage: z.string().optional().default('New Lead'),
  estimatedDealValue: z.number().optional(),
  qualificationScore: z.number().min(1).max(10).optional(),
  source: z.string().optional().default('b2b-manual'),
  notes: z.string().optional(),
})

/**
 * GET /api/b2b-leads — Paginated B2B leads with filters
 * POST /api/b2b-leads — Create a new B2B lead internally
 *
 * Auth required: ADMIN or MANAGER
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const stage = searchParams.get('stage')
    const businessType = searchParams.get('businessType')
    const source = searchParams.get('source')
    const search = searchParams.get('search')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '25')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc'

    const where: any = { leadType: 'B2B' }

    if (stage) where.b2bPipelineStage = stage
    if (businessType) where.businessType = businessType
    if (source) where.source = source
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }
    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ]
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          fullName: true,
          email: true,
          phone: true,
          businessName: true,
          businessType: true,
          numberOfLocations: true,
          b2bPipelineStage: true,
          source: true,
          qualificationScore: true,
          estimatedDealValue: true,
          createdAt: true,
        },
      }),
      prisma.lead.count({ where }),
    ])

    return NextResponse.json({
      leads,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    console.error('[B2B Leads API] GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createB2BLeadSchema.parse(body)

    const lead = await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        fullName: [data.firstName, data.lastName].filter(Boolean).join(' '),
        leadType: 'B2B',
        businessName: data.businessName,
        businessType: data.businessType,
        numberOfLocations: data.numberOfLocations,
        currentProvider: data.currentProvider,
        biggestConcern: data.biggestConcern,
        b2bPipelineStage: data.b2bPipelineStage || 'New Lead',
        estimatedDealValue: data.estimatedDealValue,
        qualificationScore: data.qualificationScore,
        source: data.source,
        notes: data.notes,
      },
    })

    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: 'LEAD_CREATED',
        description: `B2B lead created for ${data.businessName} via ${data.source || 'manual entry'}`,
      },
    })

    return NextResponse.json({ success: true, lead })
  } catch (err: any) {
    console.error('[B2B Leads API] POST error:', err)
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

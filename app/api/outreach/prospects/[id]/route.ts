import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyOutreachAuth } from '@/lib/outreach/auth'

/**
 * GET /api/outreach/prospects/[id] — Get a single prospect
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = verifyOutreachAuth(req)
  if (authError) return authError

  const prospect = await prisma.outreachProspect.findUnique({
    where: { id: params.id },
    include: {
      campaign: { select: { name: true, status: true, instantlyCampaignId: true } },
      dma: { select: { metroName: true } },
    },
  })

  if (!prospect) {
    return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
  }

  return NextResponse.json({ prospect })
}

/**
 * PATCH /api/outreach/prospects/[id] — Update a single prospect
 *
 * Supported fields:
 *   - status: QUEUED | SENT | OPENED | CLICKED | REPLIED | INTERESTED |
 *             CONVERTED | BOUNCED | UNSUBSCRIBED | SUPPRESSED
 *   - campaignId: string
 *   - instantlyLeadId: string
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = verifyOutreachAuth(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const { status, campaignId, instantlyLeadId } = body

    const validStatuses = [
      'QUEUED', 'SENT', 'OPENED', 'CLICKED', 'REPLIED',
      'INTERESTED', 'NOT_INTERESTED', 'CONVERTED', 'BOUNCED', 'UNSUBSCRIBED',
    ]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (status !== undefined) updateData.status = status
    if (campaignId !== undefined) updateData.campaignId = campaignId
    if (instantlyLeadId !== undefined) updateData.instantlyLeadId = instantlyLeadId

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const prospect = await prisma.outreachProspect.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, prospect })
  } catch (err: any) {
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
    }
    console.error('Prospect update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

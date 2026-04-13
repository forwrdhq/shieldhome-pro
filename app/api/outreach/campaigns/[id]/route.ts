import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyOutreachAuth } from '@/lib/outreach/auth'

/**
 * GET /api/outreach/campaigns/[id] — Get a single campaign
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = verifyOutreachAuth(req)
  if (authError) return authError

  const campaign = await prisma.outreachCampaign.findUnique({
    where: { id: params.id },
    include: {
      dma: { select: { metroName: true, states: true } },
      _count: { select: { prospects: true } },
    },
  })

  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  return NextResponse.json({ campaign })
}

/**
 * PATCH /api/outreach/campaigns/[id] — Update campaign fields
 *
 * Supported fields:
 *   - status: DRAFT | ACTIVE | PAUSED | COMPLETED | ARCHIVED
 *   - instantlyCampaignId: string (set after creating in Instantly)
 *   - totalProspects, totalSent, totalOpens, totalClicks, totalReplies,
 *     totalInterested, totalConversions (for stats sync)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = verifyOutreachAuth(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const {
      status,
      instantlyCampaignId,
      totalProspects,
      totalSent,
      totalOpens,
      totalClicks,
      totalReplies,
      totalInterested,
      totalConversions,
    } = body

    // Validate status if provided
    const validStatuses = ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (status !== undefined) updateData.status = status
    if (instantlyCampaignId !== undefined) updateData.instantlyCampaignId = instantlyCampaignId
    if (totalProspects !== undefined) updateData.totalProspects = totalProspects
    if (totalSent !== undefined) updateData.totalSent = totalSent
    if (totalOpens !== undefined) updateData.totalOpens = totalOpens
    if (totalClicks !== undefined) updateData.totalClicks = totalClicks
    if (totalReplies !== undefined) updateData.totalReplies = totalReplies
    if (totalInterested !== undefined) updateData.totalInterested = totalInterested
    if (totalConversions !== undefined) updateData.totalConversions = totalConversions

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const campaign = await prisma.outreachCampaign.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, campaign })
  } catch (err: any) {
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }
    console.error('Campaign update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

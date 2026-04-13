import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyOutreachAuth } from '@/lib/outreach/auth'

/**
 * POST /api/outreach/prospects/bulk-update — Bulk status update
 *
 * Campaign Manager uses this after uploading prospects to Instantly
 * to mark a batch of QUEUED prospects as SENT (or another status).
 *
 * Body:
 *   - ids: string[]        — prospect IDs to update
 *   - status: string       — new status
 *   - campaignId?: string  — optionally assign all to a campaign
 */
export async function POST(req: NextRequest) {
  const authError = verifyOutreachAuth(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const { ids, status, campaignId } = body as {
      ids: string[]
      status: string
      campaignId?: string
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids array is required' }, { status: 400 })
    }

    if (ids.length > 1000) {
      return NextResponse.json(
        { error: 'Maximum 1000 prospects per bulk update' },
        { status: 400 }
      )
    }

    const validStatuses = [
      'QUEUED', 'SENT', 'OPENED', 'CLICKED', 'REPLIED',
      'INTERESTED', 'CONVERTED', 'BOUNCED', 'UNSUBSCRIBED', 'SUPPRESSED',
    ]
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = { status }
    if (campaignId !== undefined) updateData.campaignId = campaignId

    const result = await prisma.outreachProspect.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    })

    // If assigning to campaign, bump totalProspects count
    if (campaignId && result.count > 0) {
      await prisma.outreachCampaign.update({
        where: { id: campaignId },
        data: { totalProspects: { increment: result.count } },
      }).catch(() => {
        // Non-fatal if campaign doesn't exist
      })
    }

    return NextResponse.json({
      success: true,
      updated: result.count,
      requested: ids.length,
    })
  } catch (err: any) {
    console.error('Prospect bulk-update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

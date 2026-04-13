import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import * as instantly from '@/lib/instantly'
import { verifyOutreachAuth } from '@/lib/outreach/auth'

/**
 * GET /api/outreach/suppression — List suppression entries
 *
 * Query params:
 *   ?limit=50  — max results (default 50, max 500)
 *   ?offset=0  — pagination offset
 *   ?email=    — look up a single email
 */
export async function GET(req: NextRequest) {
  const authError = verifyOutreachAuth(req)
  if (authError) return authError

  const { searchParams } = new URL(req.url)
  const emailQuery = searchParams.get('email')?.toLowerCase()
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 500)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  if (emailQuery) {
    const entry = await prisma.suppressionList.findUnique({
      where: { email: emailQuery },
    })
    return NextResponse.json({ suppressed: !!entry, entry: entry ?? null })
  }

  const [entries, total] = await Promise.all([
    prisma.suppressionList.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.suppressionList.count(),
  ])

  return NextResponse.json({ entries, total, limit, offset })
}

/**
 * POST /api/outreach/suppression — Add emails/domains to suppression list
 *
 * Body:
 *   - entries: string[]   — emails or domains to suppress
 *   - reason?: string     — why (default: "manual")
 *   - syncToInstantly?: boolean — also add to Instantly block list (default: true)
 */
export async function POST(req: NextRequest) {
  const authError = verifyOutreachAuth(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const {
      entries,
      reason = 'manual',
      syncToInstantly = true,
    } = body as {
      entries: string[]
      reason?: string
      syncToInstantly?: boolean
    }

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: 'entries array is required' }, { status: 400 })
    }

    if (entries.length > 500) {
      return NextResponse.json({ error: 'Maximum 500 entries per request' }, { status: 400 })
    }

    const normalized = entries.map((e) => e.toLowerCase().trim()).filter(Boolean)

    // Upsert all entries (idempotent)
    const results = await Promise.allSettled(
      normalized.map((email) =>
        prisma.suppressionList.upsert({
          where: { email },
          update: {},
          create: { email, reason, source: 'api' },
        })
      )
    )

    const created = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    // Update any matching prospects to SUPPRESSED
    await prisma.outreachProspect.updateMany({
      where: { email: { in: normalized }, status: { notIn: ['BOUNCED', 'UNSUBSCRIBED', 'NOT_INTERESTED'] } },
      data: { status: 'NOT_INTERESTED' },
    })

    // Sync to Instantly block list
    if (syncToInstantly) {
      try {
        await instantly.addToBlockList({ entries: normalized })
      } catch {
        console.warn('Failed to sync suppression entries to Instantly block list')
      }
    }

    return NextResponse.json({ success: true, created, failed, total: normalized.length })
  } catch (err: any) {
    console.error('Suppression add error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/outreach/suppression — Remove an email from suppression list
 *
 * Body:
 *   - email: string
 */
export async function DELETE(req: NextRequest) {
  const authError = verifyOutreachAuth(req)
  if (authError) return authError

  try {
    const body = await req.json()
    const { email } = body as { email: string }

    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 })
    }

    await prisma.suppressionList.delete({
      where: { email: email.toLowerCase().trim() },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Email not found in suppression list' }, { status: 404 })
    }
    console.error('Suppression delete error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

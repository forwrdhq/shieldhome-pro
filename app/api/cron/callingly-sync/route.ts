import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import {
  listCalls,
  pickPhone,
  pickAgent,
  pickStatus,
  type CallinglyCall,
} from '@/lib/callingly'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.CALLINGLY_API_KEY) {
    return NextResponse.json({ error: 'CALLINGLY_API_KEY not set' }, { status: 500 })
  }

  const url = new URL(req.url)
  const backfill = url.searchParams.get('backfill') === '1'
  const limit = Number(url.searchParams.get('limit') || (backfill ? 500 : 100))

  try {
    const sinceDate = backfill
      ? new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 2 * 60 * 60 * 1000)

    let calls: CallinglyCall[] = []
    try {
      calls = await listCalls({ limit, since: sinceDate.toISOString() })
    } catch (e) {
      calls = await listCalls({ limit })
    }

    let upserted = 0
    let linked = 0
    let leadUpdates = 0

    for (const call of calls) {
      if (!call?.id) continue
      const phone = pickPhone(call)
      const agent = pickAgent(call)
      const status = pickStatus(call)
      const startedAt = call.started_at ? new Date(call.started_at) : null
      const endedAt = call.ended_at ? new Date(call.ended_at) : null

      const lead = await findLead(call.lead_id ? String(call.lead_id) : null, phone)

      await prisma.call.upsert({
        where: { callinglyId: String(call.id) },
        create: {
          callinglyId: String(call.id),
          leadId: lead?.id ?? null,
          phone: phone || '',
          status: status ?? null,
          duration: typeof call.duration === 'number' ? call.duration : null,
          recordingUrl: call.recording_url ?? null,
          agentId: agent.id ?? null,
          agentName: agent.name ?? null,
          result: call.result ?? null,
          startedAt,
          endedAt,
          raw: call as never,
        },
        update: {
          leadId: lead?.id ?? undefined,
          status: status ?? undefined,
          duration: typeof call.duration === 'number' ? call.duration : undefined,
          recordingUrl: call.recording_url ?? undefined,
          agentId: agent.id ?? undefined,
          agentName: agent.name ?? undefined,
          result: call.result ?? undefined,
          startedAt: startedAt ?? undefined,
          endedAt: endedAt ?? undefined,
          raw: call as never,
        },
      })
      upserted++

      if (lead) {
        linked++
        const callTime = startedAt || endedAt || new Date()
        const updates: Record<string, unknown> = {}
        if (!lead.firstContactAt) {
          updates.firstContactAt = callTime
          const speed = Math.round((callTime.getTime() - lead.submittedAt.getTime()) / 1000)
          if (speed >= 0) updates.speedToContact = speed
        }
        if (status) updates.latestCallStatus = status
        if (call.recording_url) updates.latestCallRecordingUrl = call.recording_url
        if (agent.name) updates.assignedAgent = agent.name
        if (call.lead_id) updates.callinglyLeadId = String(call.lead_id)
        if (!lead.lastContactDate || lead.lastContactDate < callTime) {
          updates.lastContactDate = callTime
        }
        if (status && lead.status === 'NEW') updates.status = 'CONTACTED'

        if (Object.keys(updates).length > 0) {
          await prisma.lead.update({ where: { id: lead.id }, data: updates as never })
          leadUpdates++
        }
      }
    }

    return NextResponse.json({
      success: true,
      fetched: calls.length,
      upserted,
      linked,
      leadUpdates,
      since: sinceDate.toISOString(),
      backfill,
    })
  } catch (err) {
    console.error('[callingly-sync] error:', err)
    return NextResponse.json(
      { error: 'Sync failed', message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}

async function findLead(callinglyLeadId: string | null, phone: string | null) {
  if (callinglyLeadId) {
    const byId = await prisma.lead.findUnique({ where: { callinglyLeadId } })
    if (byId) return byId
  }
  if (phone) {
    const variants = [phone, `+1${phone}`, `1${phone}`]
    return prisma.lead.findFirst({
      where: { OR: variants.map((p) => ({ phone: p })) },
      orderBy: { submittedAt: 'desc' },
    })
  }
  return null
}

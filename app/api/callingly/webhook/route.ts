import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import {
  type CallinglyCall,
  type CallinglyLead,
  normalizePhone,
  pickPhone,
  pickAgent,
  pickStatus,
  isAnswered,
} from '@/lib/callingly'

export const dynamic = 'force-dynamic'

type WebhookBody = {
  event?: string
  type?: string
  call?: CallinglyCall
  lead?: CallinglyLead
  data?: CallinglyCall | CallinglyLead
  [k: string]: unknown
}

export async function POST(req: NextRequest) {
  const expectedToken = process.env.CALLINGLY_WEBHOOK_TOKEN
  if (expectedToken) {
    const url = new URL(req.url)
    const token = url.searchParams.get('token') || req.headers.get('x-callingly-token')
    if (token !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let body: WebhookBody
  try {
    body = (await req.json()) as WebhookBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = (body.event || body.type || '').toLowerCase()

  try {
    if (event.includes('call')) {
      const call = (body.call || (body.data as CallinglyCall) || (body as unknown as CallinglyCall))
      await handleCallEvent(call)
    } else if (event.includes('lead')) {
      const lead = (body.lead || (body.data as CallinglyLead) || (body as unknown as CallinglyLead))
      await handleLeadEvent(lead)
    } else if (body.call) {
      await handleCallEvent(body.call)
    } else if (body.lead) {
      await handleLeadEvent(body.lead)
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[callingly webhook] error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: 'POST Callingly webhook events here' })
}

async function handleCallEvent(call: CallinglyCall) {
  if (!call?.id) return
  const phone = pickPhone(call)
  const agent = pickAgent(call)
  const status = pickStatus(call)
  const startedAt = call.started_at ? new Date(call.started_at) : null
  const endedAt = call.ended_at ? new Date(call.ended_at) : null

  const lead = await findLeadForCall(call, phone)

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

  if (!lead) return

  const callTime = startedAt || endedAt || new Date()
  const updates: Record<string, unknown> = {
    callsMade: { increment: 1 },
    lastContactDate: callTime,
  }
  if (!lead.firstContactAt) {
    updates.firstContactAt = callTime
    const speed = Math.round((callTime.getTime() - lead.submittedAt.getTime()) / 1000)
    if (speed >= 0) updates.speedToContact = speed
  }
  if (status) updates.latestCallStatus = status
  if (call.recording_url) updates.latestCallRecordingUrl = call.recording_url
  if (agent.name) updates.assignedAgent = agent.name
  if (call.lead_id) updates.callinglyLeadId = String(call.lead_id)
  if (status && lead.status === 'NEW') updates.status = 'CONTACTED'
  const note = `Callingly: ${status || 'call'}${agent.name ? ` (${agent.name})` : ''}${
    call.duration ? ` • ${call.duration}s` : ''
  }`
  updates.dispositionNote = note

  await prisma.lead.update({
    where: { id: lead.id },
    data: updates as never,
  })
}

async function handleLeadEvent(lead: CallinglyLead) {
  if (!lead?.id) return
  const phone = normalizePhone(lead.phone)
  const existing = await findLeadByCallinglyOrPhone(String(lead.id), phone, lead.email)
  if (!existing) return

  await prisma.lead.update({
    where: { id: existing.id },
    data: {
      callinglyLeadId: String(lead.id),
      assignedAgent: lead.agent?.name ?? undefined,
    },
  })
}

async function findLeadForCall(call: CallinglyCall, phone: string | null) {
  return findLeadByCallinglyOrPhone(call.lead_id ? String(call.lead_id) : null, phone, null)
}

async function findLeadByCallinglyOrPhone(
  callinglyLeadId: string | null,
  phone: string | null,
  email: string | null | undefined
) {
  if (callinglyLeadId) {
    const byId = await prisma.lead.findUnique({ where: { callinglyLeadId } })
    if (byId) return byId
  }
  if (phone) {
    const variants = [phone, `+1${phone}`, `1${phone}`]
    const byPhone = await prisma.lead.findFirst({
      where: { OR: variants.map((p) => ({ phone: p })) },
      orderBy: { submittedAt: 'desc' },
    })
    if (byPhone) return byPhone
  }
  if (email) {
    const byEmail = await prisma.lead.findFirst({
      where: { email },
      orderBy: { submittedAt: 'desc' },
    })
    if (byEmail) return byEmail
  }
  return null
}

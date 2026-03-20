import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import {
  verifyWebhookSignature,
  GHL_STAGE_TO_STATUS,
  getContact,
} from '@/lib/gohighlevel'

/**
 * POST /api/webhooks/ghl?secret=<GHL_WEBHOOK_SECRET>
 *
 * Receives inbound webhooks from GoHighLevel when:
 *  - A contact is updated
 *  - An opportunity stage changes
 *  - A contact replies (inbound call/SMS/email)
 *
 * GHL sends the webhook payload as JSON in the request body.
 */
export async function POST(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get('secret')
    const rawBody = await req.text()

    if (!verifyWebhookSignature(rawBody, secret)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    const eventType = payload.type || payload.event || detectEventType(payload)

    console.log(`[GHL Webhook] Received event: ${eventType}`)

    switch (eventType) {
      case 'OpportunityStageUpdate':
      case 'opportunity.stage.update':
        await handleOpportunityStageUpdate(payload)
        break

      case 'ContactCreate':
      case 'contact.create':
        // GHL created a new contact — we could pull it into our DB
        // For now, just log it (contacts are created from our side)
        console.log('[GHL Webhook] Contact created in GHL:', payload.contactId || payload.id)
        break

      case 'ContactUpdate':
      case 'contact.update':
        await handleContactUpdate(payload)
        break

      case 'InboundMessage':
      case 'inbound.message':
        await handleInboundMessage(payload)
        break

      case 'NoteCreate':
      case 'note.create':
        await handleNoteCreate(payload)
        break

      default:
        console.log(`[GHL Webhook] Unhandled event type: ${eventType}`, JSON.stringify(payload).slice(0, 500))
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[GHL Webhook] Error processing webhook:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Also accept GET for GHL webhook verification pings
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!verifyWebhookSignature('', secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ status: 'ok', message: 'GHL webhook endpoint active' })
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

function detectEventType(payload: any): string {
  if (payload.pipelineStageId || payload.pipeline_stage_id) return 'OpportunityStageUpdate'
  if (payload.contactId && payload.body) return 'InboundMessage'
  if (payload.email || payload.phone) return 'ContactUpdate'
  return 'unknown'
}

async function handleOpportunityStageUpdate(payload: any) {
  const contactEmail = payload.contact?.email || payload.email
  const contactPhone = payload.contact?.phone || payload.phone
  const stageName = payload.pipelineStageName || payload.pipeline_stage_name || ''

  if (!contactEmail && !contactPhone) {
    console.warn('[GHL Webhook] Opportunity update missing contact info')
    return
  }

  // Find matching lead
  const lead = await prisma.lead.findFirst({
    where: {
      OR: [
        ...(contactEmail ? [{ email: contactEmail }] : []),
        ...(contactPhone ? [{ phone: contactPhone }] : []),
      ],
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!lead) {
    console.log(`[GHL Webhook] No matching lead for contact ${contactEmail || contactPhone}`)
    return
  }

  // Map GHL stage → ShieldHome status
  const newStatus = GHL_STAGE_TO_STATUS[stageName]
  if (!newStatus || newStatus === lead.status) return

  const oldStatus = lead.status
  await prisma.lead.update({
    where: { id: lead.id },
    data: { status: newStatus as any },
  })

  await prisma.activity.create({
    data: {
      leadId: lead.id,
      type: 'STATUS_CHANGE',
      description: `Status changed from ${oldStatus} to ${newStatus} (synced from GHL)`,
      metadata: { source: 'ghl_webhook', stageName, oldStatus, newStatus },
    },
  })

  console.log(`[GHL Webhook] Updated lead ${lead.id} status: ${oldStatus} → ${newStatus}`)
}

async function handleContactUpdate(payload: any) {
  const email = payload.email
  const phone = payload.phone
  if (!email && !phone) return

  const lead = await prisma.lead.findFirst({
    where: {
      OR: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!lead) return

  // Sync tags as notes if present
  const tags = payload.tags as string[] | undefined
  if (tags?.length) {
    const tagNote = `[GHL Tags] ${tags.join(', ')}`
    if (!lead.notes?.includes(tagNote)) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { notes: (lead.notes || '') + `\n${tagNote}` },
      })
    }
  }
}

async function handleInboundMessage(payload: any) {
  const contactPhone = payload.phone || payload.from
  const contactEmail = payload.email
  if (!contactPhone && !contactEmail) return

  const lead = await prisma.lead.findFirst({
    where: {
      OR: [
        ...(contactEmail ? [{ email: contactEmail }] : []),
        ...(contactPhone ? [{ phone: contactPhone }] : []),
      ],
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!lead) return

  const messageType = payload.messageType || 'sms'
  const messageBody = payload.body || payload.message || '(no content)'

  await prisma.activity.create({
    data: {
      leadId: lead.id,
      type: messageType === 'email' ? 'EMAIL_SENT' : 'SMS_SENT',
      description: `Inbound ${messageType} from contact (via GHL): ${messageBody.slice(0, 200)}`,
      metadata: { source: 'ghl_webhook', messageType, body: messageBody },
    },
  })

  // Mark lead as contacted if still NEW
  if (lead.status === 'NEW') {
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: 'CONTACTED',
        lastContactDate: new Date(),
        firstContactAt: lead.firstContactAt || new Date(),
      },
    })
  }
}

async function handleNoteCreate(payload: any) {
  const contactId = payload.contactId
  if (!contactId) return

  try {
    const contact = await getContact(contactId)
    const email = contact.email
    const phone = contact.phone
    if (!email && !phone) return

    const lead = await prisma.lead.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!lead) return

    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: 'NOTE_ADDED',
        description: `Note added in GHL: ${(payload.body || '').slice(0, 300)}`,
        metadata: { source: 'ghl_webhook' },
      },
    })
  } catch (err) {
    console.error('[GHL Webhook] Failed to process note:', err)
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendSlackNotification } from '@/lib/notifications'
import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Verify Instantly webhook signature using HMAC-SHA256.
 */
function verifyWebhookSignature(secret: string, body: string, signature: string | null): boolean {
  if (!signature) return false
  const expected = createHmac('sha256', secret).update(body).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

/**
 * POST /api/webhooks/instantly — Handle Instantly webhook events
 *
 * Receives events for: replies, opens, clicks, bounces, unsubscribes.
 * Logs every event, updates prospect status, and routes interested
 * leads to the CRM with Slack notifications.
 */
export async function POST(req: NextRequest) {
  try {
    // Verify webhook authenticity
    const webhookSecret = process.env.INSTANTLY_WEBHOOK_SECRET
    if (webhookSecret) {
      const rawBody = await req.text()
      const signature = req.headers.get('x-instantly-signature')
      if (!verifyWebhookSignature(webhookSecret, rawBody, signature)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
      // Parse body from the raw text we already read
      var payload = JSON.parse(rawBody)
    } else {
      var payload = await req.json()
    }

    // Extract event data — Instantly webhook payload structure
    const eventType = payload.event_type || payload.type || 'unknown'
    const leadEmail = payload.lead_email || payload.email || payload.to_email
    const campaignId = payload.campaign_id
    const eventId = payload.event_id || payload.id

    // Idempotency check — skip if we've already processed this event
    if (eventId) {
      const existingEvent = await prisma.outreachEvent.findFirst({
        where: { eventId },
      })
      if (existingEvent) {
        return NextResponse.json({ success: true, action: 'skipped_duplicate' })
      }
    }

    // Find the prospect by email
    const prospect = leadEmail
      ? await prisma.outreachProspect.findUnique({
          where: { email: leadEmail.toLowerCase() },
          include: { campaign: true },
        })
      : null

    // Log the raw event
    await prisma.outreachEvent.create({
      data: {
        eventType,
        eventId: eventId || null,
        prospectId: prospect?.id || null,
        campaignId: campaignId || null,
        payload,
        processedAt: new Date(),
      },
    })

    if (!prospect) {
      // Event for a lead we don't have — log but don't process
      return NextResponse.json({ success: true, action: 'logged_unknown_prospect' })
    }

    // Process based on event type
    switch (normalizeEventType(eventType)) {
      case 'open': {
        const openStatus = (prospect.status === 'QUEUED' || prospect.status === 'SENT') ? 'OPENED' : prospect.status
        await prisma.outreachProspect.update({
          where: { id: prospect.id },
          data: {
            opensCount: { increment: 1 },
            status: openStatus,
          },
        })
        if (prospect.campaignId) {
          await prisma.outreachCampaign.update({
            where: { id: prospect.campaignId },
            data: { totalOpens: { increment: 1 } },
          })
        }
        break
      }

      case 'click': {
        const clickStatus = ['QUEUED', 'SENT', 'OPENED'].includes(prospect.status) ? 'CLICKED' : prospect.status
        await prisma.outreachProspect.update({
          where: { id: prospect.id },
          data: {
            clicksCount: { increment: 1 },
            status: clickStatus,
          },
        })
        if (prospect.campaignId) {
          await prisma.outreachCampaign.update({
            where: { id: prospect.campaignId },
            data: { totalClicks: { increment: 1 } },
          })
        }
        break
      }

      case 'reply': {
        const replyLabel = payload.label || payload.interest_status || 'unknown'
        const isInterested = replyLabel === 'interested' || replyLabel === 'Interested'

        await prisma.outreachProspect.update({
          where: { id: prospect.id },
          data: {
            repliedAt: new Date(),
            replyLabel,
            status: isInterested ? 'INTERESTED' : 'REPLIED',
          },
        })

        // Update campaign stats
        if (prospect.campaignId) {
          await prisma.outreachCampaign.update({
            where: { id: prospect.campaignId },
            data: {
              totalReplies: { increment: 1 },
              ...(isInterested ? { totalInterested: { increment: 1 } } : {}),
            },
          })
        }

        // If interested, create a CRM lead and notify via Slack
        if (isInterested && !prospect.convertedLeadId) {
          // Atomic check to prevent race condition
          const canConvert = await prisma.outreachProspect.updateMany({
            where: { id: prospect.id, convertedLeadId: null },
            data: { status: 'INTERESTED' },
          })
          if (canConvert.count === 0) break // already converted by another request

          const lead = await prisma.lead.create({
            data: {
              firstName: prospect.firstName || prospect.businessName,
              lastName: prospect.lastName || '',
              fullName: [prospect.firstName, prospect.lastName].filter(Boolean).join(' ') || prospect.businessName,
              email: prospect.email,
              phone: prospect.phone || '',
              propertyType: 'BUSINESS',
              source: 'instantly',
              medium: 'cold_email',
              campaign: prospect.campaign?.name || prospect.nicheSlug,
              landingPage: '/business',
              segment: 'business-outreach',
              leadScore: 80,
              priority: 'HIGH',
              notes: `[Cold outreach reply — ${prospect.nicheSlug}] Prospect replied with interest. Business: ${prospect.businessName}`,
            },
          })

          await prisma.outreachProspect.update({
            where: { id: prospect.id },
            data: {
              convertedLeadId: lead.id,
              convertedAt: new Date(),
              status: 'CONVERTED',
            },
          })

          if (prospect.campaignId) {
            await prisma.outreachCampaign.update({
              where: { id: prospect.campaignId },
              data: { totalConversions: { increment: 1 } },
            })
          }

          await prisma.activity.create({
            data: {
              leadId: lead.id,
              type: 'LEAD_CREATED',
              description: `Cold outreach interested reply converted to lead. Niche: ${prospect.nicheSlug}. Business: ${prospect.businessName}`,
            },
          })

          // Slack notification
          try {
            await sendSlackNotification({
              id: lead.id,
              firstName: lead.firstName,
              lastName: lead.lastName,
              fullName: lead.fullName,
              phone: lead.phone,
              email: lead.email,
              zipCode: '',
              propertyType: 'BUSINESS',
              leadScore: lead.leadScore,
              priority: lead.priority,
              source: 'instantly',
              medium: 'cold_email',
              campaign: lead.campaign,
              segment: 'business-outreach',
              landingPage: '/business',
              productsInterested: [],
              currentProvider: null,
            })
          } catch {
            console.warn('Failed to send Slack notification for outreach lead:', lead.id)
          }
        }
        break
      }

      case 'bounce': {
        await prisma.outreachProspect.update({
          where: { id: prospect.id },
          data: { status: 'BOUNCED' },
        })

        // Add to suppression list
        await prisma.suppressionList.upsert({
          where: { email: prospect.email },
          update: {},
          create: {
            email: prospect.email,
            reason: 'bounce',
            source: 'instantly_webhook',
          },
        })
        break
      }

      case 'unsubscribe': {
        await prisma.outreachProspect.update({
          where: { id: prospect.id },
          data: { status: 'UNSUBSCRIBED' },
        })

        await prisma.suppressionList.upsert({
          where: { email: prospect.email },
          update: {},
          create: {
            email: prospect.email,
            reason: 'unsubscribe',
            source: 'instantly_webhook',
          },
        })
        break
      }

      case 'sent': {
        const sentStatus = prospect.status === 'QUEUED' ? 'SENT' : prospect.status
        await prisma.outreachProspect.update({
          where: { id: prospect.id },
          data: {
            emailsSent: { increment: 1 },
            status: sentStatus,
          },
        })

        if (prospect.campaignId) {
          await prisma.outreachCampaign.update({
            where: { id: prospect.campaignId },
            data: { totalSent: { increment: 1 } },
          })
        }
        break
      }

      default:
        // Unknown event type — already logged above
        break
    }

    return NextResponse.json({ success: true, action: 'processed', eventType })
  } catch (err: any) {
    console.error('Instantly webhook error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Normalize Instantly event type strings to our internal types.
 */
function normalizeEventType(eventType: string): string {
  const normalized = eventType.toLowerCase().replace(/[^a-z]/g, '')
  if (normalized.includes('reply') || normalized.includes('replied')) return 'reply'
  if (normalized.includes('open')) return 'open'
  if (normalized.includes('click')) return 'click'
  if (normalized.includes('bounce')) return 'bounce'
  if (normalized.includes('unsubscri')) return 'unsubscribe'
  if (normalized.includes('sent') || normalized.includes('delivered')) return 'sent'
  return eventType
}

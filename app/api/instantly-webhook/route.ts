import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/instantly-webhook
 *
 * Backup direct endpoint for Instantly reply webhooks.
 * Instantly can send webhooks here in addition to Make.com.
 *
 * Auth: Bearer token via INSTANTLY_WEBHOOK_SECRET env var.
 * Always returns 200 (Instantly requires a fast 200 response).
 */
export async function POST(req: NextRequest) {
  // Verify Bearer token
  const authHeader = req.headers.get('authorization')
  const secret = process.env.INSTANTLY_WEBHOOK_SECRET
  if (secret) {
    const token = authHeader?.replace('Bearer ', '')
    if (token !== secret) {
      console.warn('[Instantly Webhook] Unauthorized request — invalid bearer token')
      return NextResponse.json({ received: true }, { status: 200 })
    }
  } else {
    console.warn('[Instantly Webhook] INSTANTLY_WEBHOOK_SECRET not set — accepting all requests')
  }

  try {
    const payload = await req.json()
    console.log('[Instantly Webhook] Received:', JSON.stringify(payload).slice(0, 500))

    const sentimentLabel = payload.sentimentLabel || ''
    const lead = payload.lead || {}
    const campaign = payload.campaign || {}
    const reply = payload.reply || {}

    const firstName = lead.firstName || payload.firstName || ''
    const lastName = lead.lastName || payload.lastName || ''
    const email = lead.email || payload.email || ''
    const companyName = lead.companyName || payload.companyName || ''
    const replyText = reply.text || payload.replyText || ''
    const campaignName = campaign.name || payload.campaignName || ''

    if (sentimentLabel === 'Interested') {
      // Fire to GHL and Slack concurrently
      const results = await Promise.allSettled([
        postToGhl({ firstName, lastName, email, companyName, campaignName, replyText }),
        postToSlack({ firstName, lastName, email, companyName, campaignName, replyText, sentimentLabel }),
      ])

      results.forEach((result, i) => {
        const target = i === 0 ? 'GHL' : 'Slack'
        if (result.status === 'rejected') {
          console.error(`[Instantly Webhook] Failed to POST to ${target}:`, result.reason)
        }
      })
    } else if (
      sentimentLabel === 'Not Interested' ||
      sentimentLabel === 'Unsubscribe' ||
      sentimentLabel.toLowerCase().includes('unsubscribe')
    ) {
      console.log(`[Instantly Webhook] Lead ${email} sentiment: ${sentimentLabel} — logged, GHL cleanup via Make.com`)
    } else {
      console.log(`[Instantly Webhook] Lead ${email} sentiment: ${sentimentLabel} — no action`)
    }
  } catch (err) {
    console.error('[Instantly Webhook] Error processing payload:', err)
  }

  // Always return 200 — Instantly requires a fast response
  return NextResponse.json({ received: true })
}

async function postToGhl(data: {
  firstName: string
  lastName: string
  email: string
  companyName: string
  campaignName: string
  replyText: string
}) {
  const ghlUrl = process.env.GHL_B2B_WEBHOOK_URL
  if (!ghlUrl) {
    console.warn('[Instantly Webhook] GHL_B2B_WEBHOOK_URL not configured — skipping')
    return
  }

  const res = await fetch(ghlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      companyName: data.companyName,
      leadSource: 'Cold Email',
      instantlyCampaignName: data.campaignName,
      replyText: data.replyText,
      tags: ['b2b-source-cold-email'],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GHL responded ${res.status}: ${text}`)
  }
}

async function postToSlack(data: {
  firstName: string
  lastName: string
  email: string
  companyName: string
  campaignName: string
  replyText: string
  sentimentLabel: string
}) {
  const slackUrl = process.env.SLACK_WEBHOOK_URL
  if (!slackUrl) {
    console.warn('[Instantly Webhook] SLACK_WEBHOOK_URL not configured — skipping')
    return
  }

  const res = await fetch(slackUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '📧 New B2B Cold Email Reply', emoji: true },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*From:*\n${data.firstName} ${data.lastName} at ${data.companyName}` },
            { type: 'mrkdwn', text: `*Campaign:*\n${data.campaignName}` },
          ],
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: `*Reply:*\n>${data.replyText.slice(0, 500)}` },
        },
        {
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: `*Sentiment:* ${data.sentimentLabel} | *Email:* ${data.email}` },
          ],
        },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Slack responded ${res.status}: ${text}`)
  }
}

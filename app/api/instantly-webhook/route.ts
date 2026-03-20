import { NextRequest, NextResponse } from 'next/server'
import { APP_URL } from '@/lib/constants'

interface InstantlyPayload {
  email?: string
  firstName?: string
  lastName?: string
  companyName?: string
  replyText?: string
  campaignName?: string
  campaignId?: string
  leadId?: string
  sentimentLabel?: string
}

async function postToGHL(payload: InstantlyPayload) {
  const ghlUrl = process.env.GHL_B2B_WEBHOOK_URL
  if (!ghlUrl) return

  await fetch(ghlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      email: payload.email || '',
      companyName: payload.companyName || '',
      leadSource: 'Cold Email',
      instantlyCampaignName: payload.campaignName || '',
      replyText: payload.replyText || '',
      tags: ['b2b-source-cold-email'],
      leadType: 'B2B',
    }),
  })
}

async function postToSlack(payload: InstantlyPayload) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `📧 New B2B Cold Email Reply — ${payload.firstName} ${payload.lastName} at ${payload.companyName}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `📧 New B2B Cold Email Reply`,
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*From:*\n${payload.firstName} ${payload.lastName} at ${payload.companyName}` },
            { type: 'mrkdwn', text: `*Campaign:*\n${payload.campaignName || 'N/A'}` },
            { type: 'mrkdwn', text: `*Reply:*\n${payload.replyText?.slice(0, 300) || 'N/A'}` },
            { type: 'mrkdwn', text: `*Sentiment:*\n✅ ${payload.sentimentLabel}` },
          ],
        },
      ],
    }),
  })
}

export async function POST(request: NextRequest) {
  // Verify Bearer token
  const authHeader = request.headers.get('authorization')
  const secret = process.env.INSTANTLY_WEBHOOK_SECRET

  if (secret) {
    if (!authHeader || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let payload: InstantlyPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const sentiment = payload.sentimentLabel || ''

  if (sentiment === 'Interested') {
    // Fire GHL + Slack concurrently — don't await to respond fast
    Promise.allSettled([
      postToGHL(payload),
      postToSlack(payload),
    ]).catch((err) => console.error('Instantly webhook notification error:', err))
  } else if (sentiment === 'Not Interested' || sentiment.toLowerCase().includes('unsubscribe')) {
    console.log(`[instantly-webhook] Non-interested reply from ${payload.email} — sentiment: ${sentiment}`)
    // GHL cleanup handled via Make.com
  } else {
    console.log(`[instantly-webhook] Ignored reply from ${payload.email} — sentiment: ${sentiment}`)
  }

  // Always return 200 quickly — Instantly requires fast response
  return NextResponse.json({ received: true }, { status: 200 })
}

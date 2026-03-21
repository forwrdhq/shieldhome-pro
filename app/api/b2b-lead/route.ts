import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/sendgrid'
import { APP_URL } from '@/lib/constants'

const b2bLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  businessName: z.string().min(1, 'Business name is required'),
  numberOfLocations: z.string().min(1, 'Number of locations is required'),
  businessType: z.string().min(1, 'Business type is required'),
  biggestConcern: z.string().min(1, 'Biggest concern is required'),
  tcpaConsent: z.boolean().refine((v) => v === true, 'TCPA consent is required'),
})

async function sendAdminEmail(lead: z.infer<typeof b2bLeadSchema> & { id: string }) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a2e;">
  <div style="background:#00C853;padding:16px 20px;border-radius:8px 8px 0 0;">
    <h2 style="color:white;margin:0;font-size:18px;">🏢 New B2B Lead — ${lead.businessName}</h2>
  </div>
  <div style="background:#f8f9fa;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:6px 0;color:#6b7280;width:40%;">Name</td><td style="padding:6px 0;font-weight:600;">${lead.firstName} ${lead.lastName}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Business</td><td style="padding:6px 0;font-weight:600;">${lead.businessName}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Business Type</td><td style="padding:6px 0;">${lead.businessType}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;"># Locations</td><td style="padding:6px 0;">${lead.numberOfLocations}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Phone</td><td style="padding:6px 0;"><a href="tel:${lead.phone}" style="color:#00C853;">${lead.phone}</a></td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;">${lead.email}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Top Concern</td><td style="padding:6px 0;">${lead.biggestConcern}</td></tr>
    </table>
    <div style="margin-top:20px;text-align:center;">
      <a href="${APP_URL}/dashboard/b2b-leads/${lead.id}" style="background:#00C853;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
        View in Dashboard →
      </a>
    </div>
    <p style="color:#6b7280;font-size:12px;text-align:center;margin-top:16px;">⚡ Speed to lead is everything — contact within 2 hours</p>
  </div>
</body>
</html>`

  await sendEmail({
    to: adminEmail,
    subject: `🏢 New B2B Lead: ${lead.firstName} ${lead.lastName} at ${lead.businessName}`,
    html,
  })
}

async function sendSlackNotification(lead: z.infer<typeof b2bLeadSchema> & { id: string }) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🏢 New B2B Lead: ${lead.firstName} ${lead.lastName} at ${lead.businessName} (${lead.businessType}) — ${lead.numberOfLocations} — ${lead.phone} — ${lead.email} — Concern: ${lead.biggestConcern}`,
        blocks: [
          {
            type: 'header',
            text: { type: 'plain_text', text: `🏢 New B2B Lead: ${lead.businessName}`, emoji: true },
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Contact:*\n${lead.firstName} ${lead.lastName}` },
              { type: 'mrkdwn', text: `*Business Type:*\n${lead.businessType}` },
              { type: 'mrkdwn', text: `*Phone:*\n<tel:${lead.phone}|${lead.phone}>` },
              { type: 'mrkdwn', text: `*Email:*\n${lead.email}` },
              { type: 'mrkdwn', text: `*# Locations:*\n${lead.numberOfLocations}` },
              { type: 'mrkdwn', text: `*Top Concern:*\n${lead.biggestConcern}` },
            ],
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: 'View in CRM' },
                url: `${APP_URL}/dashboard/b2b-leads/${lead.id}`,
                style: 'primary',
              },
            ],
          },
        ],
      }),
    })
  } catch (err) {
    console.error('B2B Slack notification error:', err)
  }
}

async function postToGHL(lead: z.infer<typeof b2bLeadSchema> & { id: string }) {
  const ghlUrl = process.env.GHL_B2B_WEBHOOK_URL
  if (!ghlUrl) return

  await fetch(ghlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      businessName: lead.businessName,
      numberOfLocations: lead.numberOfLocations,
      businessType: lead.businessType,
      biggestConcern: lead.biggestConcern,
      leadType: 'B2B',
      source: 'website',
      leadId: lead.id,
    }),
  })
}

async function postToMake(lead: z.infer<typeof b2bLeadSchema> & { id: string }) {
  const makeUrl = process.env.MAKE_B2B_WEBHOOK_URL
  if (!makeUrl) return

  await fetch(makeUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      businessName: lead.businessName,
      numberOfLocations: lead.numberOfLocations,
      businessType: lead.businessType,
      biggestConcern: lead.biggestConcern,
      leadType: 'B2B',
      source: 'website',
      leadId: lead.id,
    }),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = b2bLeadSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || 'Validation error', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        leadType: 'B2B',
        businessName: data.businessName,
        numberOfLocations: data.numberOfLocations,
        businessType: data.businessType,
        biggestConcern: data.biggestConcern,
        b2bPipelineStage: 'New Lead',
        source: 'website',
        landingPage: '/business',
        tcpaConsent: data.tcpaConsent,
        tcpaConsentAt: new Date(),
        submittedAt: new Date(),
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: 'LEAD_CREATED',
        description: `B2B lead created: ${data.businessName} (${data.businessType})`,
      },
    })

    // Fire all notifications concurrently — failures don't affect the 200 response
    await Promise.allSettled([
      sendAdminEmail({ ...data, id: lead.id }),
      sendSlackNotification({ ...data, id: lead.id }),
      postToGHL({ ...data, id: lead.id }),
      postToMake({ ...data, id: lead.id }),
    ])

    return NextResponse.json({ success: true, message: 'Lead received' }, { status: 200 })
  } catch (err) {
    console.error('B2B lead submission error:', err)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}

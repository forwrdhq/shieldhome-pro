import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { b2bLeadSchema } from '@/lib/validation'
import { sendEmail } from '@/lib/sendgrid'
import { APP_URL } from '@/lib/constants'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = b2bLeadSchema.parse(body)

    // Rate limit: max 5 submissions per IP per hour
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || undefined
    if (ipAddress) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const recentFromIP = await prisma.lead.count({
        where: { ipAddress, createdAt: { gte: oneHourAgo } }
      })
      if (recentFromIP >= 5) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
      }
    }

    const fullName = `${data.firstName} ${data.lastName}`

    // Create the lead
    const lead = await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        fullName,
        leadType: 'B2B',
        businessName: data.businessName,
        numberOfLocations: data.numberOfLocations,
        businessType: data.businessType,
        biggestConcern: data.biggestConcern,
        propertyType: 'BUSINESS',
        source: 'website',
        medium: 'organic',
        landingPage: '/business',
        leadScore: 80,
        priority: 'HIGH',
        tcpaConsent: true,
        tcpaConsentAt: new Date(),
        ipAddress,
      }
    })

    // Log creation activity
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: 'LEAD_CREATED',
        description: `B2B lead created: ${data.businessName} (${data.businessType}) — ${data.numberOfLocations}`,
      }
    })

    // Fire notifications asynchronously (don't block response)
    const notifications: Promise<unknown>[] = []

    // Admin email via SendGrid
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      notifications.push(
        sendEmail({
          to: adminEmail,
          subject: `🏢 New B2B Lead: ${fullName} at ${data.businessName}`,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a2e;">
  <div style="background: #1A1A2E; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #00C853; margin: 0;">New B2B Lead</h1>
  </div>
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1a1a2e; margin-top: 0;">${fullName} at ${data.businessName}</h2>
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #00C853;">
      <p><strong>📧 Email:</strong> ${data.email}</p>
      <p><strong>📞 Phone:</strong> ${data.phone}</p>
      <p><strong>🏢 Business:</strong> ${data.businessName}</p>
      <p><strong>🏷️ Type:</strong> ${data.businessType}</p>
      <p><strong>📍 Locations:</strong> ${data.numberOfLocations}</p>
      <p><strong>⚠️ Concern:</strong> ${data.biggestConcern}</p>
    </div>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${APP_URL}/leads/${lead.id}" style="background: #00C853; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View in CRM</a>
    </div>
  </div>
</body>
</html>`,
        })
      )
    }

    // Slack notification
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL
    if (slackWebhookUrl) {
      notifications.push(
        fetch(slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🏢 New B2B Lead: ${fullName} at ${data.businessName} (${data.businessType}) — ${data.numberOfLocations} — ${data.phone} — ${data.email} — Concern: ${data.biggestConcern}`,
          }),
        }).catch(err => console.error('Slack webhook error:', err))
      )
    }

    // GoHighLevel webhook
    const ghlWebhookUrl = process.env.GHL_B2B_WEBHOOK_URL
    if (ghlWebhookUrl) {
      notifications.push(
        fetch(ghlWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            businessName: data.businessName,
            numberOfLocations: data.numberOfLocations,
            businessType: data.businessType,
            biggestConcern: data.biggestConcern,
            leadType: 'B2B',
            source: 'website',
            landingPage: '/business',
          }),
        }).catch(err => console.error('GHL webhook error:', err))
      )
    }

    Promise.allSettled(notifications).catch(console.error)

    return NextResponse.json({ success: true, message: 'Lead received' })
  } catch (err: any) {
    console.error('B2B lead creation error:', err)
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid form data', details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

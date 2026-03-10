import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/sendgrid'
import { COMPANY_NAME, FROM_EMAIL } from '@/lib/constants'

const REQUEST_TYPE_LABELS: Record<string, string> = {
  opt_out_sale: 'Opt Out of Sale / Sharing of Personal Information',
  opt_out_marketing: 'Opt Out of Marketing Communications',
  opt_out_sms: 'Opt Out of SMS Messages',
  delete: 'Request Deletion of Personal Information',
  access: 'Request Access to Personal Information',
  correct: 'Request Correction of Personal Information',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, requestType, message } = body

    if (!firstName || !lastName || !email || !requestType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const requestLabel = REQUEST_TYPE_LABELS[requestType] || requestType
    const submittedAt = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'short',
    })

    // Notify admin
    const adminHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a2e;">
  <div style="background: #1A1A2E; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px;">⚖️ Privacy Request Received</h1>
    <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0; font-size: 14px;">${COMPANY_NAME} — Do Not Sell / Privacy Request</p>
  </div>
  <div style="background: #f8f9fa; padding: 24px; border-radius: 0 0 8px 8px;">
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr><td style="padding: 8px 0; font-weight: bold; color: #666; width: 140px;">Name</td><td style="padding: 8px 0;">${firstName} ${lastName}</td></tr>
      <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Phone</td><td style="padding: 8px 0;">${phone || 'Not provided'}</td></tr>
      <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Request Type</td><td style="padding: 8px 0;"><strong style="color: #1A1A2E;">${requestLabel}</strong></td></tr>
      <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Submitted</td><td style="padding: 8px 0;">${submittedAt}</td></tr>
      ${message ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666; vertical-align: top;">Details</td><td style="padding: 8px 0;">${message}</td></tr>` : ''}
    </table>
    <div style="margin-top: 20px; padding: 16px; background: #fff3cd; border-radius: 8px; font-size: 13px;">
      <strong>⚠️ Action Required:</strong> You must respond to this request within <strong>45 calendar days</strong> under CCPA/CPRA requirements.
    </div>
  </div>
</body>
</html>`

    // Confirmation to requester
    const confirmationHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a2e;">
  <div style="background: #1A1A2E; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px;">${COMPANY_NAME}</h1>
    <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0; font-size: 14px;">Privacy Request Confirmation</p>
  </div>
  <div style="background: #f8f9fa; padding: 24px; border-radius: 0 0 8px 8px;">
    <p>Hi ${firstName},</p>
    <p>We have received your privacy request and will process it within <strong>45 calendar days</strong>.</p>
    <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #00C853; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px;"><strong>Request type:</strong> ${requestLabel}</p>
      <p style="margin: 8px 0 0; font-size: 14px;"><strong>Submitted:</strong> ${submittedAt}</p>
    </div>
    <p>We may contact you to verify your identity before processing. If you have questions, reply to this email or call us at <a href="tel:+18775550199" style="color: #00C853;">+1 (877) 555-0199</a>.</p>
    <p style="color: #666; font-size: 12px; margin-top: 30px;">
      ${COMPANY_NAME} — Authorized Vivint Smart Home Dealer<br>
      <a href="https://shieldhomepro.com/privacy" style="color: #999;">Privacy Policy</a>
    </p>
  </div>
</body>
</html>`

    await Promise.allSettled([
      sendEmail({
        to: process.env.ADMIN_EMAIL || FROM_EMAIL,
        subject: `⚖️ Privacy Request: ${requestLabel} — ${firstName} ${lastName}`,
        html: adminHtml,
      }),
      sendEmail({
        to: email,
        subject: `Your Privacy Request — ${COMPANY_NAME}`,
        html: confirmationHtml,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Do-not-sell request error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

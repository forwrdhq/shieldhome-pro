import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/sendgrid'

const META_PHONE = process.env.NEXT_PUBLIC_META_PHONE || '(801) 348-6050'

const patchSchema = z.object({
  email: z.string().email().optional(),
  zipCode: z.string().regex(/^\d{5}$/).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = patchSchema.parse(body)

    if (!data.email && !data.zipCode) {
      return NextResponse.json({ error: 'No data to update' }, { status: 400 })
    }

    const lead = await prisma.metaQuizLead.update({
      where: { id },
      data: {
        ...(data.email && { email: data.email }),
        ...(data.zipCode && { zipCode: data.zipCode }),
      },
    })

    // Send welcome email if email was provided
    if (data.email) {
      try {
        await sendMetaEnrichmentEmail(lead)
      } catch (err) {
        console.error('Failed to send enrichment email:', err)
      }
    }

    return NextResponse.json({ success: true, leadId: lead.id })
  } catch (err: unknown) {
    console.error('Meta lead PATCH error:', err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

interface MetaLeadForEmail {
  id: string
  firstName: string
  email: string | null
  securityScore: number
  riskLevel: string
  recommendedPackage: string
}

async function sendMetaEnrichmentEmail(lead: MetaLeadForEmail) {
  if (!lead.email) return

  const riskColor = lead.riskLevel === 'high' ? '#EF4444' : lead.riskLevel === 'medium' ? '#F59E0B' : '#10B981'
  const subject = `Your Home Security Score: ${lead.securityScore}/100 \u2014 Here's Your Plan`

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1E293B; font-size: 24px; margin: 0;">Your Home Security Score</h1>
      </div>

      <div style="text-align: center; padding: 24px; background: #F8FAFC; border-radius: 12px; margin-bottom: 24px;">
        <div style="font-size: 48px; font-weight: bold; color: ${riskColor};">${lead.securityScore}/100</div>
        <div style="font-size: 14px; color: #64748B; margin-top: 4px;">Risk Level: <strong style="color: ${riskColor};">${lead.riskLevel.toUpperCase()}</strong></div>
      </div>

      <p style="color: #334155; font-size: 16px; line-height: 1.6;">
        Hi ${lead.firstName},
      </p>
      <p style="color: #334155; font-size: 16px; line-height: 1.6;">
        Based on your Home Security Assessment, your home has some vulnerabilities that should be addressed.
        We've put together a personalized protection plan based on your answers.
      </p>

      <div style="background: #ECFDF5; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #065F46; font-size: 18px; margin: 0 0 12px;">Your Recommended Package</h2>
        <p style="color: #047857; font-size: 14px; margin: 0;">
          <strong>The Total Shield Package</strong> \u2014 Complete Vivint Smart Home system with professional
          installation, 24/7 monitoring, and our Welcome Home Reward.
        </p>
        <p style="color: #047857; font-size: 14px; margin: 8px 0 0;">
          <strong>Your cost: $0 down + as low as $39.99/mo</strong>
        </p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="tel:+18013486050" style="display: inline-block; background: #10B981; color: white; font-weight: bold; font-size: 16px; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
          Book My Free Home Assessment
        </a>
        <p style="color: #94A3B8; font-size: 12px; margin-top: 8px;">Free \u2022 No obligation \u2022 Takes 15 minutes</p>
      </div>

      <p style="color: #64748B; font-size: 14px; line-height: 1.6;">
        Or call us directly: <a href="tel:+18013486050" style="color: #10B981; font-weight: bold;">${META_PHONE}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;" />

      <p style="color: #94A3B8; font-size: 12px; text-align: center;">
        ShieldHome Pro \u2014 Authorized Vivint Smart Home Dealer<br/>
        You received this email because you completed a Home Security Assessment at shieldhomepro.com.
      </p>
    </div>
  `

  await sendEmail({ to: lead.email, subject, html })

  await prisma.metaQuizLead.update({
    where: { id: lead.id },
    data: { emailToLeadSent: true },
  })
}

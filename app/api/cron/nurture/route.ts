import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/sendgrid'
import { buildEmailTemplate } from '@/lib/notifications'
import { PHONE_NUMBER, PHONE_NUMBER_RAW, APP_URL, COMPANY_NAME } from '@/lib/constants'

// ---------------------------------------------------------------------------
// Phase 3: Full nurture email sequence
//
// 6 emails over 21 days, each with a distinct strategic purpose:
//
// Email 0 (0h):   Welcome — handled by sendWelcomeEmail() in notifications.ts
// Email 1 (24h):  Social proof — why 2M families chose Vivint
// Email 2 (72h):  Education — "Is home security worth it?" (addresses objections)
// Email 3 (168h): Urgency — exclusive offer reminder
// Email 4 (336h): Re-engagement — personal, asks what's holding them back
// Email 5 (504h): Final close — last chance before closing the file
//
// Schedule is in hours after submission.
// ---------------------------------------------------------------------------

const NURTURE_SCHEDULE_HOURS = [0, 24, 72, 168, 336, 504]

interface NurtureLead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  nurtureStep: number
  submittedAt: Date
  propertyType: string | null
  homeownership: string | null
  timeline: string | null
  productsInterested: string[]
  priority: string
}

function getNurtureEmail(lead: NurtureLead, step: number): { subject: string; html: string } | null {
  const name = lead.firstName
  const isOwner = lead.homeownership === 'OWN'
  const ctaButton = `<div style="text-align: center; margin: 30px 0;"><a href="tel:${PHONE_NUMBER_RAW}" style="background: #00C853; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block;">Call Now: ${PHONE_NUMBER}</a></div>`
  const quizCta = `<div style="text-align: center; margin: 30px 0;"><a href="${APP_URL}/#quiz" style="background: #00C853; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block;">Get My Free Quote →</a></div>`

  switch (step) {
    // -----------------------------------------------------------------------
    // Email 1 (24h): Social Proof — why 2M+ families trust Vivint
    // -----------------------------------------------------------------------
    case 1:
      return {
        subject: `Why 2 million families chose Vivint`,
        html: buildEmailTemplate({
          preheader: 'The #1-rated smart home security system — here\'s why.',
          body: `
            <h2 style="color: #1A1A2E;">Hi ${name}, ever wonder why Vivint is #1?</h2>

            <p style="color: #555;">Yesterday you took the first step toward protecting your home. Today, I wanted to share why over <strong>2 million families</strong> across the US trust Vivint.</p>

            <div style="background: #f8f9fa; padding: 24px; border-radius: 8px; margin: 24px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                    <strong style="color: #1A1A2E;">⭐ 4.8/5 stars</strong><br>
                    <span style="color: #666; font-size: 14px;">From 58,000+ verified customer reviews</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                    <strong style="color: #1A1A2E;">⚡ 30-second response time</strong><br>
                    <span style="color: #666; font-size: 14px;">When an alarm triggers, Vivint's monitoring center responds in under 30 seconds — 2x faster than the industry average</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                    <strong style="color: #1A1A2E;">🏆 #1 rated by U.S. News</strong><br>
                    <span style="color: #666; font-size: 14px;">Named the best home security system by multiple independent reviewers</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <strong style="color: #1A1A2E;">🤖 AI-powered cameras</strong><br>
                    <span style="color: #666; font-size: 14px;">Smart Sentry™ technology can distinguish between people, animals, and vehicles — so you don't get false alerts at 3am</span>
                  </td>
                </tr>
              </table>
            </div>

            <div style="background: #f0fdf4; border-left: 4px solid #00C853; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
              <em style="color: #333;">"Best decision we made for our family. The cameras are crystal clear and the smart home features are amazing."</em>
              <p style="color: #666; font-size: 13px; margin: 8px 0 0;">— Robert T., Dallas, TX (Vivint customer since 2024)</p>
            </div>

            <p style="color: #555;">Your free consultation is still available — zero pressure, zero obligation.</p>

            ${ctaButton}
          `,
        }),
      }

    // -----------------------------------------------------------------------
    // Email 2 (72h): Education — addressing the #1 objection: "Is it worth it?"
    // -----------------------------------------------------------------------
    case 2:
      return {
        subject: `"Is a home security system really worth it?"`,
        html: buildEmailTemplate({
          preheader: 'The data might surprise you.',
          body: `
            <h2 style="color: #1A1A2E;">${name}, let's talk about the elephant in the room</h2>

            <p style="color: #555;">If you're like most people, you've been thinking: <em>"Do I really need a security system? Is it worth the monthly cost?"</em></p>

            <p style="color: #555;">That's a fair question. Here's what the data says:</p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <h3 style="color: #1A1A2E; margin: 0 0 16px;">📊 By the Numbers</h3>

              <div style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <strong style="color: #00C853; font-size: 20px;">300%</strong><br>
                <span style="color: #555;">Homes <em>without</em> security systems are up to 300% more likely to be burglarized (FBI UCR data)</span>
              </div>

              <div style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <strong style="color: #00C853; font-size: 20px;">$2,800</strong><br>
                <span style="color: #555;">Average loss per residential burglary in the US (Bureau of Justice Statistics)</span>
              </div>

              <div style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <strong style="color: #00C853; font-size: 20px;">$1.33/day</strong><br>
                <span style="color: #555;">What Vivint 24/7 professional monitoring costs — less than a cup of coffee</span>
              </div>

              <div style="padding: 12px 0;">
                <strong style="color: #00C853; font-size: 20px;">5-20%</strong><br>
                <span style="color: #555;">Typical homeowner insurance discount for having a monitored security system</span>
              </div>
            </div>

            ${isOwner ? `
            <p style="color: #555;"><strong>Pro tip for homeowners:</strong> Call your insurance provider and ask about their security system discount. Many of our customers find the insurance savings alone cover a significant portion of the monthly monitoring cost.</p>
            ` : ''}

            <p style="color: #555;">Beyond the numbers, there's one thing you can't put a price on: <strong>peace of mind</strong>. Knowing your family is protected whether you're home, at work, or on vacation.</p>

            <p style="color: #555;">Still on the fence? A 5-minute call with a Smart Home Pro costs you nothing and will give you a clear picture of what protection looks like for your specific home.</p>

            ${ctaButton}
          `,
        }),
      }

    // -----------------------------------------------------------------------
    // Email 3 (7 days): Urgency — promotional reminder
    // -----------------------------------------------------------------------
    case 3: {
      const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })
      return {
        subject: `Your exclusive Vivint offer is still available`,
        html: buildEmailTemplate({
          preheader: `${currentMonth} promotions won't last forever, ${name}.`,
          body: `
            <h2 style="color: #1A1A2E;">Hi ${name}, your offer is still on the table</h2>

            <p style="color: #555;">It's been about a week since you requested your free home security quote. I wanted to make sure you know — the current ${currentMonth} promotions are still available to you:</p>

            <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <h3 style="color: #92400e; margin: 0 0 12px;">🎁 What You May Qualify For:</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">
                    ✅ <strong>FREE Doorbell Camera Pro</strong> — $199 value
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">
                    ✅ <strong>FREE Professional Installation</strong> — $199 value
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">
                    ✅ <strong>$0 Down</strong> — no upfront equipment costs
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #78350f;">
                    ✅ <strong>24/7 Professional Monitoring</strong> — from $1.33/day
                  </td>
                </tr>
              </table>
              <p style="color: #92400e; font-size: 13px; margin: 12px 0 0;"><em>That's $398+ in free equipment and installation.</em></p>
            </div>

            <p style="color: #555;">These promotions are available while supplies last. A quick 5-minute call is all it takes to lock in your custom quote.</p>

            ${ctaButton}

            <p style="color: #999; font-size: 13px;">P.S. If you've already gotten protection from another provider, just ignore this email — and congratulations on taking that step! Any home security is better than none.</p>
          `,
        }),
      }
    }

    // -----------------------------------------------------------------------
    // Email 4 (14 days): Re-engagement — personal, conversational, asks what's holding them back
    // -----------------------------------------------------------------------
    case 4:
      return {
        subject: `${name}, still thinking about home security?`,
        html: buildEmailTemplate({
          preheader: 'No pitch — just wanted to check in.',
          body: `
            <h2 style="color: #1A1A2E;">Hey ${name},</h2>

            <p style="color: #555;">I know life gets busy, and home security might not be top of mind right now. That's totally okay.</p>

            <p style="color: #555;">I just wanted to check in because I've found that most people who request a quote fall into one of these categories:</p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 24px 0;">
              <p style="margin: 0 0 12px;"><strong style="color: #1A1A2E;">🤔 "I'm still comparing options"</strong><br>
              <span style="color: #666; font-size: 14px;">Totally fair. Happy to answer any comparison questions — we'll be honest even if Vivint isn't the right fit for you.</span></p>

              <p style="margin: 12px 0;"><strong style="color: #1A1A2E;">💰 "The cost is a concern"</strong><br>
              <span style="color: #666; font-size: 14px;">I get it. Most people are surprised at how affordable it is once they see the actual quote. Plus, the insurance discount often offsets a chunk of the cost.</span></p>

              <p style="margin: 12px 0;"><strong style="color: #1A1A2E;">📅 "The timing isn't right"</strong><br>
              <span style="color: #666; font-size: 14px;">No problem at all. Your quote stays open — reach out whenever you're ready.</span></p>

              <p style="margin: 12px 0 0;"><strong style="color: #1A1A2E;">🏠 "I went with someone else"</strong><br>
              <span style="color: #666; font-size: 14px;">Great! Any security is better than no security. Glad you're protected.</span></p>
            </div>

            <p style="color: #555;">If you have a quick question — about pricing, equipment, contracts, installation, anything — just reply to this email or call me directly. No sales pitch, I promise.</p>

            ${ctaButton}

            <p style="color: #555;">— The ${COMPANY_NAME} Team</p>
          `,
        }),
      }

    // -----------------------------------------------------------------------
    // Email 5 (21 days): Final close — closing the file, creates urgency through scarcity
    // -----------------------------------------------------------------------
    case 5:
      return {
        subject: `Closing your quote file, ${name}`,
        html: buildEmailTemplate({
          preheader: 'Last email from us — unless you say otherwise.',
          body: `
            <h2 style="color: #1A1A2E;">Hi ${name},</h2>

            <p style="color: #555;">This will be my last email about your home security quote.</p>

            <p style="color: #555;">I'm closing out your file in our system, which means the specific promotions we quoted you (free doorbell camera, free installation) will no longer be reserved.</p>

            <p style="color: #555;">If you'd still like your free consultation, just:</p>

            <div style="background: #f0fdf4; border-left: 4px solid #00C853; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0;">
              <p style="margin: 0;"><strong>📞 Call us:</strong> <a href="tel:${PHONE_NUMBER_RAW}" style="color: #00C853;">${PHONE_NUMBER}</a></p>
              <p style="margin: 8px 0 0;"><strong>💬 Reply</strong> to this email with "still interested"</p>
              <p style="margin: 8px 0 0;"><strong>🖱️ Click below</strong> to reopen your quote</p>
            </div>

            ${quizCta}

            <p style="color: #555;">Either way — thanks for considering ${COMPANY_NAME}. We're here if you ever need us.</p>

            <p style="color: #555;">Stay safe,<br><strong>The ${COMPANY_NAME} Team</strong></p>

            <p style="color: #999; font-size: 12px; margin-top: 20px;"><em>P.S. You won't receive any more emails from us after this unless you reach out. We respect your inbox.</em></p>
          `,
        }),
      }

    default:
      return null
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const leads = await prisma.lead.findMany({
      where: {
        nurtureActive: true,
        nurtureStep: { lt: 6 },
        status: { notIn: ['CLOSED_WON', 'CLOSED_LOST', 'NOT_QUALIFIED', 'CANCELLED'] },
      },
    })

    let sent = 0
    const errors: string[] = []

    for (const lead of leads) {
      try {
        const nextStep = lead.nurtureStep
        const hoursRequired = NURTURE_SCHEDULE_HOURS[nextStep]
        if (hoursRequired === undefined) continue

        const hoursSinceSubmit = (Date.now() - lead.submittedAt.getTime()) / 3600000
        if (hoursSinceSubmit < hoursRequired) continue

        // Step 0 is the welcome email — handled by notifications.ts at submit time
        // If nurtureStep is 0, just advance to 1
        if (nextStep === 0) {
          await prisma.lead.update({
            where: { id: lead.id },
            data: { nurtureStep: 1 },
          })
          continue
        }

        const emailData = getNurtureEmail(lead as NurtureLead, nextStep)
        if (!emailData) continue

        const msgId = await sendEmail({
          to: lead.email,
          subject: emailData.subject,
          html: emailData.html,
        })

        if (msgId) {
          await Promise.all([
            prisma.emailLog.create({
              data: {
                leadId: lead.id,
                type: `nurture-${nextStep}`,
                subject: emailData.subject,
                sendgridId: msgId,
                status: 'sent',
              },
            }),
            prisma.lead.update({
              where: { id: lead.id },
              data: {
                nurtureStep: nextStep + 1,
                emailsSent: { increment: 1 },
                // Deactivate nurture after the final email
                ...(nextStep === 5 ? { nurtureActive: false } : {}),
              },
            }),
            prisma.activity.create({
              data: {
                leadId: lead.id,
                type: 'NURTURE_EMAIL',
                description: `Nurture email ${nextStep} sent: "${emailData.subject}"`,
              },
            }),
          ])
          sent++
        }
      } catch (err) {
        errors.push(`Lead ${lead.id}: ${err}`)
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      eligible: leads.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    console.error('Nurture cron error:', err)
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}

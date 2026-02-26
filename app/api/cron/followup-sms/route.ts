import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendSms, formatPhone } from '@/lib/twilio'
import { PHONE_NUMBER, COMPANY_NAME } from '@/lib/constants'

// ---------------------------------------------------------------------------
// Phase 2: Intelligent SMS follow-up drip
//
// Schedule (hours after submission):
//   SMS 1: 0h    — instant confirmation (sent by notifications.ts on form submit)
//   SMS 2: 1h    — soft follow-up if no contact yet
//   SMS 3: 4h    — value-based nudge
//   SMS 4: 24h   — next day AM follow-up with different angle
//   SMS 5: 48h   — social proof nudge
//   SMS 6: 72h   — last-chance soft close
//
// This cron runs every 30 minutes. It checks which SMS is due for each lead
// based on hours elapsed since submission.
// ---------------------------------------------------------------------------

const SMS_SCHEDULE_HOURS = [0, 1, 4, 24, 48, 72]

// Priority multiplier — HOT leads get SMS sooner (0.5x), LOW leads get them later (1.5x)
function getTimingMultiplier(priority: string): number {
  switch (priority) {
    case 'HOT': return 0.5
    case 'HIGH': return 0.75
    case 'MEDIUM': return 1.0
    case 'LOW': return 1.5
    default: return 1.0
  }
}

interface LeadForSms {
  id: string
  firstName: string
  phone: string
  smsSent: number
  priority: string
  propertyType: string | null
  homeownership: string | null
  timeline: string | null
  productsInterested: string[]
  submittedAt: Date
}

/**
 * Generate the right message for this lead at this step.
 * Messages adapt to what we know about the lead from the quiz.
 */
function getMessage(lead: LeadForSms, step: number): string {
  const name = lead.firstName
  const isOwner = lead.homeownership === 'OWN'
  const wantsCameras = lead.productsInterested.some(p => p.toLowerCase().includes('camera'))
  const wantsSecurity = lead.productsInterested.some(p => p.toLowerCase().includes('security'))
  const isUrgent = lead.timeline === 'ASAP' || lead.timeline === 'ONE_TWO_WEEKS'

  switch (step) {
    // Step 1 (smsSent=1): Soft follow-up — "just tried calling"
    case 1:
      return [
        `Hi ${name}, just tried reaching you about your free home security quote.`,
        ``,
        `I have your custom recommendation ready — happy to chat whenever works for you.`,
        ``,
        `Call or text me back: ${PHONE_NUMBER}`,
        ``,
        `— Your ${COMPANY_NAME} Advisor`,
      ].join('\n')

    // Step 2 (smsSent=2): Value nudge — personalized to what they want
    case 2:
      if (wantsCameras) {
        return [
          `${name}, quick update on your security quote:`,
          ``,
          `Vivint's outdoor cameras have AI-powered person detection — they can tell the difference between a person, animal, and car. The doorbell camera you'd get FREE has a 180° field of view.`,
          ``,
          `Ready to learn more? Call: ${PHONE_NUMBER}`,
          `Reply STOP to opt out.`,
        ].join('\n')
      }
      if (wantsSecurity && isOwner) {
        return [
          `${name}, quick update on your security quote:`,
          ``,
          `Homeowners like you typically qualify for $0 down with free professional installation. Your system would be custom-designed for your home's entry points and layout.`,
          ``,
          `Want to see your options? Call: ${PHONE_NUMBER}`,
          `Reply STOP to opt out.`,
        ].join('\n')
      }
      return [
        `${name}, your free Vivint security quote is ready!`,
        ``,
        `Current promotion: FREE doorbell camera + FREE professional installation — most homeowners get fully protected within 48 hours.`,
        ``,
        `Questions? Call: ${PHONE_NUMBER}`,
        `Reply STOP to opt out.`,
      ].join('\n')

    // Step 3 (smsSent=3): Next-day follow-up — different angle, ask about timing
    case 3:
      if (isUrgent) {
        return [
          `Good morning ${name}! Following up on your security quote from yesterday.`,
          ``,
          `Since you mentioned wanting protection soon, I can get a Vivint technician to your home as early as this week.`,
          ``,
          `What day works best? Just reply with a day or call: ${PHONE_NUMBER}`,
        ].join('\n')
      }
      return [
        `Good morning ${name}! Following up on your security quote request.`,
        ``,
        `I know timing is everything — would you prefer a quick 5-min call, or would you rather I text you the details?`,
        ``,
        `Just reply CALL or TEXT, or reach me at: ${PHONE_NUMBER}`,
      ].join('\n')

    // Step 4 (smsSent=4): Social proof
    case 4:
      return [
        `${name}, did you know? The average Vivint customer sees a response from monitoring within 30 seconds of an alarm trigger. That's 2x faster than the industry average.`,
        ``,
        `Over 2 million families trust Vivint to protect their homes.`,
        ``,
        `Your free quote is still available: ${PHONE_NUMBER}`,
        `Reply STOP to opt out.`,
      ].join('\n')

    // Step 5 (smsSent=5): Soft close — last SMS
    case 5:
      return [
        `Hi ${name}, this is my last text about your home security quote. No worries if the timing isn't right.`,
        ``,
        `Your free consultation offer stays open — whenever you're ready, just call or text: ${PHONE_NUMBER}`,
        ``,
        `Wishing you and your family a safe week!`,
        `— ${COMPANY_NAME}`,
        `Reply STOP to opt out.`,
      ].join('\n')

    default:
      return ''
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find leads eligible for follow-up:
    // - status is NEW or CONTACTED (rep tried but didn't close)
    // - fewer than 6 SMS sent
    // - submitted more than 30 minutes ago (give instant notification time to fire)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)

    const leads = await prisma.lead.findMany({
      where: {
        status: { in: ['NEW', 'CONTACTED', 'NO_ANSWER'] },
        smsSent: { lt: 6 },
        submittedAt: { lt: thirtyMinutesAgo },
      },
    })

    let sent = 0
    const errors: string[] = []

    for (const lead of leads) {
      try {
        // Determine which SMS step is next
        const nextStep = lead.smsSent // smsSent=1 means confirmation was sent, so next is step 1
        if (nextStep < 1 || nextStep >= SMS_SCHEDULE_HOURS.length) continue

        // Calculate when this SMS is due
        const multiplier = getTimingMultiplier(lead.priority)
        const hoursRequired = SMS_SCHEDULE_HOURS[nextStep] * multiplier
        const hoursSinceSubmit = (Date.now() - lead.submittedAt.getTime()) / 3600000

        if (hoursSinceSubmit < hoursRequired) continue

        // Check time of day — don't send SMS between 9pm and 8am
        const currentHour = new Date().getHours()
        if (currentHour >= 21 || currentHour < 8) continue

        const body = getMessage(lead as LeadForSms, nextStep)
        if (!body) continue

        const sid = await sendSms(formatPhone(lead.phone), body)

        if (sid) {
          await Promise.all([
            prisma.smsLog.create({
              data: {
                leadId: lead.id,
                type: `followup-${nextStep}`,
                body,
                twilioSid: sid,
                status: 'sent',
              },
            }),
            prisma.lead.update({
              where: { id: lead.id },
              data: { smsSent: { increment: 1 }, lastContactDate: new Date() },
            }),
            prisma.activity.create({
              data: {
                leadId: lead.id,
                type: 'SMS_SENT',
                description: `Follow-up SMS ${nextStep} sent (${lead.priority} priority, ${Math.round(hoursSinceSubmit)}h post-submit)`,
              },
            }),
          ])
          sent++
        }
      } catch (err) {
        errors.push(`Lead ${lead.id}: ${err}`)
      }
    }

    // Also notify rep about leads that have received 3+ SMS with no response
    const staleSmsLeads = leads.filter(l => l.smsSent === 3 && l.status === 'NEW')
    if (staleSmsLeads.length > 0) {
      const repPhones = [process.env.REP_PHONE_NUMBER, process.env.REP_PHONE_NUMBER_2].filter(Boolean) as string[]
      if (repPhones.length > 0) {
        const names = staleSmsLeads.map(l => `${l.firstName} ${l.lastName} (${l.phone})`).join('\n')
        const body = [
          `📋 FOLLOW-UP REMINDER`,
          ``,
          `${staleSmsLeads.length} lead(s) have received 3 texts with no response:`,
          ``,
          names,
          ``,
          `A personal call may help. Speed to contact matters!`,
        ].join('\n')
        await Promise.allSettled(repPhones.map(p => sendSms(formatPhone(p), body)))
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      eligible: leads.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    console.error('Follow-up SMS cron error:', err)
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}

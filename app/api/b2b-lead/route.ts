import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const b2bLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().max(50).optional().default(''),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required').max(20),
  businessName: z.string().min(1, 'Business name is required').max(100),
  businessType: z.string().min(1).max(50),
  numberOfLocations: z.string().optional().default('1'),
  biggestConcern: z.string().optional().default(''),
  source: z.string().optional().default('b2b-website'),
})

export type B2BLeadData = z.infer<typeof b2bLeadSchema>

/**
 * POST /api/b2b-lead
 *
 * Receives B2B commercial security leads from the website form.
 * Fires to both GHL (primary) and Make.com (backup + Slack) concurrently.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = b2bLeadSchema.parse(body)

    const payload = {
      ...data,
      submittedAt: new Date().toISOString(),
    }

    // Fire to GHL and Make.com concurrently — neither blocks the other
    const results = await Promise.allSettled([
      postToGhl(payload),
      postToMake(payload),
    ])

    // Log any failures but don't expose them to the user
    results.forEach((result, i) => {
      const target = i === 0 ? 'GHL' : 'Make.com'
      if (result.status === 'rejected') {
        console.error(`[B2B Lead] Failed to POST to ${target}:`, result.reason)
      } else {
        console.log(`[B2B Lead] Successfully posted to ${target}`)
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Your request has been received. A commercial security specialist will contact you shortly.',
    })
  } catch (err: any) {
    console.error('[B2B Lead] Error:', err)
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid form data', details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function postToGhl(payload: B2BLeadData & { submittedAt: string }) {
  const ghlUrl = process.env.GHL_B2B_WEBHOOK_URL
  if (!ghlUrl) {
    console.warn('[B2B Lead] GHL_B2B_WEBHOOK_URL not configured — skipping')
    return
  }

  const res = await fetch(ghlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      companyName: payload.businessName,
      businessType: payload.businessType,
      numberOfLocations: payload.numberOfLocations,
      biggestConcern: payload.biggestConcern,
      leadSource: 'B2B Website',
      tags: ['b2b-website-lead', `b2b-type-${payload.businessType.toLowerCase()}`],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GHL responded ${res.status}: ${text}`)
  }
}

async function postToMake(payload: B2BLeadData & { submittedAt: string }) {
  const makeUrl = process.env.MAKE_B2B_WEBHOOK_URL
  if (!makeUrl) {
    console.warn('[B2B Lead] MAKE_B2B_WEBHOOK_URL not configured — skipping')
    return
  }

  const res = await fetch(makeUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Make.com responded ${res.status}: ${text}`)
  }
}

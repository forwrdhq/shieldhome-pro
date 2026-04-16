import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

const META_PIXEL_ID = process.env.META_PIXEL_ID || '726366293775744'
const META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN

interface CAPIEventData {
  eventName: string
  eventId: string
  eventTime?: number
  sourceUrl: string
  userData: {
    email?: string
    phone?: string
    firstName?: string
    zipCode?: string
    fbp?: string
    fbc?: string
    clientIpAddress?: string
    clientUserAgent?: string
  }
  customData?: Record<string, unknown>
}

function sha256Hash(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

export async function POST(req: NextRequest) {
  if (!META_CAPI_ACCESS_TOKEN) {
    console.warn('META_CAPI_ACCESS_TOKEN not set — skipping CAPI event')
    return NextResponse.json({ success: false, reason: 'CAPI not configured' })
  }

  try {
    const body: CAPIEventData = await req.json()

    // Extract real client IP from request headers (server-side only)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || body.userData.clientIpAddress

    const userData: Record<string, string> = {}

    // Hash PII fields per Meta's requirements
    if (body.userData.email) {
      userData.em = sha256Hash(body.userData.email)
    }
    if (body.userData.phone) {
      // Strip non-digits, ensure country code
      const digits = body.userData.phone.replace(/\D/g, '')
      const withCountry = digits.length === 10 ? `1${digits}` : digits
      userData.ph = sha256Hash(withCountry)
    }
    if (body.userData.firstName) {
      userData.fn = sha256Hash(body.userData.firstName)
    }
    if (body.userData.zipCode) {
      userData.zp = sha256Hash(body.userData.zipCode)
    }

    // Non-hashed fields
    if (body.userData.fbp) userData.fbp = body.userData.fbp
    if (body.userData.fbc) userData.fbc = body.userData.fbc
    if (clientIp) userData.client_ip_address = clientIp
    if (body.userData.clientUserAgent) userData.client_user_agent = body.userData.clientUserAgent

    const event = {
      event_name: body.eventName,
      event_time: body.eventTime || Math.floor(Date.now() / 1000),
      event_id: body.eventId,
      event_source_url: body.sourceUrl,
      action_source: 'website',
      user_data: userData,
      custom_data: body.customData || {},
    }

    const url = `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [event],
        access_token: META_CAPI_ACCESS_TOKEN,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Meta CAPI error:', result)
      return NextResponse.json({ success: false, error: result }, { status: response.status })
    }

    return NextResponse.json({ success: true, result })
  } catch (err) {
    console.error('Meta CAPI route error:', err)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}

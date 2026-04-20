// GoHighLevel (LeadConnector) v2 API client.
// Additive-only: this module is consumed by sendGoHighLevelContact in
// notifications.ts. It does NOT replace Callingly, Twilio, Slack, or the
// internal Postgres lead store — it mirrors new leads into GHL so the GHL
// pipeline / workflows / dialer can act on them in parallel.

const GHL_BASE_URL = 'https://services.leadconnectorhq.com'
const GHL_API_VERSION = '2021-07-28'

export interface GhlUpsertContactInput {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phone: string
  postalCode?: string | null
  source?: string | null
  tags?: string[]
  customFields?: Array<{ key?: string; id?: string; field_value: string | number | boolean | null }>
}

export interface GhlUpsertResult {
  ok: boolean
  status: number
  contactId?: string
  error?: string
}

function getCreds(): { apiKey: string; locationId: string } | null {
  const apiKey = process.env.GHL_API_KEY?.trim()
  const locationId = process.env.GHL_LOCATION_ID?.trim()
  if (!apiKey || !locationId) return null
  return { apiKey, locationId }
}

export function isGhlConfigured(): boolean {
  return getCreds() !== null
}

export async function ghlUpsertContact(input: GhlUpsertContactInput): Promise<GhlUpsertResult> {
  const creds = getCreds()
  if (!creds) {
    return { ok: false, status: 0, error: 'GHL not configured (GHL_API_KEY or GHL_LOCATION_ID missing)' }
  }

  const body: Record<string, unknown> = {
    locationId: creds.locationId,
    phone: input.phone,
  }
  if (input.firstName) body.firstName = input.firstName
  if (input.lastName) body.lastName = input.lastName
  if (input.email) body.email = input.email
  if (input.postalCode) body.postalCode = input.postalCode
  if (input.source) body.source = input.source
  if (input.tags?.length) body.tags = input.tags
  if (input.customFields?.length) body.customFields = input.customFields

  try {
    const res = await fetch(`${GHL_BASE_URL}/contacts/upsert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${creds.apiKey}`,
        'Version': GHL_API_VERSION,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const text = await res.text()
    let json: any = null
    try { json = text ? JSON.parse(text) : null } catch { /* keep raw text */ }

    if (!res.ok) {
      return { ok: false, status: res.status, error: text || `HTTP ${res.status}` }
    }

    const contactId = json?.contact?.id || json?.id
    return { ok: true, status: res.status, contactId }
  } catch (err: any) {
    return { ok: false, status: 0, error: err?.message || String(err) }
  }
}

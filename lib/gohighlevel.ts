/**
 * GoHighLevel (GHL) API Client
 * Handles contact creation, opportunity management, and two-way sync.
 *
 * Required env vars:
 *   GHL_API_KEY        – Location-level API key (v1) or Private Integration token
 *   GHL_LOCATION_ID    – GHL Location (sub-account) ID
 *   GHL_PIPELINE_ID    – Pipeline ID for the sales pipeline
 *   GHL_WEBHOOK_SECRET  – Shared secret for verifying inbound webhooks
 */

const GHL_BASE = 'https://services.leadconnectorhq.com'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ghlHeaders(): Record<string, string> {
  const apiKey = process.env.GHL_API_KEY
  if (!apiKey) throw new Error('GHL_API_KEY is not configured')
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  }
}

async function ghlFetch<T = any>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const url = `${GHL_BASE}${path}`
  const res = await fetch(url, {
    ...opts,
    headers: { ...ghlHeaders(), ...(opts.headers as Record<string, string> || {}) },
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`[GHL] ${opts.method || 'GET'} ${path} → ${res.status}: ${text}`)
    throw new Error(`GHL API error ${res.status}: ${text}`)
  }

  return res.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GhlContact {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  tags?: string[]
  customFields?: { id: string; value: string }[]
  [key: string]: any
}

export interface GhlOpportunity {
  id: string
  name: string
  pipelineId: string
  pipelineStageId: string
  status: string
  contactId: string
  monetaryValue?: number
  [key: string]: any
}

// ---------------------------------------------------------------------------
// Stage mapping: ShieldHome status → GHL pipeline stage name
// ---------------------------------------------------------------------------

export const STATUS_TO_GHL_STAGE: Record<string, string> = {
  NEW: 'New Lead',
  CONTACTED: 'Contacted',
  APPOINTMENT_SET: 'Appointment Set',
  APPOINTMENT_SAT: 'Appointment Sat',
  QUOTED: 'Quoted',
  CLOSED_WON: 'Won',
  CLOSED_LOST: 'Lost',
  NO_ANSWER: 'No Answer',
  NOT_QUALIFIED: 'Not Qualified',
  CANCELLED: 'Lost',
}

// Reverse: GHL stage name → ShieldHome status
export const GHL_STAGE_TO_STATUS: Record<string, string> = Object.fromEntries(
  Object.entries(STATUS_TO_GHL_STAGE).map(([k, v]) => [v, k])
)

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export async function createOrUpdateContact(lead: {
  firstName: string
  lastName: string
  email: string
  phone: string
  zipCode?: string | null
  source?: string | null
  tags?: string[]
}): Promise<GhlContact> {
  const locationId = process.env.GHL_LOCATION_ID
  if (!locationId) throw new Error('GHL_LOCATION_ID is not configured')

  const payload: any = {
    locationId,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    source: lead.source || 'ShieldHome Pro',
    tags: ['shieldhome-pro', ...(lead.tags || [])],
  }

  if (lead.zipCode) {
    payload.postalCode = lead.zipCode
  }

  // Upsert: GHL de-dupes by email/phone within a location
  const data = await ghlFetch<{ contact: GhlContact }>(
    '/contacts/upsert',
    { method: 'POST', body: JSON.stringify(payload) }
  )

  return data.contact
}

export async function getContact(contactId: string): Promise<GhlContact> {
  const data = await ghlFetch<{ contact: GhlContact }>(`/contacts/${contactId}`)
  return data.contact
}

export async function addContactTags(
  contactId: string,
  tags: string[]
): Promise<void> {
  await ghlFetch(`/contacts/${contactId}/tags`, {
    method: 'POST',
    body: JSON.stringify({ tags }),
  })
}

// ---------------------------------------------------------------------------
// Opportunities (Pipeline)
// ---------------------------------------------------------------------------

export async function createOpportunity(opts: {
  contactId: string
  name: string
  status: string
  pipelineStageId: string
  monetaryValue?: number
}): Promise<GhlOpportunity> {
  const pipelineId = process.env.GHL_PIPELINE_ID
  if (!pipelineId) throw new Error('GHL_PIPELINE_ID is not configured')

  const payload = {
    pipelineId,
    pipelineStageId: opts.pipelineStageId,
    contactId: opts.contactId,
    name: opts.name,
    status: opts.status === 'CLOSED_WON' ? 'won' : opts.status === 'CLOSED_LOST' ? 'lost' : 'open',
    monetaryValue: opts.monetaryValue || 0,
  }

  const data = await ghlFetch<{ opportunity: GhlOpportunity }>(
    '/opportunities/',
    { method: 'POST', body: JSON.stringify(payload) }
  )
  return data.opportunity
}

export async function updateOpportunityStage(
  opportunityId: string,
  pipelineStageId: string,
  status?: 'open' | 'won' | 'lost' | 'abandoned'
): Promise<void> {
  const pipelineId = process.env.GHL_PIPELINE_ID
  const payload: any = { pipelineId, pipelineStageId }
  if (status) payload.status = status
  await ghlFetch(`/opportunities/${opportunityId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

// ---------------------------------------------------------------------------
// Pipeline stages (cached per request lifetime)
// ---------------------------------------------------------------------------

let _stagesCache: { id: string; name: string }[] | null = null

export async function getPipelineStages(): Promise<{ id: string; name: string }[]> {
  if (_stagesCache) return _stagesCache

  const pipelineId = process.env.GHL_PIPELINE_ID
  if (!pipelineId) throw new Error('GHL_PIPELINE_ID is not configured')

  const data = await ghlFetch<{ pipeline: { stages: { id: string; name: string }[] } }>(
    `/opportunities/pipelines/${pipelineId}`
  )
  _stagesCache = data.pipeline.stages
  return _stagesCache
}

export async function getStageIdByName(stageName: string): Promise<string | null> {
  const stages = await getPipelineStages()
  const stage = stages.find(
    s => s.name.toLowerCase() === stageName.toLowerCase()
  )
  return stage?.id || null
}

// ---------------------------------------------------------------------------
// Webhook verification
// ---------------------------------------------------------------------------

export function verifyWebhookSignature(
  body: string,
  signature: string | null
): boolean {
  const secret = process.env.GHL_WEBHOOK_SECRET
  if (!secret) {
    console.warn('[GHL] GHL_WEBHOOK_SECRET not set — skipping verification')
    return true
  }
  // GHL doesn't sign webhooks with HMAC by default;
  // we use a shared secret query param (?secret=xxx) instead
  return signature === secret
}

// ---------------------------------------------------------------------------
// Full sync helper: push a ShieldHome lead → GHL contact + opportunity
// ---------------------------------------------------------------------------

export async function syncLeadToGhl(lead: {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  zipCode?: string | null
  status: string
  leadScore: number
  priority: string
  source?: string | null
  propertyType?: string | null
  homeownership?: string | null
  timeline?: string | null
  productsInterested: string[]
  saleAmount?: number | null
}): Promise<{ contactId: string; opportunityId: string } | null> {
  // Skip if GHL is not configured
  if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
    return null
  }

  try {
    // 1. Upsert contact
    const tags = [
      `priority-${lead.priority.toLowerCase()}`,
      `score-${lead.leadScore}`,
      lead.propertyType ? `property-${lead.propertyType.toLowerCase()}` : '',
      lead.homeownership ? `${lead.homeownership.toLowerCase()}` : '',
      lead.timeline ? `timeline-${lead.timeline.toLowerCase()}` : '',
      ...lead.productsInterested.map(p => `interest-${p.toLowerCase()}`),
    ].filter(Boolean)

    const contact = await createOrUpdateContact({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      zipCode: lead.zipCode,
      source: lead.source,
      tags,
    })

    // 2. Create opportunity in pipeline
    const ghlStageName = STATUS_TO_GHL_STAGE[lead.status] || 'New Lead'
    const stageId = await getStageIdByName(ghlStageName)
    if (!stageId) {
      console.error(`[GHL] Stage "${ghlStageName}" not found in pipeline`)
      return null
    }

    const opportunity = await createOpportunity({
      contactId: contact.id,
      name: `${lead.fullName} — Vivint Quote`,
      status: lead.status,
      pipelineStageId: stageId,
      monetaryValue: lead.saleAmount || 0,
    })

    console.log(`[GHL] Synced lead ${lead.id} → contact ${contact.id}, opp ${opportunity.id}`)
    return { contactId: contact.id, opportunityId: opportunity.id }
  } catch (err) {
    console.error('[GHL] syncLeadToGhl failed:', err)
    return null
  }
}

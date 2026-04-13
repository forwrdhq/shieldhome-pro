/**
 * Instantly.ai API v2 Client
 * Handles campaigns, leads, webhooks, and SuperSearch for cold outreach.
 */

const BASE_URL = 'https://api.instantly.ai/api/v2'

function getHeaders(): Record<string, string> {
  const apiKey = process.env.INSTANTLY_API_KEY?.trim()
  if (!apiKey) throw new Error('INSTANTLY_API_KEY environment variable is not set')
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: getHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Instantly API ${method} ${path} failed (${res.status}): ${text}`)
  }

  if (res.status === 204) return {} as T
  return res.json()
}

// ============================================
// CAMPAIGNS
// ============================================

export interface InstantlyCampaign {
  id: string
  name: string
  status?: string
  [key: string]: unknown
}

/**
 * Get the configured sending email accounts from INSTANTLY_SENDING_EMAILS env var.
 * Returns an array of email addresses (e.g. ["gunnar@shieldhome.pro", "hello@shieldhome.pro"]).
 */
export function getSendingAccounts(): string[] {
  const raw = process.env.INSTANTLY_SENDING_EMAILS?.trim()
  if (!raw) return []
  return raw.split(',').map((e) => e.trim()).filter(Boolean)
}

export async function createCampaign(data: {
  name: string
  email_list?: string[]
  [key: string]: unknown
}): Promise<InstantlyCampaign> {
  // Auto-inject sending accounts if not explicitly provided
  const payload = {
    ...data,
    email_list: data.email_list ?? getSendingAccounts(),
  }
  return request<InstantlyCampaign>('POST', '/campaigns', payload)
}

export async function getCampaign(id: string): Promise<InstantlyCampaign> {
  return request<InstantlyCampaign>('GET', `/campaigns/${id}`)
}

export async function listCampaigns(): Promise<InstantlyCampaign[]> {
  return request<InstantlyCampaign[]>('GET', '/campaigns')
}

export async function activateCampaign(id: string): Promise<void> {
  await request('POST', `/campaigns/${id}/activate`)
}

export async function pauseCampaign(id: string): Promise<void> {
  await request('POST', `/campaigns/${id}/pause`)
}

export async function deleteCampaign(id: string): Promise<void> {
  await request('DELETE', `/campaigns/${id}`)
}

export async function getCampaignAnalytics(params?: {
  campaign_id?: string
}): Promise<unknown> {
  const query = params?.campaign_id ? `?campaign_id=${params.campaign_id}` : ''
  return request('GET', `/campaigns/analytics${query}`)
}

export async function getCampaignAnalyticsOverview(): Promise<unknown> {
  return request('GET', '/campaigns/analytics/overview')
}

// ============================================
// LEADS
// ============================================

export interface InstantlyLead {
  id?: string
  email: string
  first_name?: string
  last_name?: string
  company_name?: string
  phone?: string
  website?: string
  custom_variables?: Record<string, string>
  [key: string]: unknown
}

export async function addLeads(data: {
  leads: InstantlyLead[]
  campaign_id?: string
  list_id?: string
  skip_if_in_workspace?: boolean
}): Promise<unknown> {
  return request('POST', '/leads/add', {
    ...data,
    skip_if_in_workspace: data.skip_if_in_workspace ?? true,
  })
}

export async function createLead(lead: InstantlyLead): Promise<unknown> {
  return request('POST', '/leads', lead)
}

export async function updateLead(
  id: string,
  data: Partial<InstantlyLead>
): Promise<unknown> {
  return request('PATCH', `/leads/${id}`, data)
}

export async function listLeads(filters?: {
  campaign_id?: string
  list_id?: string
  limit?: number
  starting_after?: string
}): Promise<{ items: InstantlyLead[] }> {
  const params = new URLSearchParams()
  if (filters?.campaign_id) params.set('campaign_id', filters.campaign_id)
  if (filters?.list_id) params.set('list_id', filters.list_id)
  if (filters?.limit) params.set('limit', String(filters.limit))
  if (filters?.starting_after) params.set('starting_after', filters.starting_after)
  const query = params.toString() ? `?${params.toString()}` : ''
  return request('GET', `/leads${query}`)
}

export async function updateInterestStatus(data: {
  email: string
  campaign_id: string
  interest_status: 'interested' | 'not_interested' | 'wrong_person' | 'out_of_office'
}): Promise<unknown> {
  return request('POST', '/leads/update-interest-status', data)
}

export async function deleteLeads(filters: {
  campaign_id?: string
  list_id?: string
  email?: string
}): Promise<unknown> {
  return request('DELETE', '/leads', filters)
}

// ============================================
// LEAD LISTS
// ============================================

export interface InstantlyLeadList {
  id: string
  name: string
  [key: string]: unknown
}

export async function createLeadList(name: string): Promise<InstantlyLeadList> {
  return request<InstantlyLeadList>('POST', '/lead-lists', { name })
}

export async function listLeadLists(): Promise<InstantlyLeadList[]> {
  return request<InstantlyLeadList[]>('GET', '/lead-lists')
}

// ============================================
// SUBSEQUENCES (follow-up sequences)
// ============================================

export async function createSubsequence(data: {
  campaign_id: string
  [key: string]: unknown
}): Promise<unknown> {
  return request('POST', '/subsequences', data)
}

export async function moveLeadToSubsequence(data: {
  lead_email: string
  campaign_id: string
  subsequence_id: string
}): Promise<unknown> {
  return request('POST', '/leads/subsequence/move', data)
}

// ============================================
// SUPERSEARCH (B2B Lead Finder)
// ============================================

export async function countSuperSearchLeads(
  filters: Record<string, unknown>
): Promise<{ count: number }> {
  return request<{ count: number }>(
    'POST',
    '/supersearch-enrichment/count-leads-from-supersearch',
    filters
  )
}

export async function previewSuperSearchLeads(
  filters: Record<string, unknown>
): Promise<unknown> {
  return request(
    'POST',
    '/supersearch-enrichment/preview-leads-from-supersearch',
    filters
  )
}

export async function enrichFromSuperSearch(data: {
  filters: Record<string, unknown>
  list_id?: string
  campaign_id?: string
  limit?: number
}): Promise<unknown> {
  return request(
    'POST',
    '/supersearch-enrichment/enrich-leads-from-supersearch',
    data
  )
}

export async function getEnrichmentStatus(resourceId: string): Promise<unknown> {
  return request('GET', `/supersearch-enrichment/${resourceId}`)
}

// ============================================
// WEBHOOKS
// ============================================

export interface InstantlyWebhook {
  id: string
  url: string
  event_types: string[]
  [key: string]: unknown
}

export async function createWebhook(data: {
  url: string
  event_types: string[]
}): Promise<InstantlyWebhook> {
  return request<InstantlyWebhook>('POST', '/webhooks', data)
}

export async function updateWebhook(
  id: string,
  data: Partial<{ url: string; event_types: string[] }>
): Promise<InstantlyWebhook> {
  return request<InstantlyWebhook>('PATCH', `/webhooks/${id}`, data)
}

export async function testWebhook(id: string): Promise<unknown> {
  return request('POST', `/webhooks/${id}/test`)
}

export async function resumeWebhook(id: string): Promise<unknown> {
  return request('POST', `/webhooks/${id}/resume`)
}

export async function getWebhookEventTypes(): Promise<string[]> {
  return request<string[]>('GET', '/webhooks/event-types')
}

// ============================================
// EMAIL VERIFICATION
// ============================================

export async function verifyEmail(email: string): Promise<unknown> {
  return request('POST', '/email-verification', { email })
}

export async function getVerificationResult(
  email: string
): Promise<{ status: string; result?: string }> {
  return request('GET', `/email-verification/${encodeURIComponent(email)}`)
}

// ============================================
// BLOCK LIST (Suppression)
// ============================================

export async function addToBlockList(data: {
  entries: string[] // emails or domains
}): Promise<unknown> {
  return request('POST', '/block-list', data)
}

// ============================================
// ACCOUNTS & WARMUP
// ============================================

export async function getWarmupAnalytics(data: {
  account_ids?: string[]
}): Promise<unknown> {
  return request('POST', '/accounts/warmup-analytics', data)
}

export async function getAccountAnalyticsDaily(params?: {
  start_date?: string
  end_date?: string
}): Promise<unknown> {
  const query = new URLSearchParams()
  if (params?.start_date) query.set('start_date', params.start_date)
  if (params?.end_date) query.set('end_date', params.end_date)
  const qs = query.toString() ? `?${query.toString()}` : ''
  return request('GET', `/accounts/analytics/daily${qs}`)
}

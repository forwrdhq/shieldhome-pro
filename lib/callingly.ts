const BASE_URL = 'https://api.callingly.com/v1'

function authHeaders() {
  const key = process.env.CALLINGLY_API_KEY
  if (!key) throw new Error('CALLINGLY_API_KEY not configured')
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
}

export type CallinglyCall = {
  id: string
  lead_id?: string
  phone?: string
  to?: string
  from?: string
  status?: string
  result?: string
  disposition?: string
  duration?: number
  recording_url?: string
  agent_id?: string
  agent_name?: string
  agent?: { id?: string; name?: string; email?: string }
  started_at?: string
  ended_at?: string
  created_at?: string
  [k: string]: unknown
}

export type CallinglyLead = {
  id: string
  phone?: string
  email?: string
  first_name?: string
  last_name?: string
  status?: string
  agent?: { id?: string; name?: string }
  [k: string]: unknown
}

export async function callinglyFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers || {}) },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Callingly ${path} ${res.status}: ${text.slice(0, 300)}`)
  }
  return res.json() as Promise<T>
}

export async function listCalls(params: { limit?: number; since?: string; page?: number } = {}) {
  const q = new URLSearchParams()
  if (params.limit) q.set('limit', String(params.limit))
  if (params.since) q.set('since', params.since)
  if (params.page) q.set('page', String(params.page))
  const qs = q.toString()
  const data = await callinglyFetch<{ data?: CallinglyCall[] } | CallinglyCall[]>(
    `/calls${qs ? `?${qs}` : ''}`
  )
  return Array.isArray(data) ? data : data.data || []
}

export async function getCall(id: string) {
  return callinglyFetch<CallinglyCall>(`/calls/${id}`)
}

export async function getLead(id: string) {
  return callinglyFetch<CallinglyLead>(`/leads/${id}`)
}

export function normalizePhone(phone?: string | null): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1)
  if (digits.length === 10) return digits
  return digits || null
}

export function pickPhone(c: CallinglyCall): string | null {
  return normalizePhone(c.phone || c.to || c.from || null)
}

export function pickAgent(c: CallinglyCall): { id?: string; name?: string } {
  if (c.agent) return { id: c.agent.id, name: c.agent.name }
  return { id: c.agent_id, name: c.agent_name }
}

export function pickStatus(c: CallinglyCall): string | undefined {
  return c.status || c.result || c.disposition
}

export function isAnswered(status?: string): boolean {
  if (!status) return false
  const s = status.toLowerCase()
  return s.includes('answered') || s.includes('connected') || s.includes('completed') || s.includes('talked')
}

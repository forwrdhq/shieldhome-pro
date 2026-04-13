'use client'

/**
 * Meta Pixel + CAPI deduplication helpers.
 *
 * The Meta Pixel browser event and the Conversions API server event must share
 * the same `event_id` so Meta can deduplicate them and not count the conversion twice.
 *
 * Usage:
 *   const eventId = genEventId()
 *   firePixelEvent('Lead', eventId, { value: 900, currency: 'USD' })
 *   fireCapi('Lead', eventId, { email, phone, firstName, zipCode })
 */

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  return document.cookie.split('; ').find(r => r.startsWith(`${name}=`))?.split('=')[1]
}

/** Generate a unique event ID for pixel ↔ CAPI deduplication. */
export function genEventId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/** Fire a standard Meta Pixel event with a deduplication eventID. */
export function firePixelEvent(
  eventName: string,
  eventId: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return
  const w = window as any
  if (w.fbq) w.fbq('track', eventName, params ?? {}, { eventID: eventId })
}

/** Fire a custom Meta Pixel event with a deduplication eventID. */
export function firePixelCustomEvent(
  eventName: string,
  eventId: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return
  const w = window as any
  if (w.fbq) w.fbq('trackCustom', eventName, params ?? {}, { eventID: eventId })
}

/** Fire a Meta Conversions API event from the client (fire-and-forget). */
export function fireCapi(
  eventName: string,
  eventId: string,
  userData: {
    email?: string
    phone?: string
    firstName?: string
    zipCode?: string
  },
  customData?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return
  fetch('/api/meta-capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName,
      eventId,
      sourceUrl: window.location.href,
      userData: {
        ...userData,
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
        clientUserAgent: navigator.userAgent,
      },
      customData: customData ?? {},
    }),
  }).catch(() => {})
}

'use client'

// fbq type is already declared globally in lib/google-tracking.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

export function fireMetaEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

export function fireMetaCustomEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params)
  }
}

export function fireMetaEventWithId(eventName: string, eventId: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, { ...params, eventID: eventId })
  }
}

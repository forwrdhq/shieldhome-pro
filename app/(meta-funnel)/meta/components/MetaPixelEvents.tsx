'use client'

// fbq type is already declared globally in lib/google-tracking.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

const META_QUIZ_PARAMS = {
  content_category: 'meta_quiz_funnel',
}

export function fireMetaEvent(eventName: string, params?: Record<string, any>, eventId?: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    if (eventId) {
      window.fbq('track', eventName, { ...META_QUIZ_PARAMS, ...params }, { eventID: eventId })
    } else {
      window.fbq('track', eventName, { ...META_QUIZ_PARAMS, ...params })
    }
  }
}

export function fireMetaCustomEvent(eventName: string, params?: Record<string, any>, eventId?: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    if (eventId) {
      window.fbq('trackCustom', eventName, { ...META_QUIZ_PARAMS, ...params }, { eventID: eventId })
    } else {
      window.fbq('trackCustom', eventName, { ...META_QUIZ_PARAMS, ...params })
    }
  }
}

// eventID must be the 4th argument to fbq — not inside the data params
export function fireMetaEventWithId(eventName: string, eventId: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, { ...META_QUIZ_PARAMS, ...params }, { eventID: eventId })
  }
}

'use client'

export interface TrackingData {
  source: string | null
  medium: string | null
  campaign: string | null
  adSet: string | null
  adId: string | null
  keyword: string | null
  utmContent: string | null
  gclid: string | null
  fbclid: string | null
  kwParam: string | null
  oid: string | null // outreach prospect ID for cold email attribution
  landingPage: string
  referrer: string
  deviceType: 'mobile' | 'desktop' | 'tablet'
  browser: string
}

function detectDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile'
  return 'desktop'
}

function detectBrowser(): string {
  if (typeof window === 'undefined') return 'Unknown'
  const ua = navigator.userAgent
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Edg')) return 'Edge'
  return 'Other'
}

export function captureTrackingData(): TrackingData {
  if (typeof window === 'undefined') {
    return {
      source: null, medium: null, campaign: null, adSet: null,
      adId: null, keyword: null, utmContent: null, gclid: null,
      fbclid: null, kwParam: null, oid: null, landingPage: '/', referrer: '', deviceType: 'desktop', browser: 'Unknown'
    }
  }

  const params = new URLSearchParams(window.location.search)

  return {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
    adSet: params.get('utm_adset') || params.get('adset_name'),
    adId: params.get('utm_ad') || params.get('ad_name'),
    keyword: params.get('utm_term'),
    utmContent: params.get('utm_content'),
    gclid: params.get('gclid'),
    fbclid: params.get('fbclid'),
    kwParam: params.get('kw'),
    oid: params.get('oid'),
    landingPage: window.location.pathname,
    referrer: document.referrer,
    deviceType: detectDeviceType(),
    browser: detectBrowser(),
  }
}

export function persistTracking(data: TrackingData) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('tracking', JSON.stringify(data))
  }
}

export function getTracking(): TrackingData {
  if (typeof window === 'undefined') return captureTrackingData()
  const stored = sessionStorage.getItem('tracking')
  return stored ? JSON.parse(stored) : captureTrackingData()
}

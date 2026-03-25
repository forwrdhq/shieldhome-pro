'use client'

declare global {
  interface Window {
    dataLayer?: Record<string, any>[]
    gtag?: (...args: any[]) => void
    fbq?: (...args: any[]) => void
  }
}

export function pushDataLayer(event: string, data?: Record<string, any>) {
  window.dataLayer?.push({ event, ...data })
}

export function fireGoogleConversion(sendTo: string, value: number) {
  window.gtag?.('event', 'conversion', {
    send_to: sendTo,
    value,
    currency: 'USD',
  })
}

export function fireMetaEvent(event: string, data?: Record<string, any>) {
  window.fbq?.('track', event, data)
}

export function pushEnhancedConversions(formData: {
  email?: string
  phone: string
  name: string
  zip: string
}) {
  const nameParts = formData.name.trim().split(/\s+/)
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  window.dataLayer?.push({
    event: 'enhanced_conversion_data',
    enhanced_conversions: {
      email: formData.email || undefined,
      phone_number: formData.phone,
      first_name: firstName,
      last_name: lastName,
      address: {
        postal_code: formData.zip,
        country: 'US',
      },
    },
  })
}

export function trackPhoneClick(location: 'hero' | 'sticky' | 'final_cta' | 'trust_bar' | 'promo_banner') {
  pushDataLayer('phone_click', { location })
  window.fbq?.('track', 'Contact', { content_name: 'phone_call', location })
}

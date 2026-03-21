'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  businessName: z.string().min(1, 'Business name is required'),
  numberOfLocations: z.string().min(1, 'Please select number of locations'),
  businessType: z.string().min(1, 'Please select your business type'),
  biggestConcern: z.string().min(1, 'Please select your biggest concern'),
  tcpaConsent: z.boolean().refine((v) => v === true, 'Consent is required to submit'),
})

type FormValues = z.infer<typeof schema>

export default function LeadCaptureForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  // Page view tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'ViewContent', { content_name: 'B2B Landing Page' })
    }
  }, [])

  async function onSubmit(data: FormValues) {
    setServerError(null)
    try {
      const res = await fetch('/api/b2b-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setServerError(body.error || 'Something went wrong. Please try again.')
        return
      }
      // Fire conversion events
      if (typeof window !== 'undefined') {
        if (typeof (window as any).fbq === 'function') {
          (window as any).fbq('track', 'Lead', { value: 1200, currency: 'USD', content_name: 'B2B Lead' })
        }
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'generate_lead', { value: 1200, currency: 'USD' })
        }
      }
      setSubmitted(true)
    } catch {
      setServerError('Network error. Please try again.')
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 transition-colors ${
      hasError
        ? 'border-red-400 focus:ring-red-300 bg-red-50'
        : 'border-gray-300 focus:ring-[#00C853] focus:border-[#00C853]'
    }`

  if (submitted) {
    return (
      <section id="assessment" className="py-20" style={{ background: '#1A1A2E' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white/10 rounded-2xl p-10 border border-white/20">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-white mb-3">Request Received!</h3>
            <p className="text-gray-300 leading-relaxed">
              A commercial security specialist will contact you within <strong className="text-white">2 hours</strong> to schedule your free assessment.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="assessment" className="py-20" style={{ background: '#1A1A2E' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Get Your Free Commercial Security Assessment
          </h2>
          <p className="text-gray-300">
            No obligation. No pressure. Just an honest assessment of your security and a custom quote — usually within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name *</label>
              <input {...register('firstName')} placeholder="Jane" className={inputClass(!!errors.firstName)} />
              {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Last Name *</label>
              <input {...register('lastName')} placeholder="Smith" className={inputClass(!!errors.lastName)} />
              {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Business Email *</label>
            <input {...register('email')} type="email" placeholder="jane@yourcompany.com" className={inputClass(!!errors.email)} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label>
            <input {...register('phone')} type="tel" placeholder="(555) 555-5555" className={inputClass(!!errors.phone)} />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Company / Business Name *</label>
            <input {...register('businessName')} placeholder="Acme Dental Group" className={inputClass(!!errors.businessName)} />
            {errors.businessName && <p className="text-red-400 text-xs mt-1">{errors.businessName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Number of Locations *</label>
            <select {...register('numberOfLocations')} className={inputClass(!!errors.numberOfLocations)}>
              <option value="">Select…</option>
              <option value="1 Location">1 Location</option>
              <option value="2–5 Locations">2–5 Locations</option>
              <option value="6–10 Locations">6–10 Locations</option>
              <option value="11+ Locations">11+ Locations</option>
            </select>
            {errors.numberOfLocations && <p className="text-red-400 text-xs mt-1">{errors.numberOfLocations.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Business Type *</label>
            <select {...register('businessType')} className={inputClass(!!errors.businessType)}>
              <option value="">Select your industry…</option>
              <option value="Dental/Medical Office">Dental/Medical Office</option>
              <option value="Retail Store">Retail Store</option>
              <option value="Restaurant/Food Service">Restaurant/Food Service</option>
              <option value="Warehouse/Distribution">Warehouse/Distribution</option>
              <option value="Cannabis Dispensary">Cannabis Dispensary</option>
              <option value="Property Management">Property Management</option>
              <option value="Auto Dealership">Auto Dealership</option>
              <option value="Corporate Office">Corporate Office</option>
              <option value="Daycare/Childcare">Daycare/Childcare</option>
              <option value="Gym/Fitness Center">Gym/Fitness Center</option>
              <option value="Other">Other</option>
            </select>
            {errors.businessType && <p className="text-red-400 text-xs mt-1">{errors.businessType.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Biggest Security Concern *</label>
            <select {...register('biggestConcern')} className={inputClass(!!errors.biggestConcern)}>
              <option value="">Select your main concern…</option>
              <option value="Theft & Break-ins">Theft &amp; Break-ins</option>
              <option value="Compliance Requirements (HIPAA, State)">Compliance Requirements (HIPAA, State)</option>
              <option value="Outdated/Failing System">Outdated/Failing System</option>
              <option value="High Monitoring Costs">High Monitoring Costs</option>
              <option value="No System Currently">No System Currently</option>
              <option value="Employee Safety">Employee Safety</option>
              <option value="Other">Other</option>
            </select>
            {errors.biggestConcern && <p className="text-red-400 text-xs mt-1">{errors.biggestConcern.message}</p>}
          </div>

          {/* TCPA Consent */}
          <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
            <input
              {...register('tcpaConsent')}
              type="checkbox"
              id="tcpaConsent"
              className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#00C853]"
            />
            <label htmlFor="tcpaConsent" className="text-xs text-gray-400 leading-relaxed cursor-pointer">
              By submitting this form, I consent to receive calls, texts, and emails from ShieldHome regarding commercial security services. Message &amp; data rates may apply. Reply STOP to opt out at any time.{' '}
              <a href="/privacy" className="text-[#00C853] hover:underline">View our Privacy Policy.</a>
            </label>
          </div>
          {errors.tcpaConsent && <p className="text-red-400 text-xs -mt-2">{errors.tcpaConsent.message}</p>}

          {serverError && (
            <div className="bg-red-900/30 border border-red-500 rounded-xl px-4 py-3 text-red-300 text-sm">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-base transition-opacity disabled:opacity-70"
            style={{ background: '#00C853' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting…
              </>
            ) : (
              'Request My Free Assessment →'
            )}
          </button>

          <p className="text-center text-gray-500 text-xs">
            🔒 Your information is secure and will never be sold.
          </p>
        </form>
      </div>
    </section>
  )
}

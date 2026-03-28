'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { b2bLeadSchema, type B2BLeadFormData } from '@/lib/validation'
import { Lock, CheckCircle } from 'lucide-react'

const locationOptions = ['1 Location', '2–5 Locations', '6–10 Locations', '11+ Locations']

const businessTypeOptions = [
  'Dental/Medical Office',
  'Retail Store',
  'Restaurant/Food Service',
  'Warehouse/Distribution',
  'Cannabis Dispensary',
  'Property Management',
  'Auto Dealership',
  'Corporate Office',
  'Daycare/Childcare',
  'Gym/Fitness Center',
  'Other',
]

const concernOptions = [
  'Theft & Break-ins',
  'Compliance Requirements (HIPAA, State)',
  'Outdated/Failing System',
  'High Monitoring Costs',
  'No System Currently',
  'Employee Safety',
  'Other',
]

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
  }
}

export default function LeadCaptureForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<B2BLeadFormData>({
    resolver: zodResolver(b2bLeadSchema),
  })

  const onSubmit = async (data: B2BLeadFormData) => {
    setServerError('')
    try {
      const res = await fetch('/api/b2b-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Something went wrong')
      }

      // Fire tracking events
      window.fbq?.('track', 'Lead', { value: 1200, currency: 'USD', content_name: 'B2B Lead' })
      window.gtag?.('event', 'generate_lead', { value: 1200, currency: 'USD' })

      setSubmitted(true)
    } catch (err: any) {
      setServerError(err.message || 'Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <section id="lead-form" className="py-16 bg-[#1A1A2E]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white/10 rounded-2xl p-10 border border-white/10">
            <div className="w-16 h-16 bg-[#00C853] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Request Received!</h2>
            <p className="text-gray-300 text-lg">
              A commercial security specialist will contact you within 2 hours to schedule your assessment.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const inputClass = (error?: string) =>
    `w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent ${
      error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
    }`

  const selectClass = (error?: string) =>
    `w-full px-4 py-3 rounded-lg border text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent appearance-none bg-white ${
      error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
    }`

  return (
    <section id="lead-form" className="py-16 bg-[#1A1A2E]">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Get Your Free Commercial Security Assessment
          </h2>
          <p className="text-gray-300">
            No obligation. No pressure. Just an honest assessment of your security and a custom quote — usually within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name row */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">First Name *</label>
              <input {...register('firstName')} id="firstName" placeholder="John" className={inputClass(errors.firstName?.message)} />
              {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">Last Name *</label>
              <input {...register('lastName')} id="lastName" placeholder="Smith" className={inputClass(errors.lastName?.message)} />
              {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Business Email *</label>
              <input {...register('email')} id="email" type="email" placeholder="john@company.com" className={inputClass(errors.email?.message)} />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label>
              <input {...register('phone')} id="phone" type="tel" placeholder="(555) 123-4567" className={inputClass(errors.phone?.message)} />
              {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-300 mb-1">Company / Business Name *</label>
            <input {...register('businessName')} id="businessName" placeholder="Acme Dental Group" className={inputClass(errors.businessName?.message)} />
            {errors.businessName && <p className="mt-1 text-sm text-red-400">{errors.businessName.message}</p>}
          </div>

          {/* Location & Business Type */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="numberOfLocations" className="block text-sm font-medium text-gray-300 mb-1">Number of Locations *</label>
              <select {...register('numberOfLocations')} id="numberOfLocations" defaultValue="" className={selectClass(errors.numberOfLocations?.message)}>
                <option value="" disabled>Select...</option>
                {locationOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.numberOfLocations && <p className="mt-1 text-sm text-red-400">{errors.numberOfLocations.message}</p>}
            </div>
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-300 mb-1">Business Type *</label>
              <select {...register('businessType')} id="businessType" defaultValue="" className={selectClass(errors.businessType?.message)}>
                <option value="" disabled>Select...</option>
                {businessTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.businessType && <p className="mt-1 text-sm text-red-400">{errors.businessType.message}</p>}
            </div>
          </div>

          {/* Biggest Concern */}
          <div>
            <label htmlFor="biggestConcern" className="block text-sm font-medium text-gray-300 mb-1">Biggest Security Concern *</label>
            <select {...register('biggestConcern')} id="biggestConcern" defaultValue="" className={selectClass(errors.biggestConcern?.message)}>
              <option value="" disabled>Select...</option>
              {concernOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.biggestConcern && <p className="mt-1 text-sm text-red-400">{errors.biggestConcern.message}</p>}
          </div>

          {/* TCPA Consent */}
          <div className="flex items-start gap-3">
            <input
              {...register('tcpaConsent')}
              id="tcpaConsent"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#00C853] focus:ring-[#00C853]"
            />
            <label htmlFor="tcpaConsent" className="text-xs text-gray-400 leading-relaxed">
              By submitting this form, I consent to receive calls, texts, and emails from ShieldHome regarding commercial security services. Message &amp; data rates may apply. Reply STOP to opt out at any time. View our{' '}
              <a href="/privacy" className="underline hover:text-gray-300">Privacy Policy</a>.
            </label>
          </div>
          {errors.tcpaConsent && <p className="text-sm text-red-400">{errors.tcpaConsent.message}</p>}

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00C853] hover:bg-[#00A846] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-lg py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              'Request My Free Assessment →'
            )}
          </button>

          <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
            <Lock size={12} />
            Your information is secure and will never be sold.
          </p>
        </form>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
// No icon library — custom SVG only
import { cn } from '@/lib/utils'
import { captureTrackingData, type TrackingData } from '@/lib/utm'
import { pushDataLayer, fireMetaEvent, pushEnhancedConversions } from '@/lib/google-tracking'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import { trackPhoneClick } from '@/lib/google-tracking'

// ---- Schemas ----

const step1Schema = z.object({
  fullName: z.string().min(2, 'Please enter your name'),
  phone: z.string().min(14, 'Valid phone number required'),
  zip: z.string().regex(/^\d{5}$/, 'Valid 5-digit ZIP required'),
})

const step3Schema = z.object({
  email: z.string().email('Valid email required'),
  timeline: z.enum(['ASAP', 'WITHIN_30_DAYS', 'RESEARCHING']),
  consent: z.literal(true, { error: 'Consent is required' }),
})

type Step1Form = z.infer<typeof step1Schema>

// ---- Phone formatting ----

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

// ---- Component ----

interface GoogleLeadFormProps {
  className?: string
  compact?: boolean // For the bottom-of-page duplicate form
}

export default function GoogleLeadForm({ className, compact }: GoogleLeadFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [leadId, setLeadId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [tracking, setTracking] = useState<TrackingData | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Step 2 state
  const [hasSystem, setHasSystem] = useState<boolean | null>(null)
  const [currentProvider, setCurrentProvider] = useState<string | null>(null)
  const [ownership, setOwnership] = useState<'OWN' | 'RENT' | null>(null)

  // Step 3 state
  const [timeline, setTimeline] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)

  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    defaultValues: { fullName: '', phone: '', zip: '' },
  })

  const step3Email = useForm<{ email: string }>({
    defaultValues: { email: '' },
  })

  useEffect(() => {
    setTracking(captureTrackingData())
  }, [])

  // ---- Step 1 Submit ----

  async function onStep1Submit(data: Step1Form) {
    setLoading(true)
    try {
      const res = await fetch('/api/leads/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.fullName,
          phone: data.phone,
          zipCode: data.zip,
          ...tracking,
        }),
      })
      const result = await res.json()
      if (result.success && result.leadId) {
        setLeadId(result.leadId)
        pushDataLayer('form_step_1_complete', { formType: 'google_lead', hasPhone: true })
        fireMetaEvent('Lead', { value: 50, currency: 'USD' })
        setCurrentStep(2)
      }
    } catch (err) {
      console.error('Step 1 submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  // ---- Step 2 Submit ----

  async function onStep2Submit() {
    if (ownership === null) return
    setLoading(true)
    try {
      await fetch('/api/leads/google', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 2,
          leadId,
          hasSystem: hasSystem ?? false,
          currentProvider,
          homeownership: ownership,
        }),
      })
      pushDataLayer('form_step_2_complete', {
        formType: 'google_lead',
        hasSystem,
        currentProvider,
        ownership,
      })
      setCurrentStep(3)
    } catch (err) {
      console.error('Step 2 submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  // ---- Step 3 Submit ----

  async function onStep3Submit() {
    const emailVal = step3Email.getValues('email')
    const emailValid = z.string().email().safeParse(emailVal)
    if (!emailValid.success) {
      step3Email.setError('email', { message: 'Valid email required' })
      return
    }
    if (!timeline) return
    if (!consent) return

    setLoading(true)
    try {
      await fetch('/api/leads/google', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 3,
          leadId,
          email: emailVal,
          timeline,
          tcpaConsent: true,
        }),
      })

      pushDataLayer('lead_submitted', { formType: 'google_lead', value: 900, currency: 'USD' })
      fireMetaEvent('CompleteRegistration', { value: 100, currency: 'USD' })

      // Enhanced Conversions
      pushEnhancedConversions({
        email: emailVal,
        phone: step1Form.getValues('phone'),
        name: step1Form.getValues('fullName'),
        zip: step1Form.getValues('zip'),
      })

      // Google Ads conversion
      window.gtag?.('event', 'conversion', {
        send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/PeImCJX0lI0cELW4uJZD`,
        value: 100,
        currency: 'USD',
      })

      setSubmitted(true)
    } catch (err) {
      console.error('Step 3 submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  // ---- Completion State ----

  if (submitted) {
    return (
      <div className={cn('bg-white rounded-xl shadow-lg p-6 text-center', className)}>
        <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-full mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#059669" strokeWidth="2" strokeLinecap="square" />
          </svg>
        </div>
        <h3 className="font-heading font-bold text-[22px] tracking-[-0.02em] text-slate-900 mb-2">You&apos;re All Set</h3>
        <p className="text-[15px] font-body text-slate-500 mb-5 leading-relaxed">
          We&apos;re matching you with a security specialist now.<br />
          Expect a call from <strong className="text-slate-700">{PHONE_NUMBER}</strong> within 2 minutes.
        </p>
        <div className="bg-slate-50 rounded-lg p-4 mb-5 text-left border border-slate-100">
          <p className="text-[13px] font-heading font-semibold text-slate-900 mb-2 tracking-[-0.01em]">Your Total Shield Package is reserved:</p>
          <ul className="text-[13px] font-body text-slate-600 space-y-1.5">
            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" /> $0 down</li>
            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" /> Free professional installation</li>
            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" /> 60-day money-back guarantee</li>
          </ul>
        </div>
        <p className="text-[12px] font-body text-slate-400 mb-3">Save our number so you don&apos;t miss the call</p>
        <a
          href={`tel:${PHONE_NUMBER_RAW}`}
          onClick={() => trackPhoneClick('hero')}
          className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-heading font-semibold text-[14px] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
        >
          {PHONE_NUMBER}
        </a>
      </div>
    )
  }

  // ---- Progress Bar ----

  const stepLabels = ['Your Info', 'Your Home', 'Almost Done!']
  const progressPercent = currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100

  return (
    <div className={cn('bg-white rounded-xl shadow-lg overflow-hidden', className)} ref={containerRef}>
      {/* Progress */}
      <div className="px-4 pt-3 pb-1.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-heading font-semibold text-slate-500">
            Step {currentStep} of 3
          </span>
          <span className="text-xs font-heading font-semibold text-emerald-600">
            {stepLabels[currentStep - 1]}
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%`, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </div>
      </div>

      {/* Steps Container */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${(currentStep - 1) * 100}%)`,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* ---- STEP 1 ---- */}
          <div className="w-full flex-shrink-0 px-4 pb-4 pt-1">
            <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-2">
              <input
                {...step1Form.register('fullName')}
                type="text"
                placeholder="Full Name"
                autoFocus={!compact}
                autoComplete="name"
                className={cn(
                  'w-full px-3.5 py-2.5 rounded-lg border text-slate-900 placeholder-slate-400 transition-colors text-[16px]',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
                  step1Form.formState.errors.fullName ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                )}
              />
              {step1Form.formState.errors.fullName && (
                <p className="text-xs text-red-600 -mt-1">{step1Form.formState.errors.fullName.message}</p>
              )}

              <input
                {...step1Form.register('phone', {
                  onChange: (e) => {
                    e.target.value = formatPhone(e.target.value)
                  },
                })}
                type="tel"
                placeholder="Phone Number"
                autoComplete="tel"
                className={cn(
                  'w-full px-3.5 py-2.5 rounded-lg border text-slate-900 placeholder-slate-400 transition-colors text-[16px]',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
                  step1Form.formState.errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                )}
              />
              {step1Form.formState.errors.phone && (
                <p className="text-xs text-red-600 -mt-1">{step1Form.formState.errors.phone.message}</p>
              )}

              <input
                {...step1Form.register('zip')}
                type="text"
                inputMode="numeric"
                maxLength={5}
                placeholder="ZIP Code"
                autoComplete="postal-code"
                className={cn(
                  'w-full px-3.5 py-2.5 rounded-lg border text-slate-900 placeholder-slate-400 transition-colors text-[16px]',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
                  step1Form.formState.errors.zip ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                )}
              />
              {step1Form.formState.errors.zip && (
                <p className="text-xs text-red-600 -mt-1">{step1Form.formState.errors.zip.message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  'Get My Free Security Assessment'
                )}
              </button>
            </form>

            <p className="text-center text-[11px] text-slate-400 mt-3 font-body tracking-wide">
              Free assessment &middot; No obligation &middot; Callback in &lt; 2 min
            </p>
          </div>

          {/* ---- STEP 2 ---- */}
          <div className="w-full flex-shrink-0 px-5 pb-5 pt-2">
            <div className="space-y-4">
              {/* Has system? */}
              <div>
                <p className="text-sm font-heading font-semibold text-slate-700 mb-2">Do you currently have a security system?</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['yes', 'no'] as const).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setHasSystem(val === 'yes')
                        if (val === 'no') setCurrentProvider(null)
                      }}
                      className={cn(
                        'py-3 rounded-lg border-2 font-heading font-semibold text-sm transition-all',
                        hasSystem === (val === 'yes')
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      )}
                    >
                      {val === 'yes' ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current provider */}
              {hasSystem && (
                <div>
                  <p className="text-sm font-heading font-semibold text-slate-700 mb-2">Who is your current provider?</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['ADT', 'Ring', 'SimpliSafe', 'Vivint', 'Other'].map((provider) => (
                      <button
                        key={provider}
                        type="button"
                        onClick={() => setCurrentProvider(provider)}
                        className={cn(
                          'py-2.5 rounded-lg border-2 font-heading font-semibold text-xs transition-all',
                          currentProvider === provider
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300',
                          provider === 'Other' && 'col-span-3 sm:col-span-1'
                        )}
                      >
                        {provider}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Own/Rent */}
              <div>
                <p className="text-sm font-heading font-semibold text-slate-700 mb-2">Do you own or rent your home?</p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'OWN' as const, label: 'I Own My Home' },
                    { value: 'RENT' as const, label: 'I Rent' },
                  ]).map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setOwnership(value)}
                      className={cn(
                        'py-3 rounded-lg border-2 font-heading font-semibold text-sm transition-all',
                        ownership === value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {ownership === 'RENT' && (
                  <p className="text-xs text-amber-600 mt-2">
                    Vivint systems typically require homeowner approval. We can still help if your landlord agrees!
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onStep2Submit}
                disabled={loading || ownership === null}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg font-heading font-semibold text-[15px] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  'Continue →'
                )}
              </button>
            </div>
          </div>

          {/* ---- STEP 3 ---- */}
          <div className="w-full flex-shrink-0 px-5 pb-5 pt-2">
            <div className="space-y-3">
              <input
                {...step3Email.register('email')}
                type="email"
                placeholder="Email Address"
                autoComplete="email"
                className={cn(
                  'w-full px-3.5 py-2.5 rounded-lg border text-slate-900 placeholder-slate-400 transition-colors text-[16px]',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
                  step3Email.formState.errors.email ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                )}
              />
              {step3Email.formState.errors.email && (
                <p className="text-xs text-red-600 -mt-1">{step3Email.formState.errors.email.message}</p>
              )}

              <div>
                <p className="text-sm font-heading font-semibold text-slate-700 mb-2">When are you looking to get security?</p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'ASAP', label: 'ASAP', badge: 'Most Popular' },
                    { value: 'WITHIN_30_DAYS', label: 'Within 30 Days', badge: null },
                    { value: 'RESEARCHING', label: 'Researching', badge: null },
                  ] as const).map(({ value, label, badge }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTimeline(value)}
                      className={cn(
                        'relative py-2.5 rounded-lg border-2 font-heading font-semibold text-xs transition-all',
                        timeline === value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      )}
                    >
                      {badge && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          {badge}
                        </span>
                      )}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TCPA Consent */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-500 leading-relaxed">
                  I agree to receive calls and texts from ShieldHome Pro at the number provided. Consent is not a condition of purchase. Msg &amp; data rates may apply.{' '}
                  <a href="/privacy" className="underline" target="_blank" rel="noopener">Privacy Policy</a>
                </span>
              </label>

              <button
                type="button"
                onClick={onStep3Submit}
                disabled={loading || !timeline || !consent}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg font-heading font-semibold text-[15px] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  'Get My Personalized Security Package →'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

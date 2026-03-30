'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { captureTrackingData, type TrackingData } from '@/lib/utm'
import { pushDataLayer, fireMetaEvent, pushEnhancedConversions } from '@/lib/google-tracking'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import { trackPhoneClick } from '@/lib/google-tracking'

// ── Phone formatting ──

function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.length >= 11 && digits.startsWith('1')) digits = digits.slice(1)
  digits = digits.slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

// ── Spinner ──

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ── Context card content per step ──

interface ContextContent {
  text: string
  icon: React.ReactNode
}

function ContextCard({ text, icon }: ContextContent) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2.5 mt-3 transition-all duration-300">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm text-[18px]">
        {icon}
      </div>
      <p className="text-[11px] text-slate-500 leading-snug font-body">{text}</p>
    </div>
  )
}

// ── Quiz option button ──

function QuizButton({
  children,
  onClick,
  badge,
}: {
  children: React.ReactNode
  onClick: () => void
  badge?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full py-3.5 rounded-lg border-2 border-slate-200 bg-white text-[15px] font-heading font-medium text-slate-700 text-center transition-all duration-200 hover:border-emerald-500 hover:shadow-sm active:bg-emerald-50 active:border-emerald-500 active:scale-[1.01]"
    >
      {badge && (
        <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[10px] font-heading font-semibold px-2.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {children}
    </button>
  )
}

// ── Back button ──

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-slate-400 hover:text-slate-600 text-[13px] font-body transition-colors duration-200 mb-2"
    >
      &larr; Back
    </button>
  )
}

// ── Shared input classes ──

const inputBase = 'w-full px-4 py-3 rounded-lg border text-slate-900 placeholder-slate-400 transition-all duration-200 text-[16px] font-body bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500'
const inputError = 'border-red-300 bg-red-50/50 focus:ring-red-500/40 focus:border-red-500'
const inputDefault = 'border-slate-200 hover:border-slate-300'

// ── Component ──

interface GoogleLeadFormProps {
  className?: string
  compact?: boolean
}

export default function GoogleLeadForm({ className, compact }: GoogleLeadFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [tracking, setTracking] = useState<TrackingData | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Qualification state (Steps 1-4)
  const [ownership, setOwnership] = useState<'OWN' | 'RENT' | null>(null)
  const [hasSystem, setHasSystem] = useState<'yes' | 'no' | null>(null)
  const [timeline, setTimeline] = useState<string | null>(null)
  const [creditScore, setCreditScore] = useState<string | null>(null)

  // Contact state (Step 4)
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [zip, setZip] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setTracking(captureTrackingData())
  }, [])

  // ── Step handlers ──

  function goToStep(step: number) {
    setCurrentStep(step)
  }

  function handleOwnership(value: 'OWN' | 'RENT') {
    setOwnership(value)
    pushDataLayer('form_step_1_complete', { formType: 'google_lead', homeOwnership: value })
    goToStep(2)
  }

  function handleHasSystem(value: 'yes' | 'no') {
    setHasSystem(value)
    pushDataLayer('form_step_2_complete', { formType: 'google_lead', hasSystem: value })
    goToStep(3)
  }

  function handleTimeline(value: string) {
    setTimeline(value)
    pushDataLayer('form_step_3_complete', { formType: 'google_lead', timeline: value })
    goToStep(4)
  }

  function handleCreditScore(value: string) {
    setCreditScore(value)
    pushDataLayer('form_step_4_complete', { formType: 'google_lead', creditScore: value })
    goToStep(5)
  }

  // ── Step 4 validation + submit ──

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!firstName.trim()) errs.firstName = 'Please enter your first name'
    if (phone.replace(/\D/g, '').length < 10) errs.phone = 'Please enter a valid phone number'
    if (email && !z.string().email().safeParse(email).success) errs.email = 'Please enter a valid email'
    if (!/^\d{5}$/.test(zip)) errs.zip = 'Please enter a valid ZIP code'
    if (!consent) errs.consent = 'Consent is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)

    try {
      // POST — create lead with contact info
      const res = await fetch('/api/leads/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          phone,
          zipCode: zip,
          creditScoreRange: creditScore,
          ...tracking,
        }),
      })
      const result = await res.json()

      if (result.success && result.leadId) {
        // PATCH Step 2 — qualification data
        await fetch('/api/leads/google', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            step: 2,
            leadId: result.leadId,
            hasSystem: hasSystem === 'yes',
            currentProvider: null,
            homeownership: ownership,
          }),
        })

        // PATCH Step 3 — timeline + email
        const timelineMap: Record<string, string> = {
          asap: 'ASAP',
          '30days': 'WITHIN_30_DAYS',
          researching: 'RESEARCHING',
        }

        await fetch('/api/leads/google', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            step: 3,
            leadId: result.leadId,
            email: email || null,
            timeline: timelineMap[timeline || 'asap'],
            tcpaConsent: true,
          }),
        })

        // Tracking
        fireMetaEvent('Lead', { value: 50, currency: 'USD' })
        pushDataLayer('lead_submitted', { formType: 'google_lead', value: 900, currency: 'USD' })
        fireMetaEvent('CompleteRegistration', { value: 100, currency: 'USD' })

        pushEnhancedConversions({
          email: email || '',
          phone,
          name: firstName,
          zip,
        })

        window.gtag?.('event', 'conversion', {
          send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/PeImCJX0lI0cELW4uJZD`,
          value: 100,
          currency: 'USD',
        })

        setSubmitted(true)
      }
    } catch (err) {
      console.error('Form submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── Completion State ──

  if (submitted) {
    return (
      <div className={cn('bg-white rounded-2xl shadow-lg p-7 text-center', className)}>
        <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-full mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-heading font-bold text-[22px] tracking-[-0.02em] text-slate-900 mb-2">You&apos;re All Set</h3>
        <p className="text-[15px] font-body text-slate-500 mb-6 leading-relaxed">
          We&apos;re matching you with a security specialist now.<br />
          Expect a call from <strong className="text-slate-700">{PHONE_NUMBER}</strong> within 2 minutes.
        </p>
        <div className="bg-slate-50 rounded-xl p-5 mb-6 text-left border border-slate-100">
          <p className="text-[13px] font-heading font-semibold text-slate-900 mb-3 tracking-[-0.01em]">Your custom quote is reserved:</p>
          <ul className="text-[13px] font-body text-slate-600 space-y-2">
            {['$0 down', 'Free professional installation', '60-day money-back guarantee'].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[12px] font-body text-slate-400 mb-3">Save our number so you don&apos;t miss the call</p>
        <a
          href={`tel:${PHONE_NUMBER_RAW}`}
          onClick={() => trackPhoneClick('hero')}
          className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-heading font-semibold text-[14px] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
        >
          {PHONE_NUMBER}
        </a>
      </div>
    )
  }

  // ── Progress ──

  const progressPercent = currentStep === 1 ? 20 : currentStep === 2 ? 40 : currentStep === 3 ? 60 : currentStep === 4 ? 80 : 100

  // ── Context content per step ──

  function getContext(): ContextContent | null {
    if (currentStep === 1) {
      return {
        icon: <span>🏠</span>,
        text: 'Homeowners save an average of 20% on insurance with a monitored security system',
      }
    }
    if (currentStep === 2) {
      if (hasSystem === 'yes') {
        return { icon: <span>💳</span>, text: "We'll buy out your existing contract — up to $1,000" }
      }
      return { icon: <span>🔧</span>, text: 'Your complete system is professionally installed at no cost' }
    }
    if (currentStep === 3) {
      if (timeline === 'asap') {
        return { icon: <span>⚡</span>, text: 'Most installations happen within 24 hours' }
      }
      if (timeline === '30days') {
        return { icon: <span>🔒</span>, text: "We'll lock in today's pricing and promotions for you" }
      }
      return { icon: <span>✓</span>, text: 'No pressure — get your quote to compare at your own pace' }
    }
    if (currentStep === 4) {
      return {
        icon: <span>💳</span>,
        text: 'Vivint offers $0-down financing for qualifying credit — most customers are approved',
      }
    }
    if (currentStep === 5) {
      return {
        icon: <span>📦</span>,
        text: 'Your custom quote includes up to $2,194 in equipment + free professional installation',
      }
    }
    return null
  }

  const context = getContext()

  return (
    <div className={cn('bg-white rounded-2xl shadow-lg overflow-hidden', className)}>
      {/* Progress */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-[0.06em]">
            Step {currentStep} of 5
          </span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%`, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </div>
      </div>

      {/* Steps — only render the active step so height auto-fits */}
      <div className="px-5 pb-4 pt-2">
        {currentStep === 1 && (
          <div>
            <p className="text-[15px] font-heading font-semibold text-slate-900 mb-4 text-center">
              Do you own or rent your home?
            </p>
            <div className="space-y-3">
              <QuizButton onClick={() => handleOwnership('OWN')}>I Own My Home</QuizButton>
              <QuizButton onClick={() => handleOwnership('RENT')}>I Rent</QuizButton>
            </div>
            {context && <ContextCard {...context} />}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <BackButton onClick={() => goToStep(1)} />
            <p className="text-[15px] font-heading font-semibold text-slate-900 mb-4 text-center">
              Do you currently have a security system?
            </p>
            <div className="space-y-3">
              <QuizButton onClick={() => handleHasSystem('yes')}>Yes — looking to switch</QuizButton>
              <QuizButton onClick={() => handleHasSystem('no')}>No — getting my first system</QuizButton>
            </div>
            {context && <ContextCard {...context} />}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <BackButton onClick={() => goToStep(2)} />
            <p className="text-[15px] font-heading font-semibold text-slate-900 mb-4 text-center">
              When do you want to get set up?
            </p>
            <div className="space-y-3">
              <QuizButton onClick={() => handleTimeline('asap')} badge="Most Popular">ASAP — this week</QuizButton>
              <QuizButton onClick={() => handleTimeline('30days')}>Within 30 days</QuizButton>
              <QuizButton onClick={() => handleTimeline('researching')}>Just exploring options</QuizButton>
            </div>
            {context && <ContextCard {...context} />}
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <BackButton onClick={() => goToStep(3)} />
            <p className="text-[15px] font-heading font-semibold text-slate-900 mb-1 text-center">
              What&apos;s your estimated credit score?
            </p>
            <p className="text-[12px] font-body text-slate-400 mb-4 text-center">
              This helps us find the best $0-down financing option for you
            </p>
            <div className="space-y-3">
              <QuizButton onClick={() => handleCreditScore('EXCELLENT')}>Excellent (750+)</QuizButton>
              <QuizButton onClick={() => handleCreditScore('GOOD')}>Good (700–749)</QuizButton>
              <QuizButton onClick={() => handleCreditScore('FAIR')}>Fair (650–699)</QuizButton>
              <QuizButton onClick={() => handleCreditScore('BELOW_650')}>Below 650</QuizButton>
              <QuizButton onClick={() => handleCreditScore('NOT_SURE')}>I&apos;m not sure</QuizButton>
            </div>
            {context && <ContextCard {...context} />}
          </div>
        )}

        {currentStep === 5 && (
          <div className="pb-1">
            <BackButton onClick={() => goToStep(4)} />
            <p className="text-[15px] font-heading font-semibold text-slate-900 mb-1 text-center">
              Almost done — let&apos;s build your custom quote.
            </p>
            <p className="text-[12px] font-body text-slate-400 mb-4 text-center">
              We&apos;ll call you within 2 minutes with your personalized package and pricing.
            </p>

            <div className="space-y-2.5">
              <div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setErrors((p) => ({ ...p, firstName: '' })) }}
                  placeholder="First Name"
                  autoComplete="given-name"
                  className={cn(inputBase, errors.firstName ? inputError : inputDefault)}
                />
                {errors.firstName && <p className="text-[12px] text-red-600 mt-1 ml-1">{errors.firstName}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(formatPhone(e.target.value)); setErrors((p) => ({ ...p, phone: '' })) }}
                  placeholder="Phone Number"
                  autoComplete="tel"
                  className={cn(inputBase, errors.phone ? inputError : inputDefault)}
                />
                {errors.phone && <p className="text-[12px] text-red-600 mt-1 ml-1">{errors.phone}</p>}
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
                  placeholder="Email (optional)"
                  autoComplete="email"
                  className={cn(inputBase, errors.email ? inputError : inputDefault)}
                />
                {errors.email && <p className="text-[12px] text-red-600 mt-1 ml-1">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={zip}
                  onChange={(e) => { setZip(e.target.value.replace(/\D/g, '').slice(0, 5)); setErrors((p) => ({ ...p, zip: '' })) }}
                  maxLength={5}
                  placeholder="ZIP Code"
                  autoComplete="postal-code"
                  className={cn(inputBase, errors.zip ? inputError : inputDefault)}
                />
                {errors.zip && <p className="text-[12px] text-red-600 mt-1 ml-1">{errors.zip}</p>}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(5,150,105,0.35)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? <Spinner /> : 'Get My Free Quote'}
              </button>
            </div>

            <p className="text-center text-[11px] text-slate-400 mt-3 font-body tracking-[0.02em]">
              Free quote &middot; No obligation &middot; Callback in &lt; 2 min
            </p>

            <label className="flex items-start gap-2.5 cursor-pointer mt-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => { setConsent(e.target.checked); setErrors((p) => ({ ...p, consent: '' })) }}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 leading-relaxed font-body">
                I agree to receive calls and texts from ShieldHome Pro at the number provided. Consent is not a condition of purchase. Msg &amp; data rates may apply.{' '}
                <a href="/privacy" className="underline" target="_blank" rel="noopener">Privacy Policy</a>
              </span>
            </label>
            {errors.consent && <p className="text-[11px] text-red-600 mt-1 ml-1">{errors.consent}</p>}

            {context && <ContextCard {...context} />}
          </div>
        )}
      </div>
    </div>
  )
}

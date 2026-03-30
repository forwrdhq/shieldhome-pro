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

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ── Providers ──

const PROVIDERS = [
  { value: 'ADT', label: 'ADT' },
  { value: 'SimpliSafe', label: 'SimpliSafe' },
  { value: 'Ring', label: 'Ring' },
  { value: 'Brinks', label: 'Brinks' },
  { value: 'Other', label: 'Other' },
]

const CONTRACT_OPTIONS = [
  { value: 'less-than-6', label: 'Less than 6 months' },
  { value: '6-12', label: '6–12 months' },
  { value: '12-24', label: '12–24 months' },
  { value: '24+', label: '24+ months' },
  { value: 'none', label: 'No contract' },
  { value: 'not-sure', label: 'Not sure' },
]

// ── Context cards ──

interface ContextContent { text: string; icon: React.ReactNode }

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

// ── Shared input classes ──

const inputBase = 'w-full px-4 py-3 rounded-lg border text-slate-900 placeholder-slate-400 transition-all duration-200 text-[16px] font-body bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500'
const inputError = 'border-red-300 bg-red-50/50 focus:ring-red-500/40 focus:border-red-500'
const inputDefault = 'border-slate-200 hover:border-slate-300'

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

// ── Component ──

interface SwitchFormProps {
  className?: string
}

export default function SwitchForm({ className }: SwitchFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [tracking, setTracking] = useState<TrackingData | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Step 1 — Provider
  const [provider, setProvider] = useState('')
  const [otherProvider, setOtherProvider] = useState('')
  const [zipCode, setZipCode] = useState('')

  // Step 2 — Contract
  const [contractMonths, setContractMonths] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState('')

  // Step 3 — Credit Score
  const [creditScore, setCreditScore] = useState('')

  // Step 4 — Contact
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setTracking(captureTrackingData())
  }, [])

  function goToStep(step: number) {
    setCurrentStep(step)
  }

  // ── Step 1 validation ──

  const isStep1Valid = provider && zipCode.length >= 5

  function handleProviderSelect(value: string) {
    setProvider(value)
    if (value !== 'Other') setOtherProvider('')
  }

  function goToStep2() {
    if (!isStep1Valid) return
    pushDataLayer('switch_step_1', { provider })
    goToStep(2)
  }

  // ── Step 2 validation ──

  const isStep2Valid = contractMonths !== ''

  function goToStep3() {
    if (!isStep2Valid) return
    pushDataLayer('switch_step_2', { contractMonths })
    goToStep(3)
  }

  function handleCreditScore(value: string) {
    setCreditScore(value)
    pushDataLayer('switch_step_3', { creditScore: value })
    goToStep(4)
  }

  // ── Step 3 validation + submit ──

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!firstName.trim()) errs.firstName = 'Please enter your first name'
    if (phone.replace(/\D/g, '').length < 10) errs.phone = 'Please enter a valid phone number'
    if (email && !z.string().email().safeParse(email).success) errs.email = 'Please enter a valid email'
    if (!consent) errs.consent = 'Consent is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit() {
    if (!validate() || loading) return
    setLoading(true)

    try {
      const currentProvider = provider === 'Other' ? otherProvider || 'Other' : provider
      const phoneDigits = phone.replace(/\D/g, '')

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          phone: phoneDigits,
          email: email || '',
          zipCode,
          segment: 'switch',
          currentProvider,
          contractMonthsRemaining: contractMonths,
          currentMonthlyPayment: monthlyPayment || null,
          creditScoreRange: creditScore || null,
          tcpaConsent: consent,
          ...tracking,
          landingPage: '/switch',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')

      // Tracking
      fireMetaEvent('Lead', { content_name: 'contract_buyout', value: 900, currency: 'USD' })
      fireMetaEvent('CompleteRegistration', {})
      pushDataLayer('lead_submitted', { value: 900, segment: 'switch', provider: currentProvider })
      pushEnhancedConversions({ email: email || '', phone: phoneDigits, name: firstName, zip: zipCode })

      window.gtag?.('event', 'conversion', {
        send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/PeImCJX0lI0cELW4uJZD`,
        value: 100,
        currency: 'USD',
      })

      setSubmitted(true)
    } catch (err) {
      console.error('Form submit error:', err)
      setErrors({ submit: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  // ── Completion ──

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
          A switch specialist is reviewing your {provider} contract now.<br />
          Expect a call from <strong className="text-slate-700">{PHONE_NUMBER}</strong> within 2 minutes.
        </p>
        <div className="bg-slate-50 rounded-xl p-5 mb-6 text-left border border-slate-100">
          <p className="text-[13px] font-heading font-semibold text-slate-900 mb-3">Your buyout package includes:</p>
          <ul className="text-[13px] font-body text-slate-600 space-y-2">
            {[`Up to $1,000 contract buyout`, 'Free professional installation', '60-day money-back guarantee'].map((item) => (
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
          onClick={() => trackPhoneClick('switch_form')}
          className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-heading font-semibold text-[14px] transition-all duration-300 hover:-translate-y-px"
        >
          {PHONE_NUMBER}
        </a>
      </div>
    )
  }

  // ── Progress ──

  const progressPercent = currentStep === 1 ? 25 : currentStep === 2 ? 50 : currentStep === 3 ? 75 : 100

  // ── Context per step ──

  function getContext(): ContextContent | null {
    if (currentStep === 1) {
      return { icon: <span>💰</span>, text: 'We cover up to $1,000 in cancellation fees when you switch' }
    }
    if (currentStep === 2) {
      return { icon: <span>⚡</span>, text: 'Most switches complete within 24–48 hours — zero gap in protection' }
    }
    if (currentStep === 3) {
      return { icon: <span>💳</span>, text: 'Vivint offers $0-down financing for qualifying credit — most customers are approved' }
    }
    if (currentStep === 4) {
      return { icon: <span>📦</span>, text: `Your buyout quote includes free installation + the latest Vivint equipment` }
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
            Step {currentStep} of 4
          </span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%`, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </div>
      </div>

      <div className="px-5 pb-4 pt-2">
        {/* ── Step 1: Provider + ZIP ── */}
        {currentStep === 1 && (
          <div>
            <p className="text-[15px] font-heading font-semibold text-slate-900 mb-1 text-center">
              Who is your current provider?
            </p>
            <p className="text-[12px] font-body text-slate-400 mb-4 text-center">
              We&apos;ll calculate your buyout amount
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {PROVIDERS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handleProviderSelect(p.value)}
                  className={cn(
                    'py-3 px-2 rounded-lg border-2 text-center font-heading font-semibold text-[13px] transition-all duration-200',
                    provider === p.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {provider === 'Other' && (
              <div className="mb-4">
                <input
                  type="text"
                  value={otherProvider}
                  onChange={(e) => setOtherProvider(e.target.value)}
                  placeholder="Provider name"
                  className={cn(inputBase, inputDefault)}
                />
              </div>
            )}

            {provider && (
              <div className="mb-4">
                <input
                  type="text"
                  inputMode="numeric"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="Your ZIP Code"
                  maxLength={5}
                  className={cn(inputBase, inputDefault)}
                />
              </div>
            )}

            <button
              onClick={goToStep2}
              disabled={!isStep1Valid}
              className={cn(
                'w-full py-3.5 rounded-lg font-heading font-semibold text-[15px] transition-all duration-300',
                isStep1Valid
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(5,150,105,0.35)]'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              )}
            >
              Continue
            </button>

            {context && <ContextCard {...context} />}
          </div>
        )}

        {/* ── Step 2: Contract Details ── */}
        {currentStep === 2 && (
          <div>
            <BackButton onClick={() => goToStep(1)} />

            {/* Answer badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[11px] font-heading font-semibold px-2.5 py-1 rounded-full">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L5 9l4.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {provider}
              </span>
            </div>

            <p className="text-[15px] font-heading font-semibold text-slate-900 mb-1 text-center">
              Tell us about your contract
            </p>
            <p className="text-[12px] font-body text-slate-400 mb-4 text-center">
              This helps us estimate your buyout amount
            </p>

            <div className="mb-4">
              <label className="block text-[11px] font-heading font-semibold text-slate-400 mb-1.5 uppercase tracking-[0.06em]">
                Months remaining
              </label>
              <select
                value={contractMonths}
                onChange={(e) => setContractMonths(e.target.value)}
                className={cn(inputBase, inputDefault, 'appearance-none bg-white')}
              >
                <option value="">Select...</option>
                {CONTRACT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-heading font-semibold text-slate-400 mb-1.5 uppercase tracking-[0.06em]">
                Monthly payment <span className="normal-case text-slate-300">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value.replace(/[^\d.]/g, ''))}
                  placeholder="45–65 is typical"
                  className={cn(inputBase, inputDefault, 'pl-7')}
                />
              </div>
            </div>

            <button
              onClick={goToStep3}
              disabled={!isStep2Valid}
              className={cn(
                'w-full py-3.5 rounded-lg font-heading font-semibold text-[15px] transition-all duration-300',
                isStep2Valid
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(5,150,105,0.35)]'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              )}
            >
              Continue
            </button>

            {context && <ContextCard {...context} />}
          </div>
        )}

        {/* ── Step 3: Credit Score ── */}
        {currentStep === 3 && (
          <div>
            <BackButton onClick={() => goToStep(2)} />

            {/* Answer badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[11px] font-heading font-semibold px-2.5 py-1 rounded-full">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L5 9l4.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {provider}
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[11px] font-heading font-semibold px-2.5 py-1 rounded-full">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L5 9l4.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {CONTRACT_OPTIONS.find(o => o.value === contractMonths)?.label}
              </span>
            </div>

            <p className="text-[15px] font-heading font-semibold text-slate-900 mb-1 text-center">
              What&apos;s your estimated credit score?
            </p>
            <p className="text-[12px] font-body text-slate-400 mb-4 text-center">
              This helps us find the best $0-down financing option
            </p>

            <div className="space-y-3">
              {[
                { value: 'EXCELLENT', label: 'Excellent (750+)' },
                { value: 'GOOD', label: 'Good (700–749)' },
                { value: 'FAIR', label: 'Fair (650–699)' },
                { value: 'BELOW_650', label: 'Below 650' },
                { value: 'NOT_SURE', label: "I'm not sure" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleCreditScore(opt.value)}
                  className="relative w-full py-3.5 rounded-lg border-2 border-slate-200 bg-white text-[15px] font-heading font-medium text-slate-700 text-center transition-all duration-200 hover:border-emerald-500 hover:shadow-sm active:bg-emerald-50 active:border-emerald-500 active:scale-[1.01]"
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {context && <ContextCard {...context} />}
          </div>
        )}

        {/* ── Step 4: Contact Info ── */}
        {currentStep === 4 && (
          <div className="pb-1">
            <BackButton onClick={() => goToStep(3)} />

            {/* Answer badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[11px] font-heading font-semibold px-2.5 py-1 rounded-full">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L5 9l4.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {provider}
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[11px] font-heading font-semibold px-2.5 py-1 rounded-full">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L5 9l4.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {CONTRACT_OPTIONS.find(o => o.value === contractMonths)?.label}
              </span>
              {creditScore && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[11px] font-heading font-semibold px-2.5 py-1 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L5 9l4.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Credit: {creditScore === 'EXCELLENT' ? '750+' : creditScore === 'GOOD' ? '700–749' : creditScore === 'FAIR' ? '650–699' : creditScore === 'BELOW_650' ? '<650' : 'Not sure'}
                </span>
              )}
            </div>

            <p className="text-[15px] font-heading font-semibold text-slate-900 mb-1 text-center">
              See your buyout quote
            </p>
            <p className="text-[12px] font-body text-slate-400 mb-4 text-center">
              We&apos;ll call with your buyout amount — no obligation
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

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(5,150,105,0.35)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Spinner /> : 'Get My Buyout Quote'}
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
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {context && <ContextCard {...context} />}
          </div>
        )}
      </div>
    </div>
  )
}

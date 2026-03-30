'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight, ChevronLeft, Lock, Award, CheckCircle, ShieldCheck, Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTracking } from '@/lib/utm'

function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.length >= 11 && digits.startsWith('1')) digits = digits.slice(1)
  digits = digits.slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

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

interface SwitchFormProps {
  className?: string
}

export default function SwitchForm({ className }: SwitchFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1
  const [provider, setProvider] = useState('')
  const [otherProvider, setOtherProvider] = useState('')
  const [zipCode, setZipCode] = useState('')
  // Step 2
  const [contractMonths, setContractMonths] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState('')
  // Step 3
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [tcpaConsent, setTcpaConsent] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const isStep1Valid = provider && zipCode.length >= 5
  const isStep2Valid = contractMonths !== ''
  const phoneDigits = phone.replace(/\D/g, '')
  const isStep3Valid =
    firstName.trim().length > 0 &&
    phoneDigits.length === 10 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    tcpaConsent

  function handleProviderSelect(value: string) {
    setProvider(value)
    if (value !== 'Other') setOtherProvider('')
  }

  function goToStep2() {
    if (!isStep1Valid) return
    setStep(2)
    if (typeof window !== 'undefined') {
      if ((window as any).fbq) (window as any).fbq('trackCustom', 'SwitchStep', { step: 1, provider })
      if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'switch_step', step: 1, provider })
    }
  }

  function goToStep3() {
    if (!isStep2Valid) return
    setStep(3)
    if (typeof window !== 'undefined') {
      if ((window as any).fbq) (window as any).fbq('trackCustom', 'SwitchStep', { step: 2, contractMonths })
      if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'switch_step', step: 2, contract_months: contractMonths })
    }
  }

  async function handleSubmit() {
    if (!isStep3Valid || submitting) return
    setSubmitting(true)
    setShowLoading(true)
    setError('')

    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      const tracking = getTracking()
      const currentProvider = provider === 'Other' ? otherProvider || 'Other' : provider

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          phone: phoneDigits,
          email,
          zipCode,
          segment: 'switch',
          currentProvider,
          contractMonthsRemaining: contractMonths,
          currentMonthlyPayment: monthlyPayment || null,
          tcpaConsent,
          ...tracking,
          landingPage: '/switch',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')

      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Lead', { content_name: 'contract_buyout', value: 900, currency: 'USD' })
          ;(window as any).fbq('track', 'CompleteRegistration')
        }
        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({ event: 'lead_submitted', lead_value: 900, segment: 'switch', provider: currentProvider })
        }
      }

      router.push(`/thank-you?segment=switch&provider=${encodeURIComponent(currentProvider)}&timeline=ASAP`)
    } catch (err: any) {
      setShowLoading(false)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Loading ───
  if (showLoading && submitting) {
    return (
      <div className={cn('bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12', className)}>
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-14 h-14 border-[3px] border-gray-200 border-t-emerald-500 rounded-full animate-spin mb-5" />
          <p className="text-lg font-bold text-slate-900 mb-1">Calculating your buyout eligibility...</p>
          <p className="text-gray-400 text-sm">Reviewing {provider} contract terms</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden', className)}>
      {/* Progress bar — full width across top */}
      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full bg-emerald-600 transition-all duration-500 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="p-6 md:p-8">
        {/* Step indicator + back button */}
        <div className="flex items-center justify-between mb-5">
          <div>
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronLeft size={16} />
                Back
              </button>
            ) : (
              <div />
            )}
          </div>
          <span className="text-xs font-medium text-gray-400 tracking-wide uppercase">
            Step {step} of 3
          </span>
        </div>

        {/* ─── Step 1: Provider ─── */}
        {step === 1 && (
          <div className="animate-[fadeInUp_0.25s_ease-out]">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">
              Who is your current security provider?
            </h3>
            <p className="text-gray-400 text-sm mb-5">We&apos;ll calculate your buyout amount</p>

            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {PROVIDERS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handleProviderSelect(p.value)}
                  className={cn(
                    'py-3.5 px-3 rounded-lg border text-center font-semibold text-sm transition-all',
                    provider === p.value
                      ? 'border-emerald-600 bg-emerald-600/5 text-emerald-500 shadow-sm shadow-green-100'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {provider === 'Other' && (
              <div className="mb-5">
                <input
                  type="text"
                  value={otherProvider}
                  onChange={(e) => setOtherProvider(e.target.value)}
                  placeholder="Provider name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-sm"
                />
              </div>
            )}

            {provider && (
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Your ZIP Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="e.g. 84003"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-sm"
                  maxLength={5}
                />
              </div>
            )}

            <button
              onClick={goToStep2}
              disabled={!isStep1Valid}
              className={cn(
                'w-full py-3.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5',
                isStep1Valid
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ─── Step 2: Contract Details ─── */}
        {step === 2 && (
          <div className="animate-[fadeInUp_0.25s_ease-out]">
            {/* Answer badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-500 text-xs font-medium px-2.5 py-1 rounded-full">
                <CheckCircle size={12} /> {provider}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">
              Tell us about your contract
            </h3>
            <p className="text-gray-400 text-sm mb-5">This helps us estimate your buyout amount</p>

            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Months remaining on contract
              </label>
              <select
                value={contractMonths}
                onChange={(e) => setContractMonths(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-sm bg-white appearance-none"
              >
                <option value="">Select...</option>
                {CONTRACT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Current monthly payment <span className="text-gray-300 normal-case">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value.replace(/[^\d.]/g, ''))}
                  placeholder="45–65 is typical"
                  className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-sm"
                />
              </div>
            </div>

            <button
              onClick={goToStep3}
              disabled={!isStep2Valid}
              className={cn(
                'w-full py-3.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5',
                isStep2Valid
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ─── Step 3: Contact Info ─── */}
        {step === 3 && (
          <div className="animate-[fadeInUp_0.25s_ease-out]">
            {/* Answer badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-500 text-xs font-medium px-2.5 py-1 rounded-full">
                <CheckCircle size={12} /> {provider}
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-500 text-xs font-medium px-2.5 py-1 rounded-full">
                <CheckCircle size={12} /> {CONTRACT_OPTIONS.find(o => o.value === contractMonths)?.label}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">
              See your buyout eligibility
            </h3>
            <p className="text-gray-400 text-sm mb-5">We&apos;ll call you with your buyout amount — no obligation</p>

            <div className="space-y-3 mb-5">
              <input
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
                placeholder="First name"
                className={cn(
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-sm',
                  touched.firstName && !firstName.trim() ? 'border-red-300' : 'border-gray-200'
                )}
              />
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                placeholder="Phone number"
                className={cn(
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-sm',
                  touched.phone && phoneDigits.length !== 10 ? 'border-red-300' : 'border-gray-200'
                )}
              />
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="Email address"
                className={cn(
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-sm',
                  touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'border-red-300' : 'border-gray-200'
                )}
              />
            </div>

            <label className="flex items-start gap-3 mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={tcpaConsent}
                onChange={(e) => setTcpaConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-gray-400 leading-relaxed">
                By submitting, you agree to receive calls/texts from ShieldHome.pro regarding your security assessment. Msg &amp; data rates may apply. Reply STOP to cancel.
              </span>
            </label>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!isStep3Valid || submitting}
              className={cn(
                'w-full py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2',
                isStep3Valid && !submitting
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-green-200/50'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              Get My Free Buyout Assessment <ChevronRight size={18} />
            </button>

            {/* Trust row */}
            <div className="flex items-center justify-center gap-3 mt-4 text-[11px] text-gray-400">
              <span className="flex items-center gap-1"><Lock size={11} /> Encrypted</span>
              <span className="flex items-center gap-1"><ShieldCheck size={11} /> BBB A+</span>
              <span className="flex items-center gap-1"><Users size={11} /> 2,400+ switched</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight, Lock, ShieldCheck, Home, Building2, Building, Landmark,
  CheckCircle, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTracking } from '@/lib/utm'

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

const HOME_TYPES = [
  { value: 'HOUSE', label: 'House', icon: Home },
  { value: 'TOWNHOME', label: 'Townhome', icon: Building2 },
  { value: 'CONDO_APARTMENT', label: 'Apartment', icon: Building },
  { value: 'CONDO_APARTMENT', label: 'Condo', icon: Landmark },
]

interface GetQuoteFormProps {
  className?: string
}

export default function GetQuoteForm({ className }: GetQuoteFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1
  const [zipCode, setZipCode] = useState('')
  // Step 2
  const [homeType, setHomeType] = useState('')
  const [homeTypeLabel, setHomeTypeLabel] = useState('')
  const [ownership, setOwnership] = useState<'OWN' | 'RENT' | ''>('')
  // Step 3
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [tcpaConsent, setTcpaConsent] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const isStep1Valid = zipCode.length >= 5
  const isStep2Valid = homeType !== '' && ownership !== ''
  const phoneDigits = phone.replace(/\D/g, '')
  const isStep3Valid =
    firstName.trim().length > 0 &&
    phoneDigits.length === 10 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    tcpaConsent

  function fireTracking(stepNum: number, extra?: Record<string, string>) {
    if (typeof window === 'undefined') return
    const w = window as any
    if (w.fbq) w.fbq('trackCustom', 'QuoteStep', { step: stepNum, ...extra })
    if (w.dataLayer) w.dataLayer.push({ event: 'quote_step', step: stepNum, ...extra })
  }

  function goToStep2() {
    if (!isStep1Valid) return
    setStep(2)
    fireTracking(1, { zipCode })
  }

  function goToStep3() {
    if (!isStep2Valid) return
    setStep(3)
    fireTracking(2, { homeType, ownership })
  }

  async function handleSubmit() {
    if (!isStep3Valid || submitting) return
    setSubmitting(true)
    setShowLoading(true)
    setError('')

    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      const tracking = getTracking()
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          phone: phoneDigits,
          email,
          zipCode,
          propertyType: homeType,
          homeownership: ownership,
          segment: 'new-customer',
          tcpaConsent,
          ...tracking,
          landingPage: '/get-quote',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')

      // Fire conversion events
      const w = window as any
      if (w.fbq) {
        w.fbq('track', 'Lead', { content_name: 'get_quote', value: 900, currency: 'USD' })
        w.fbq('track', 'CompleteRegistration')
      }
      if (w.gtag) {
        w.gtag('event', 'conversion', { send_to: 'AW-18032237621/PeImCJX0lI0cELW4uJZD' })
      }
      if (w.dataLayer) {
        w.dataLayer.push({ event: 'lead_submitted', lead_value: 900, segment: 'new-customer', source: 'google' })
      }

      router.push('/thank-you')
    } catch (err: any) {
      setShowLoading(false)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Loading State ───
  if (showLoading && submitting) {
    return (
      <div className={cn('bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-8', className)}>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-[3px] border-white/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-lg font-bold text-white mb-1">Finding the best plan for your area...</p>
          <p className="text-white/50 text-sm">Checking availability in {zipCode}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden', className)}>
      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <div
          className="h-full bg-emerald-600 transition-all duration-500 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="p-5 md:p-6">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {step > 1 && (
              <button
                onClick={() => { setStep(step - 1); setOwnership(''); }}
                className="text-xs text-white/55 hover:text-white/75 transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
          <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
            Step {step} of 3
          </span>
        </div>

        {/* ─── Step 1: ZIP Code ─── */}
        {step === 1 && (
          <div className="animate-[fadeInUp_0.25s_ease-out]">
            <h3 className="text-lg font-bold text-white mb-1">
              Tell us about your home
            </h3>
            <p className="text-white/50 text-sm mb-4">Enter your ZIP for custom offers in your area</p>

            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="ZIP Code"
                aria-label="ZIP Code"
                className="flex-1 px-4 py-3.5 bg-white rounded-lg text-gray-900 text-sm font-medium placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500"
                maxLength={5}
                autoFocus
              />
              <button
                onClick={goToStep2}
                disabled={!isStep1Valid}
                className={cn(
                  'px-5 py-3.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-1 whitespace-nowrap',
                  isStep1Valid
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                )}
              >
                Get My Free Quote <ChevronRight size={16} />
              </button>
            </div>

            <p className="text-white/50 text-[11px] mt-3 flex items-center gap-1">
              <Lock size={10} /> Your info is encrypted and never sold
            </p>
            <p className="text-white/45 text-[11px] mt-1 text-center">
              Takes 30 seconds · No credit card needed
            </p>
          </div>
        )}

        {/* ─── Step 2: Home Type + Ownership ─── */}
        {step === 2 && (
          <div className="animate-[fadeInUp_0.25s_ease-out]">
            {/* ZIP badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 bg-emerald-600/20 text-emerald-500 text-xs font-medium px-2 py-0.5 rounded-full">
                <CheckCircle size={11} /> {zipCode}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              What type of home?
            </h3>
            <p className="text-white/50 text-sm mb-4">This helps us customize your quote</p>

            <div className="grid grid-cols-4 gap-2 mb-5">
              {HOME_TYPES.map((ht) => {
                const Icon = ht.icon
                return (
                  <button
                    key={ht.label}
                    onClick={() => { setHomeType(ht.value); setHomeTypeLabel(ht.label) }}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all text-center',
                      homeType === ht.value && homeTypeLabel === ht.label
                        ? 'border-emerald-600 bg-emerald-600/10 text-emerald-500'
                        : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white/80'
                    )}
                  >
                    <Icon size={20} />
                    <span className="text-xs font-medium">{ht.label}</span>
                  </button>
                )
              })}
            </div>

            {homeType && (
              <>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2">Do you own or rent?</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => setOwnership('OWN')}
                    className={cn(
                      'py-3 rounded-lg border font-semibold text-sm transition-all',
                      ownership === 'OWN'
                        ? 'border-emerald-600 bg-emerald-600/10 text-emerald-500'
                        : 'border-white/10 text-white/60 hover:border-white/20'
                    )}
                  >
                    I Own
                  </button>
                  <button
                    onClick={() => setOwnership('RENT')}
                    className={cn(
                      'py-3 rounded-lg border font-semibold text-sm transition-all',
                      ownership === 'RENT'
                        ? 'border-emerald-600 bg-emerald-600/10 text-emerald-500'
                        : 'border-white/10 text-white/60 hover:border-white/20'
                    )}
                  >
                    I Rent
                  </button>
                </div>
              </>
            )}

            {ownership && (
              <button
                onClick={goToStep3}
                disabled={!isStep2Valid}
                className={cn(
                  'w-full py-3.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5',
                  isStep2Valid
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                )}
              >
                Continue <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}

        {/* ─── Step 3: Contact Info ─── */}
        {step === 3 && (
          <div className="animate-[fadeInUp_0.25s_ease-out]">
            {/* Answer badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <span className="inline-flex items-center gap-1 bg-emerald-600/20 text-emerald-500 text-[11px] font-medium px-2 py-0.5 rounded-full">
                <CheckCircle size={10} /> {zipCode}
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-600/20 text-emerald-500 text-[11px] font-medium px-2 py-0.5 rounded-full">
                <CheckCircle size={10} /> {homeTypeLabel}
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-600/20 text-emerald-500 text-[11px] font-medium px-2 py-0.5 rounded-full">
                <CheckCircle size={10} /> {ownership === 'OWN' ? 'Homeowner' : 'Renter'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Get your free custom quote
            </h3>
            <p className="text-white/50 text-sm mb-4">A Vivint specialist will call with your personalized plan</p>

            <div className="space-y-3 mb-4">
              <input
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
                placeholder="First name"
                aria-label="First name"
                className={cn(
                  'w-full px-4 py-3 bg-white rounded-lg text-gray-900 text-sm font-medium placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500',
                  touched.firstName && !firstName.trim() && 'ring-2 ring-red-400'
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
                aria-label="Phone number"
                className={cn(
                  'w-full px-4 py-3 bg-white rounded-lg text-gray-900 text-sm font-medium placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500',
                  touched.phone && phoneDigits.length !== 10 && 'ring-2 ring-red-400'
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
                aria-label="Email address"
                className={cn(
                  'w-full px-4 py-3 bg-white rounded-lg text-gray-900 text-sm font-medium placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500',
                  touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && 'ring-2 ring-red-400'
                )}
              />
            </div>

            <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={tcpaConsent}
                onChange={(e) => setTcpaConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 text-emerald-500 focus:ring-emerald-500 bg-white/10"
              />
              <span className="text-[11px] text-white/50 leading-relaxed">
                By submitting, you agree to receive calls/texts from ShieldHome.pro regarding your security quote. Msg &amp; data rates may apply. Reply STOP to cancel.
              </span>
            </label>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!isStep3Valid || submitting}
              className={cn(
                'w-full py-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2',
                isStep3Valid && !submitting
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-green-900/30'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              )}
            >
              Get My Free Quote <ChevronRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-white/45">
              <span className="flex items-center gap-1"><Lock size={10} /> Encrypted</span>
              <span className="flex items-center gap-1"><ShieldCheck size={10} /> Never sold</span>
              <span className="flex items-center gap-1"><Zap size={10} /> Instant quote</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

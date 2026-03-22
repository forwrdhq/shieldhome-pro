'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Shield, Phone, ChevronRight, ChevronLeft, Check, Lock, Award, CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTracking } from '@/lib/utm'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
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
  { value: 'Vivint', label: 'Vivint' },
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
  const [showVivintMessage, setShowVivintMessage] = useState(false)

  // Step 2
  const [contractMonths, setContractMonths] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState('')

  // Step 3
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [tcpaConsent, setTcpaConsent] = useState(false)

  // Validation
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const isStep1Valid = provider && provider !== 'Vivint' && zipCode.length >= 5
  const isStep2Valid = contractMonths !== ''
  const phoneDigits = phone.replace(/\D/g, '')
  const isStep3Valid =
    firstName.trim().length > 0 &&
    phoneDigits.length === 10 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    tcpaConsent

  function handleProviderSelect(value: string) {
    setProvider(value)
    setShowVivintMessage(value === 'Vivint')
    if (value !== 'Other') setOtherProvider('')
  }

  function goToStep2() {
    if (!isStep1Valid) return
    setStep(2)
    // Fire tracking
    if (typeof window !== 'undefined') {
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', 'SwitchStep', { step: 1, provider })
      }
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({ event: 'switch_step', step: 1, provider })
      }
    }
  }

  function goToStep3() {
    if (!isStep2Valid) return
    setStep(3)
    if (typeof window !== 'undefined') {
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', 'SwitchStep', { step: 2, contractMonths })
      }
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({ event: 'switch_step', step: 2, contract_months: contractMonths })
      }
    }
  }

  async function handleSubmit() {
    if (!isStep3Valid || submitting) return
    setSubmitting(true)
    setShowLoading(true)
    setError('')

    // Show loading animation for 1.5s before actual submission
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

      // Fire conversion events
      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Lead', { content_name: 'contract_buyout', value: 900, currency: 'USD' })
          ;(window as any).fbq('track', 'CompleteRegistration')
        }
        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: 'lead_submitted',
            lead_value: 900,
            segment: 'switch',
            provider: currentProvider,
          })
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

  // Loading overlay
  if (showLoading && submitting) {
    return (
      <div className={cn('bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12', className)}>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#00C853] rounded-full animate-spin mb-6" />
          <p className="text-xl font-bold text-[#1A1A2E] mb-2">Calculating your buyout eligibility...</p>
          <p className="text-gray-500 text-sm">This takes just a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8', className)}>
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'w-3 h-3 rounded-full transition-colors',
                s === step ? 'bg-[#00C853]' : s < step ? 'bg-[#00C853]/50' : 'bg-gray-200'
              )}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">Step {step} of 3</span>
        </div>
      </div>

      {/* Step 1: Provider */}
      {step === 1 && (
        <div className="animate-[fadeInUp_0.3s_ease-out]">
          <h3 className="text-xl md:text-2xl font-bold text-[#1A1A2E] mb-1">
            Who is your current security provider?
          </h3>
          <p className="text-gray-500 text-sm mb-6">Select your provider so we can assess your buyout options</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {PROVIDERS.map((p) => (
              <button
                key={p.value}
                onClick={() => handleProviderSelect(p.value)}
                className={cn(
                  'p-4 rounded-xl border-2 text-center font-semibold transition-all min-h-[56px]',
                  provider === p.value
                    ? 'border-[#00C853] bg-green-50 text-[#00C853]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {showVivintMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-blue-800 font-semibold mb-1">Already with Vivint?</p>
              <p className="text-blue-700 text-sm mb-3">
                This page is for customers switching from other providers. If you&apos;re already a Vivint customer and want to upgrade, give us a call.
              </p>
              <a
                href={`tel:${PHONE_NUMBER_RAW}`}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                <Phone size={16} />
                Call {PHONE_NUMBER}
              </a>
            </div>
          )}

          {provider === 'Other' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider name</label>
              <input
                type="text"
                value={otherProvider}
                onChange={(e) => setOtherProvider(e.target.value)}
                placeholder="Enter your provider name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] outline-none transition-all text-base"
              />
            </div>
          )}

          {provider && provider !== 'Vivint' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input
                type="text"
                inputMode="numeric"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="Enter your ZIP code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] outline-none transition-all text-base"
                maxLength={5}
              />
            </div>
          )}

          <button
            onClick={goToStep2}
            disabled={!isStep1Valid}
            className={cn(
              'w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2',
              isStep1Valid
                ? 'bg-[#00C853] hover:bg-[#00A846] text-white shadow-lg shadow-green-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Step 2: Contract Details */}
      {step === 2 && (
        <div className="animate-[fadeInUp_0.3s_ease-out]">
          <h3 className="text-xl md:text-2xl font-bold text-[#1A1A2E] mb-1">
            Tell us about your contract
          </h3>
          <p className="text-gray-500 text-sm mb-6">This helps us calculate your buyout amount</p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How many months are left on your contract?
            </label>
            <select
              value={contractMonths}
              onChange={(e) => setContractMonths(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] outline-none transition-all text-base bg-white appearance-none"
            >
              <option value="">Select...</option>
              {CONTRACT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What do you pay per month? <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input
                type="text"
                inputMode="decimal"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value.replace(/[^\d.]/g, ''))}
                placeholder="$45–$65 is typical"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] outline-none transition-all text-base"
              />
            </div>
          </div>

          <button
            onClick={goToStep3}
            disabled={!isStep2Valid}
            className={cn(
              'w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2',
              isStep2Valid
                ? 'bg-[#00C853] hover:bg-[#00A846] text-white shadow-lg shadow-green-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Step 3: Contact Info */}
      {step === 3 && (
        <div className="animate-[fadeInUp_0.3s_ease-out]">
          <h3 className="text-xl md:text-2xl font-bold text-[#1A1A2E] mb-1">
            See your buyout eligibility
          </h3>
          <p className="text-gray-500 text-sm mb-6">We&apos;ll calculate your buyout amount and call you with your options</p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
                placeholder="Your first name"
                className={cn(
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] outline-none transition-all text-base',
                  touched.firstName && !firstName.trim() ? 'border-red-300' : 'border-gray-300'
                )}
              />
              {touched.firstName && !firstName.trim() && (
                <p className="text-red-500 text-xs mt-1">First name is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                placeholder="(555) 123-4567"
                className={cn(
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] outline-none transition-all text-base',
                  touched.phone && phoneDigits.length !== 10 ? 'border-red-300' : 'border-gray-300'
                )}
              />
              {touched.phone && phoneDigits.length !== 10 && (
                <p className="text-red-500 text-xs mt-1">Valid 10-digit phone number required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="you@email.com"
                className={cn(
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] outline-none transition-all text-base',
                  touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'border-red-300' : 'border-gray-300'
                )}
              />
              {touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                <p className="text-red-500 text-xs mt-1">Valid email required</p>
              )}
            </div>
          </div>

          {/* TCPA Consent */}
          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={tcpaConsent}
              onChange={(e) => setTcpaConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-[#00C853] focus:ring-[#00C853]"
            />
            <span className="text-xs text-gray-500 leading-relaxed">
              By submitting, you agree to receive calls/texts from ShieldHome.pro. Msg &amp; data rates may apply. Reply STOP to cancel.
            </span>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isStep3Valid || submitting}
            className={cn(
              'w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2',
              isStep3Valid && !submitting
                ? 'bg-[#00C853] hover:bg-[#00A846] text-white shadow-lg shadow-green-200 animate-[pulse-green_2s_infinite]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            Get My Free Switch Assessment <ChevronRight size={20} />
          </button>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Lock size={12} /> 256-bit SSL</span>
            <span className="flex items-center gap-1"><Award size={12} /> BBB A+</span>
            <span className="flex items-center gap-1"><CheckCircle size={12} /> #1 Rated</span>
          </div>
        </div>
      )}
    </div>
  )
}

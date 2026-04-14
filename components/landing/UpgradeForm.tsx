'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Lock, Award, CheckCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTracking } from '@/lib/utm'

function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1)
  digits = digits.slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

interface UpgradeFormProps {
  className?: string
}

export default function UpgradeForm({ className }: UpgradeFormProps) {
  const router = useRouter()
  const [isVivintCustomer, setIsVivintCustomer] = useState<boolean | null>(null)
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [tcpaConsent, setTcpaConsent] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [error, setError] = useState('')

  const phoneDigits = phone.replace(/\D/g, '')
  const isFormValid =
    firstName.trim().length > 0 &&
    phoneDigits.length === 10 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    tcpaConsent

  async function handleSubmit() {
    if (!isFormValid || submitting) return
    setSubmitting(true)
    setShowLoading(true)
    setError('')

    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const tracking = getTracking()
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          phone: phoneDigits,
          email,
          segment: 'upgrade',
          tcpaConsent,
          ...tracking,
          landingPage: '/upgrade',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')

      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Lead', { content_name: 'vivint_upgrade', value: 600, currency: 'USD' })
          ;(window as any).fbq('track', 'CompleteRegistration')
        }
        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({ event: 'lead_submitted', lead_value: 600, segment: 'upgrade' })
        }
        if ((window as any).gtag) {
          (window as any).gtag('event', 'conversion', { send_to: 'AW-18032237621/PeImCJX0lI0cELW4uJZD' })
        }
      }

      router.push('/thank-you?segment=upgrade')
    } catch (err: any) {
      setShowLoading(false)
      setError(err.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (showLoading && submitting) {
    return (
      <div className={cn('bg-white rounded-2xl shadow-2xl border border-gray-100 p-8', className)}>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mb-6" />
          <p className="text-xl font-bold text-slate-900 mb-2">Checking upgrade eligibility...</p>
          <p className="text-gray-500 text-sm">This takes just a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8', className)}>
      {/* Customer Gate */}
      {isVivintCustomer === null && (
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Are you a current Vivint customer?</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsVivintCustomer(true)}
              className="p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 font-semibold text-slate-900 transition-all"
            >
              Yes
            </button>
            <button
              onClick={() => setIsVivintCustomer(false)}
              className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 font-semibold text-gray-600 transition-all"
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Not a customer */}
      {isVivintCustomer === false && (
        <div className="text-center py-4">
          <p className="text-slate-900 font-semibold mb-2">This offer is for existing Vivint customers.</p>
          <p className="text-gray-500 text-sm mb-6">Looking for something else?</p>
          <div className="space-y-3">
            <a
              href="/"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 transition-all"
            >
              <span className="font-semibold text-slate-900">Get a new Vivint system</span>
              <ArrowRight size={18} className="text-gray-400" />
            </a>
            <a
              href="/switch"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 transition-all"
            >
              <span className="font-semibold text-slate-900">Switching from another provider?</span>
              <ArrowRight size={18} className="text-gray-400" />
            </a>
          </div>
          <button
            onClick={() => setIsVivintCustomer(null)}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Go back
          </button>
        </div>
      )}

      {/* Customer form */}
      {isVivintCustomer === true && (
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Claim your upgrade offer</h3>
          <p className="text-gray-500 text-sm mb-5">We&apos;ll call you to discuss your upgrade options</p>

          <div className="space-y-3 mb-5">
            <input
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, firstName: true }))}
              placeholder="First Name"
              className={cn(
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none transition-all text-base',
                touched.firstName && !firstName.trim() ? 'border-red-300' : 'border-gray-300'
              )}
            />
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              onBlur={() => setTouched(t => ({ ...t, phone: true }))}
              placeholder="Phone Number"
              className={cn(
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none transition-all text-base',
                touched.phone && phoneDigits.length !== 10 ? 'border-red-300' : 'border-gray-300'
              )}
            />
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              placeholder="Email Address"
              className={cn(
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none transition-all text-base',
                touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'border-red-300' : 'border-gray-300'
              )}
            />
          </div>

          <label className="flex items-start gap-3 mb-5 cursor-pointer">
            <input
              type="checkbox"
              checked={tcpaConsent}
              onChange={(e) => setTcpaConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
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
            disabled={!isFormValid || submitting}
            className={cn(
              'w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2',
              isFormValid && !submitting
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-green-200 animate-[pulse-green_2s_infinite]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            Claim My Upgrade <ChevronRight size={20} />
          </button>

          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Lock size={12} /> 256-bit SSL</span>
            <span className="flex items-center gap-1"><Award size={12} /> BBB A+</span>
            <span className="flex items-center gap-1"><CheckCircle size={12} /> #1 Rated</span>
          </div>

          <button
            onClick={() => setIsVivintCustomer(null)}
            className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Go back
          </button>
        </div>
      )}
    </div>
  )
}

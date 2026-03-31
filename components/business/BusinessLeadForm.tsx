'use client'

import { useState, useEffect } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { captureTrackingData, type TrackingData } from '@/lib/utm'
import { pushDataLayer, fireMetaEvent, pushEnhancedConversions } from '@/lib/google-tracking'
import { Lock, CheckCircle, Shield, Star, Phone } from 'lucide-react'

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

const providers = ['ADT', 'Ring', 'SimpliSafe', 'Brinks', 'None', 'Other']

interface BusinessLeadFormProps {
  kw?: string
}

export default function BusinessLeadForm({ kw }: BusinessLeadFormProps) {
  const ref = useScrollReveal<HTMLElement>()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [currentProvider, setCurrentProvider] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tracking, setTracking] = useState<TrackingData | null>(null)

  useEffect(() => {
    setTracking(captureTrackingData())
  }, [])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!fullName.trim()) errs.fullName = 'Please enter your name'
    if (phone.replace(/\D/g, '').length < 10) errs.phone = 'Please enter a valid phone number'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      const res = await fetch('/api/leads/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.replace(/\D/g, ''),
          currentProvider: currentProvider || null,
          kwParam: kw || null,
          ...tracking,
          landingPage: '/business',
        }),
      })
      const result = await res.json()

      if (result.success) {
        // Analytics
        fireMetaEvent('Lead', { content_name: 'business_lead', content_category: 'commercial', value: 50, currency: 'USD' })
        pushDataLayer('business_lead_form_submit', { formType: 'business_lead', value: 900, currency: 'USD' })
        pushEnhancedConversions({
          email: '',
          phone: phone.replace(/\D/g, ''),
          name: fullName.trim(),
          zip: '',
        })

        setSubmitted(true)
      }
    } catch (err) {
      console.error('Business form submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  const firstName = fullName.trim().split(/\s+/)[0] || ''

  // ── Success State ──
  if (submitted) {
    return (
      <section id="business-form" className="py-14 md:py-20 bg-emerald-50/40">
        <div className="max-w-lg mx-auto px-5 md:px-12">
          <div className="bg-white rounded-2xl shadow-lg p-7 md:p-9 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-full mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h3 className="font-heading font-bold text-[22px] tracking-[-0.02em] text-slate-900 mb-2">
              You&apos;re all set{firstName ? `, ${firstName}` : ''}.
            </h3>
            <p className="text-[15px] font-body text-slate-500 mb-6 leading-relaxed">
              A ShieldHome Business Pro will call you at <strong className="text-slate-700">{phone}</strong> within 2 hours.
            </p>

            {/* Content Offer */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mb-5 text-left">
              <p className="text-[13px] font-heading font-semibold text-slate-700 mb-2">
                While you wait — grab the free guide:
              </p>
              <p className="text-[13px] font-body text-slate-600 mb-3">
                📋 &ldquo;The 5 Security Mistakes Business Owners Make (And How to Fix All of Them in Under a Day)&rdquo;
              </p>
              <button
                onClick={() => pushDataLayer('content_offer_download', { content: 'business_security_guide' })}
                className="text-emerald-600 hover:text-emerald-700 font-heading font-semibold text-[13px] underline underline-offset-2"
              >
                Download Free Guide →
              </button>
            </div>

            <p className="text-[13px] font-body text-slate-500">
              Have questions now? Call{' '}
              <a href="tel:+18016166301" className="text-emerald-600 hover:text-emerald-700 font-medium">
                (801) 616-6301
              </a>
            </p>
          </div>
        </div>
      </section>
    )
  }

  // ── Form ──
  return (
    <section ref={ref} id="business-form" className="py-14 md:py-20 bg-emerald-50/40">
      <div className="max-w-lg mx-auto px-5 md:px-12">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-[22px] md:text-[32px] tracking-[-0.03em] text-slate-900 mb-2 md:mb-3">
            Claim Your Free Business Security Audit
          </h2>
          <p className="text-[13px] md:text-[15px] font-body text-slate-500 max-w-md mx-auto">
            We&apos;ll review your current setup, identify coverage gaps, and show you exactly what you&apos;re overpaying.
            Takes 8 minutes by phone. No pressure, no obligation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Full Name */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border text-slate-900 placeholder-slate-400 transition-all duration-200 text-[16px] font-body bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 ${errors.fullName ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'}`}
            />
            {errors.fullName && <p className="text-[12px] font-body text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Phone */}
          <div className="mb-5">
            <input
              type="tel"
              placeholder="(801) 000-0000"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              className={`w-full px-4 py-3 rounded-lg border text-slate-900 placeholder-slate-400 transition-all duration-200 text-[16px] font-body bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 ${errors.phone ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'}`}
            />
            {errors.phone && <p className="text-[12px] font-body text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Current Provider (optional radio) */}
          <div className="mb-5">
            <p className="text-[12px] font-heading font-semibold text-slate-500 uppercase tracking-[0.1em] mb-2.5">
              Current provider <span className="text-slate-400 normal-case tracking-normal">(optional)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {providers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentProvider(currentProvider === p ? null : p)}
                  className={`px-3.5 py-2 rounded-lg border text-[13px] font-body transition-all duration-200 ${
                    currentProvider === p
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-heading font-semibold text-[15px] md:text-[16px] rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)] flex items-center justify-center gap-2"
          >
            {loading ? <Spinner /> : 'Claim My Free Business Audit →'}
          </button>

          {/* Trust Strip */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center gap-2 text-[12px] font-body text-slate-500">
              <Lock size={13} className="text-slate-400 flex-shrink-0" />
              Your information is never sold or shared.
            </div>
            <div className="flex items-center gap-2 text-[12px] font-body text-slate-500">
              <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
              A Business Pro calls you within 2 business hours.
            </div>
            <div className="flex items-center gap-2 text-[12px] font-body text-slate-500">
              <Shield size={13} className="text-emerald-500 flex-shrink-0" />
              Protected by our 30-Day Satisfaction Guarantee.
            </div>
            <div className="flex items-center gap-2 text-[12px] font-body text-slate-500">
              <Star size={13} className="text-amber-400 fill-amber-400 flex-shrink-0" />
              4.8/5 from 58,000+ verified reviews.
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

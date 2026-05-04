'use client'

import { useState, useEffect } from 'react'
import { Star, Phone, Lock, CheckCircle } from 'lucide-react'
import { captureTrackingData, type TrackingData } from '@/lib/utm'
import { pushDataLayer, fireMetaEvent, pushEnhancedConversions } from '@/lib/google-tracking'

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

const BUSINESS_TYPES = [
  'Retail / Small Business',
  'Office / Professional Services',
  'Warehouse / Industrial',
  'Restaurant / Food Service',
  'Multi-Family / Property Management',
  'Other',
]

const PROVIDERS = ['ADT', 'Ring', 'SimpliSafe', 'Brinks', 'Vivint (upgrading)', 'None Currently', 'Other']
const LOCATIONS = ['1', '2–3', '4–10', '10+']
const MONTHS_REMAINING = ['No contract', 'Less than 6 months', '6–12 months', '12–24 months', '24+ months']

interface BusinessHeroProps {
  h1: string
  subhead: string
  kw?: string
}

export default function BusinessHero({ h1, subhead, kw }: BusinessHeroProps) {
  const [step, setStep] = useState<1 | 2 | 'done'>(1)
  const [leadId, setLeadId] = useState<string | null>(null)

  // Step 1
  const [businessType, setBusinessType] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({})
  const [step1Loading, setStep1Loading] = useState(false)

  // Step 2
  const [currentProvider, setCurrentProvider] = useState('')
  const [numLocations, setNumLocations] = useState('')
  const [monthsRemaining, setMonthsRemaining] = useState('')
  const [step2Loading, setStep2Loading] = useState(false)

  const [tracking, setTracking] = useState<TrackingData | null>(null)

  useEffect(() => {
    setTracking(captureTrackingData())
    // Capture gclid
    const urlParams = new URLSearchParams(window.location.search)
    const gclid = urlParams.get('gclid')
    if (gclid) {
      sessionStorage.setItem('gclid', gclid)
      document.cookie = `_gclid=${gclid}; max-age=2592000; path=/`
    }
  }, [])

  function fireBeginCheckout() {
    fireMetaEvent('InitiateCheckout', { content_name: 'business_hero_form', content_category: 'commercial' })
  }

  function validateStep1(): boolean {
    const errs: Record<string, string> = {}
    if (!businessType) errs.businessType = 'Please select your business type'
    if (!fullName.trim()) errs.fullName = 'Please enter your name'
    if (phone.replace(/\D/g, '').length < 10) errs.phone = 'Please enter a valid phone number'
    setStep1Errors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateStep1()) return
    setStep1Loading(true)

    try {
      const res = await fetch('/api/leads/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.replace(/\D/g, ''),
          businessType,
          kwParam: kw || null,
          ...tracking,
          landingPage: '/business',
        }),
      })
      const result = await res.json()

      if (result.success) {
        setLeadId(result.leadId)

        // generate_lead — primary Google Ads conversion
        pushDataLayer('generate_lead', {
          event_category: 'business_lead',
          value: 900,
          currency: 'USD',
          business_type: businessType,
        })
        fireMetaEvent('Lead', { content_name: 'business_lead', content_category: 'commercial', value: 50, currency: 'USD' })

        const firstName = fullName.trim().split(/\s+/)[0] || ''
        pushEnhancedConversions({
          email: '',
          phone: phone.replace(/\D/g, ''),
          name: fullName.trim(),
          zip: '',
        })

        setStep(2)
      }
    } catch (err) {
      console.error('Hero step 1 error:', err)
    } finally {
      setStep1Loading(false)
    }
  }

  async function handleStep2Submit(e: React.FormEvent) {
    e.preventDefault()
    if (!leadId) return
    setStep2Loading(true)

    try {
      await fetch('/api/leads/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          currentProvider: currentProvider || null,
          numLocations: numLocations || null,
          monthsRemaining: monthsRemaining || null,
          businessType,
        }),
      })

      pushDataLayer('qualify_lead', {
        event_category: 'business_lead',
        current_provider: currentProvider || 'none',
        num_locations: numLocations,
        months_remaining: monthsRemaining,
      })

      setStep('done')
    } catch (err) {
      console.error('Hero step 2 error:', err)
      setStep('done')
    } finally {
      setStep2Loading(false)
    }
  }

  const firstName = fullName.trim().split(/\s+/)[0] || ''

  const selectClass = (hasError?: boolean) =>
    `w-full px-3.5 py-3 rounded-lg border text-slate-900 text-[15px] font-body bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-colors duration-200 ${hasError ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'}`

  const inputClass = (hasError?: boolean) =>
    `w-full px-3.5 py-3 rounded-lg border text-slate-900 placeholder-slate-400 text-[15px] font-body bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-colors duration-200 ${hasError ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'}`

  return (
    <section className="bg-slate-900 pt-6 pb-10 md:pt-10 md:pb-16">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-[55%_45%] gap-8 md:gap-12 items-start">

          {/* ── Left: Copy ── */}
          <div className="pt-2 md:pt-4">
            {/* Eyebrow */}
            <span className="inline-block text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full border mb-4 md:mb-5" style={{ color: 'var(--color-brass-300)', borderColor: 'rgba(232,203,167,0.25)', backgroundColor: 'rgba(232,203,167,0.06)' }}>
              Commercial &amp; Business Security — Smart Home Security Specialists
            </span>

            {/* Trust strip */}
            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-body tracking-[0.04em] uppercase mb-4 md:mb-5">
              <span className="flex items-center gap-1">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                58,000+ reviews
              </span>
              <span className="text-slate-700">|</span>
              <span>BBB A+</span>
              <span className="text-slate-700">|</span>
              <span>Smart Home Security Specialists</span>
            </div>

            {/* H1 — dynamic */}
            <h1 className="font-heading font-bold text-[28px] md:text-[40px] lg:text-[46px] tracking-[-0.03em] leading-[1.08] text-white mb-4 md:mb-5">
              {h1}
            </h1>

            {/* Subhead — dynamic */}
            <p className="text-[14px] md:text-[16px] font-body text-slate-400 leading-[1.65] mb-4 md:mb-5 max-w-[520px]">
              {subhead}
            </p>

            {/* Inline trust line */}
            <p className="text-[13px] md:text-[14px] font-body text-emerald-400/80 mb-6 md:mb-8">
              Switching from ADT? We&apos;ll buy out your contract up to $1,000.
            </p>

            {/* Stats strip — desktop only */}
            <div className="hidden md:grid grid-cols-4 gap-3">
              {[
                { value: '8-Second', label: 'Monitoring Response (vs. 60-sec avg)' },
                { value: '$0 Down', label: 'Equipment & Installation' },
                { value: 'Up to $1K', label: 'Contract Buyout' },
                { value: '30 Days', label: 'Satisfaction Guarantee' },
              ].map((stat) => (
                <div key={stat.label} className="text-center py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <p className="font-heading font-bold text-[15px] text-emerald-400 tracking-[-0.02em]">{stat.value}</p>
                  <p className="text-[10px] font-body text-slate-500 mt-0.5 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Phone CTA — mobile */}
            <div className="md:hidden mt-4 text-center">
              <a
                href="tel:+18013486050"
                onClick={() => pushDataLayer('phone_call_click', { location: 'hero_mobile' })}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 text-[13px] font-body transition-colors"
              >
                <Phone size={14} />
                Or call (801) 348-6050
              </a>
            </div>
          </div>

          {/* ── Right: Form card ── */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.25)] p-5 md:p-6">

              {step === 'done' ? (
                /* ── Success State ── */
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-full mb-4">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-[20px] tracking-[-0.02em] text-slate-900 mb-2">
                    You&apos;re all set{firstName ? `, ${firstName}` : ''}.
                  </h3>
                  <p className="text-[14px] font-body text-slate-500 mb-4 leading-relaxed">
                    A ShieldHome Business Pro will call you at{' '}
                    <strong className="text-slate-700">{phone}</strong> within 2 business hours.
                  </p>
                  <p className="text-[13px] font-body text-slate-500">
                    Questions right now? Call{' '}
                    <a href="tel:+18013486050" className="text-emerald-600 font-medium">(801) 348-6050</a>
                  </p>
                </div>

              ) : step === 2 ? (
                /* ── Step 2 ── */
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1">
                      <div className="w-6 h-1 rounded-full bg-emerald-500" />
                      <div className="w-6 h-1 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-[0.1em]">Step 2 of 2 — Quick qualifiers</p>
                  </div>
                  <p className="text-[15px] font-heading font-bold text-slate-900 mb-4">
                    One more thing to tailor your quote:
                  </p>
                  <form onSubmit={handleStep2Submit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-heading font-semibold text-slate-500 uppercase tracking-[0.1em] mb-1.5">Current Security Provider</label>
                      <select value={currentProvider} onChange={e => setCurrentProvider(e.target.value)} className={selectClass()}>
                        <option value="">Select provider (optional)</option>
                        {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-heading font-semibold text-slate-500 uppercase tracking-[0.1em] mb-1.5">Number of Locations</label>
                      <select value={numLocations} onChange={e => setNumLocations(e.target.value)} className={selectClass()}>
                        <option value="">Select locations (optional)</option>
                        {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-heading font-semibold text-slate-500 uppercase tracking-[0.1em] mb-1.5">Months Remaining on Contract</label>
                      <select value={monthsRemaining} onChange={e => setMonthsRemaining(e.target.value)} className={selectClass()}>
                        <option value="">Select (optional)</option>
                        {MONTHS_REMAINING.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={step2Loading}
                      className="w-full py-3.5 mt-1 rounded-lg font-heading font-bold text-[15px] text-white disabled:opacity-60 flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,200,83,0.35)]"
                      style={{ backgroundColor: '#00C853' }}
                    >
                      {step2Loading ? <Spinner /> : 'Submit — Have a Pro Call Me →'}
                    </button>
                    <button type="button" onClick={() => setStep('done')} className="w-full text-center text-[12px] text-slate-400 hover:text-slate-600 py-1">
                      Skip — I&apos;ll share details on the call
                    </button>
                  </form>
                </>

              ) : (
                /* ── Step 1 ── */
                <>
                  <div className="flex items-center gap-2 mb-3.5">
                    <div className="flex gap-1">
                      <div className="w-6 h-1 rounded-full bg-emerald-500" />
                      <div className="w-6 h-1 rounded-full bg-slate-200" />
                    </div>
                    <p className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-[0.1em]">Step 1 of 2</p>
                  </div>
                  <p className="text-[16px] md:text-[17px] font-heading font-bold text-slate-900 mb-4 tracking-[-0.01em]">
                    Get My Free Business Quote
                  </p>
                  <form onSubmit={handleStep1Submit} className="space-y-3">
                    <div>
                      <select
                        value={businessType}
                        onChange={e => setBusinessType(e.target.value)}
                        onFocus={fireBeginCheckout}
                        className={selectClass(!!step1Errors.businessType)}
                      >
                        <option value="">Business Type *</option>
                        {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {step1Errors.businessType && <p className="text-[11px] text-red-500 mt-1">{step1Errors.businessType}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="First name *"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className={inputClass(!!step1Errors.fullName)}
                      />
                      {step1Errors.fullName && <p className="text-[11px] text-red-500 mt-1">{step1Errors.fullName}</p>}
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone number *"
                        value={phone}
                        onChange={e => setPhone(formatPhone(e.target.value))}
                        className={inputClass(!!step1Errors.phone)}
                      />
                      {step1Errors.phone && <p className="text-[11px] text-red-500 mt-1">{step1Errors.phone}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={step1Loading}
                      className="w-full py-3.5 mt-1 rounded-lg font-heading font-bold text-[15px] text-white disabled:opacity-60 flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,200,83,0.35)]"
                      style={{ backgroundColor: '#00C853' }}
                    >
                      {step1Loading ? <Spinner /> : 'Get My Free Business Quote →'}
                    </button>
                  </form>
                </>
              )}

              {/* Micro trust signals — always visible except done */}
              {step !== 'done' && (
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] font-body text-slate-400">
                    <Lock size={11} className="text-slate-400 flex-shrink-0" />
                    Your info is never sold or shared.
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-body text-slate-400">
                    <CheckCircle size={11} className="text-emerald-500 flex-shrink-0" />
                    A Business Pro calls within 2 business hours.
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-body text-slate-400">
                    <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                    4.8/5 from 58,000+ verified reviews.
                  </div>
                </div>
              )}
            </div>

            {/* Phone CTA — desktop */}
            <div className="hidden md:flex items-center justify-center gap-2 mt-4">
              <a
                href="tel:+18013486050"
                onClick={() => pushDataLayer('phone_call_click', { location: 'hero_desktop' })}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-[13px] font-body transition-colors"
              >
                <Phone size={14} />
                Or call us directly: (801) 348-6050
              </a>
            </div>
          </div>
        </div>

        {/* Stats strip — mobile only */}
        <div className="md:hidden grid grid-cols-4 gap-2 mt-8">
          {[
            { value: '8 sec', label: 'Response' },
            { value: '$0', label: 'Down' },
            { value: '$1K', label: 'Buyout' },
            { value: '30 Day', label: 'Guarantee' },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <p className="font-heading font-bold text-[14px] text-emerald-400">{stat.value}</p>
              <p className="text-[9px] font-body text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

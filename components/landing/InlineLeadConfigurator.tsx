'use client'

import { useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, CheckCircle, ChevronDown, ChevronLeft, Lock, Shield, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTracking } from '@/lib/utm'
import { genEventId, firePixelEvent, fireCapi } from '@/lib/meta-pixel'

type HomeTypeValue = 'SINGLE_FAMILY' | 'TOWNHOME' | 'CONDO' | 'APARTMENT' | 'OTHER'
type CreditTierValue = '650_PLUS' | 'BUILDING'

// The DB's PropertyType enum only has HOUSE / TOWNHOME / CONDO_APARTMENT / BUSINESS,
// so Condo and Apartment collapse to the same bucket and Other maps to null. The
// original selection is preserved via the `segment` field for reporting.
const HOME_TYPES: { value: HomeTypeValue; label: string; propertyType: 'HOUSE' | 'TOWNHOME' | 'CONDO_APARTMENT' | null }[] = [
  { value: 'SINGLE_FAMILY', label: 'Single Family', propertyType: 'HOUSE' },
  { value: 'TOWNHOME', label: 'Townhome', propertyType: 'TOWNHOME' },
  { value: 'CONDO', label: 'Condo', propertyType: 'CONDO_APARTMENT' },
  { value: 'APARTMENT', label: 'Apartment', propertyType: 'CONDO_APARTMENT' },
  { value: 'OTHER', label: 'Other', propertyType: null },
]

const CREDIT_TIERS: { value: CreditTierValue; label: string; enumValue: 'ABOVE_650' | 'BELOW_650' }[] = [
  { value: '650_PLUS', label: '650+', enumValue: 'ABOVE_650' },
  { value: 'BUILDING', label: 'Below 650', enumValue: 'BELOW_650' },
]

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name required').max(50),
  phone: z.string().min(10, 'Valid phone required').max(20),
})
type ContactForm = z.infer<typeof contactSchema>

interface InlineLeadConfiguratorProps {
  className?: string
  isModal?: boolean
  onClose?: () => void
  variant?: 'light' | 'dark'
  headline?: string
  ctaLabel?: string
}

function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1)
  digits = digits.slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export default function InlineLeadConfigurator({
  className,
  isModal = false,
  onClose,
  variant = 'light',
  headline,
  ctaLabel = 'See My Options',
}: InlineLeadConfiguratorProps) {
  const router = useRouter()
  const uid = useId()
  const [sessionEventId] = useState(() => genEventId())
  const [screen, setScreen] = useState<1 | 2>(1)
  const [homeType, setHomeType] = useState<HomeTypeValue | ''>('')
  const [homeTypeError, setHomeTypeError] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [zipError, setZipError] = useState('')
  const [creditTier, setCreditTier] = useState<CreditTierValue | ''>('')
  const [creditTierError, setCreditTierError] = useState('')
  const [phoneDisplay, setPhoneDisplay] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [belowSuccess, setBelowSuccess] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  function handleScreen1Submit(e: React.FormEvent) {
    e.preventDefault()
    let ok = true
    if (!homeType) {
      setHomeTypeError('Please select a home type')
      ok = false
    }
    if (!/^\d{5}$/.test(zipCode)) {
      setZipError('5-digit ZIP required')
      ok = false
    }
    if (!ok) return
    setHomeTypeError('')
    setZipError('')
    if (typeof window !== 'undefined') {
      const dl = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer
      dl?.push({ event: 'configurator_step', step: 1, home_type: homeType, zip: zipCode })
    }
    setScreen(2)
    // Scroll the top of the card into view so Step 2 fields aren't clipped
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function handleBack() {
    setScreen(1)
    setSubmitError('')
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value)
    setPhoneDisplay(formatted)
    const digits = formatted.replace(/\D/g, '')
    setValue('phone', digits, { shouldValidate: digits.length >= 10 })
  }

  function selectCredit(value: CreditTierValue) {
    setCreditTier(value)
    setCreditTierError('')
    // Auto-submit on pill tap: react-hook-form validates first. If name/phone
    // aren't filled yet, validation errors appear and onSubmit doesn't run —
    // the user sees what's missing and taps the pill again (or the submit
    // button) once fixed.
    void handleSubmit((contact) => submitLead(contact, value))()
  }

  async function onSubmit(contact: ContactForm) {
    if (!creditTier) {
      setCreditTierError('Please select a credit range')
      return
    }
    await submitLead(contact, creditTier)
  }

  async function submitLead(contact: ContactForm, tier: CreditTierValue) {
    setSubmitting(true)
    setSubmitError('')

    const homeTypeEntry = HOME_TYPES.find(h => h.value === homeType)
    const creditEntry = CREDIT_TIERS.find(c => c.value === tier)
    if (!homeTypeEntry || !creditEntry) {
      setSubmitting(false)
      return
    }
    const tracking = getTracking()

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: contact.firstName,
          phone: contact.phone,
          zipCode,
          propertyType: homeTypeEntry.propertyType,
          creditScoreRange: creditEntry.enumValue,
          segment: `configurator:${homeType.toLowerCase()}`,
          tcpaConsent: true,
          ...tracking,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')

      const leadEventId = `${sessionEventId}_lead`
      firePixelEvent('Lead', leadEventId)
      fireCapi('Lead', leadEventId, {
        phone: contact.phone,
        firstName: contact.firstName,
        zipCode,
      })

      if (typeof window !== 'undefined') {
        const dl = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer
        dl?.push({
          event: 'lead_submitted',
          source: 'configurator',
          home_type: homeType,
          credit_tier: tier,
        })
      }

      if (creditEntry.enumValue === 'BELOW_650') {
        setBelowSuccess(true)
        return
      }

      router.push('/thank-you')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setSubmitError(message)
      setSubmitting(false)
    }
  }

  const cardBg = variant === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
  const labelColor = variant === 'dark' ? 'text-slate-300' : 'text-slate-700'
  const subtleColor = variant === 'dark' ? 'text-slate-400' : 'text-slate-500'

  const card = (
    <div
      ref={cardRef}
      className={cn(
        'w-full rounded-2xl border shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden',
        cardBg,
        className,
      )}
    >
      <div className="relative">
        {/* Screen 1 → Screen 2 transition */}
        <div
          className={cn(
            'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            screen === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none absolute inset-0',
          )}
          aria-hidden={screen !== 1}
        >
          {belowSuccess ? null : renderScreen1()}
        </div>

        <div
          className={cn(
            'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            screen === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none absolute inset-0',
          )}
          aria-hidden={screen !== 2}
        >
          {belowSuccess ? renderBelowSuccess() : renderScreen2()}
        </div>
      </div>
    </div>
  )

  function renderScreen1() {
    return (
      <form onSubmit={handleScreen1Submit} className="p-5 md:p-6">
        {/* Step indicator — endowed progress */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn('text-[11px] font-heading font-semibold uppercase tracking-[0.1em]', subtleColor)}>
            Step 1 of 2
          </span>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-6 rounded-full bg-emerald-500" />
            <div className="h-1.5 w-6 rounded-full bg-slate-200" />
          </div>
        </div>

        {headline && (
          <h3 className={cn(
            'font-heading font-bold text-[17px] md:text-[19px] tracking-[-0.01em] mb-3',
            variant === 'dark' ? 'text-white' : 'text-slate-900',
          )}>
            {headline}
          </h3>
        )}

        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1 min-w-0">
            <label
              htmlFor={`${uid}-home-type`}
              className={cn('block text-[12px] font-medium mb-1.5', labelColor)}
            >
              Home Type
            </label>
            <div className="relative">
              <select
                id={`${uid}-home-type`}
                value={homeType}
                onChange={(e) => {
                  setHomeType(e.target.value as HomeTypeValue)
                  setHomeTypeError('')
                }}
                className={cn(
                  'w-full appearance-none px-4 pr-10 rounded-lg border text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all',
                  homeTypeError ? 'border-red-300 bg-red-50' : 'border-slate-300',
                )}
                style={{ fontSize: '16px', height: '52px' }}
                aria-invalid={!!homeTypeError}
              >
                <option value="">Select</option>
                {HOME_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="md:w-32 md:flex-shrink-0">
            <label
              htmlFor={`${uid}-zip`}
              className={cn('block text-[12px] font-medium mb-1.5', labelColor)}
            >
              ZIP Code
            </label>
            <input
              id={`${uid}-zip`}
              type="text"
              inputMode="numeric"
              maxLength={5}
              autoComplete="postal-code"
              placeholder="90210"
              value={zipCode}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 5)
                setZipCode(digits)
                if (zipError) setZipError('')
              }}
              className={cn(
                'w-full px-4 rounded-lg border text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all',
                zipError ? 'border-red-300 bg-red-50' : 'border-slate-300',
              )}
              style={{ fontSize: '16px', height: '52px' }}
              aria-invalid={!!zipError}
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto md:flex-shrink-0 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 px-7"
            style={{ fontSize: '16px', height: '52px' }}
          >
            {ctaLabel}
            <ArrowRight size={18} />
          </button>
        </div>
        {(homeTypeError || zipError) && (
          <p className="text-[12px] text-red-600 mt-2">{homeTypeError || zipError}</p>
        )}
      </form>
    )
  }

  function renderScreen2() {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={handleBack}
            className={cn('inline-flex items-center gap-1 text-[13px] font-medium hover:opacity-80 transition-opacity', subtleColor)}
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <span className={cn('text-[11px] font-heading font-semibold uppercase tracking-[0.1em]', subtleColor)}>
              Step 2 of 2
            </span>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-6 rounded-full bg-emerald-500" />
              <div className="h-1.5 w-6 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>

        <p className={cn('text-[13px] mb-4', subtleColor)}>
          Fill in your info below — a Smart Home Pro will call or text you shortly to walk you through your options.
        </p>

        <div className="space-y-3">
          <div>
            <label htmlFor={`${uid}-first-name`} className={cn('block text-[12px] font-medium mb-1.5', labelColor)}>
              First Name
            </label>
            <input
              id={`${uid}-first-name`}
              type="text"
              autoComplete="given-name"
              placeholder="Jane"
              className={cn(
                'w-full px-4 rounded-lg border text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all',
                errors.firstName ? 'border-red-300 bg-red-50' : 'border-slate-300',
              )}
              style={{ fontSize: '16px', height: '48px' }}
              {...register('firstName')}
            />
            {errors.firstName && <p className="text-[11px] text-red-600 mt-1">{errors.firstName.message}</p>}
          </div>

          <div>
            <label htmlFor={`${uid}-phone`} className={cn('block text-[12px] font-medium mb-1.5', labelColor)}>
              Phone Number
            </label>
            <input
              id={`${uid}-phone`}
              type="tel"
              autoComplete="tel"
              placeholder="(555) 555-5555"
              value={phoneDisplay}
              onChange={handlePhoneChange}
              className={cn(
                'w-full px-4 rounded-lg border text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all',
                errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-300',
              )}
              style={{ fontSize: '16px', height: '48px' }}
            />
            <input type="hidden" {...register('phone')} />
            {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className={cn('block text-[12px] font-medium mb-1.5', labelColor)}>
              Credit Score
            </label>
            <p className={cn('text-[10px] mb-2', subtleColor)}>
              Selecting a credit range submits your info and consent to be contacted per the terms below.
            </p>
            <div
              role="radiogroup"
              aria-label="Credit score range"
              className="grid grid-cols-2 gap-2"
            >
              {CREDIT_TIERS.map((tier) => {
                const selected = creditTier === tier.value
                return (
                  <button
                    key={tier.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => selectCredit(tier.value)}
                    disabled={submitting}
                    className={cn(
                      'w-full px-4 rounded-lg border-2 font-heading font-semibold text-[14px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
                      selected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/40',
                    )}
                    style={{ height: '48px' }}
                  >
                    {tier.label}
                  </button>
                )
              })}
            </div>
            {creditTierError && <p className="text-[11px] text-red-600 mt-1">{creditTierError}</p>}
          </div>

          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-700">
              {submitError}
            </div>
          )}

          <div className={cn('flex items-center justify-center gap-1.5 pt-1', subtleColor)}>
            <Lock size={12} className="text-emerald-500" />
            <span className="text-[11px]">Your info is secure · 256-bit SSL</span>
          </div>

          <p className={cn('text-[10px] leading-[1.5] text-center px-1', subtleColor)}>
            By selecting a credit range above, I agree to receive calls, texts, and emails from
            ShieldHome Pro and Vivint Smart Home at the number provided, including by autodialer.
            Consent is not a condition of purchase. Msg frequency varies. Msg &amp; data rates may apply.
            Reply STOP to unsubscribe. View our{' '}
            <a href="/privacy" className="underline hover:opacity-80 transition-opacity">Privacy Policy</a>
            {' '}&amp;{' '}
            <a href="/terms" className="underline hover:opacity-80 transition-opacity">Terms of Service</a>.
          </p>
        </div>
      </form>
    )
  }

  function renderBelowSuccess() {
    return (
      <div className="p-8 md:p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-4">
          <CheckCircle size={28} className="text-emerald-600" />
        </div>
        <h3 className={cn(
          'font-heading font-bold text-[20px] md:text-[22px] tracking-[-0.02em] mb-2',
          variant === 'dark' ? 'text-white' : 'text-slate-900',
        )}>
          Thanks!
        </h3>
        <p className={cn(
          'text-[14px] md:text-[15px] font-body leading-[1.55] max-w-sm mx-auto',
          variant === 'dark' ? 'text-slate-300' : 'text-slate-600',
        )}>
          One of our team members will be in touch to explore your options.
        </p>
      </div>
    )
  }

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full sm:max-w-lg flex flex-col bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden" style={{ maxHeight: '95dvh' }}>
          <div className="flex items-center justify-between px-5 py-3 bg-slate-900">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-emerald-500" />
              <span className="text-white font-heading font-bold text-[14px]">Free Security Plan</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 min-h-0">
            {card}
          </div>
        </div>
      </div>
    )
  }

  return card
}

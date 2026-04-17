'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Phone, ShieldCheck } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import { getHeadlineVariant } from '@/lib/headlineVariants'
import { cn } from '@/lib/utils'

const heroSchema = z.object({
  firstName: z.string().min(1, 'Name required'),
  phone: z.string().min(10, 'Valid phone required'),
  zipCode: z.string().min(5, 'ZIP required'),
})
type HeroForm = z.infer<typeof heroSchema>

interface HeroDealsProps {
  onQuizOpen: () => void
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

export default function HeroDeals({ onQuizOpen }: HeroDealsProps) {
  const searchParams = useSearchParams()
  const src = searchParams.get('src')
  const variant = getHeadlineVariant(src)

  const [phoneDisplay, setPhoneDisplay] = useState('')
  const [formStarted, setFormStarted] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<HeroForm>({
    resolver: zodResolver(heroSchema),
  })

  function trackPhoneClick() {
    if (typeof window !== 'undefined') {
      if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'phone_click' })
    }
  }

  function handleFormFocus() {
    if (formStarted) return
    setFormStarted(true)
    if (typeof window !== 'undefined') {
      if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'hero_form_started' })
    }
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value)
    setPhoneDisplay(formatted)
    const digits = formatted.replace(/\D/g, '')
    setValue('phone', digits, { shouldValidate: digits.length >= 10 })
  }

  function onSubmit(data: HeroForm) {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(
          'shieldhome_hero_prefill',
          JSON.stringify({ firstName: data.firstName, phone: data.phone, zipCode: data.zipCode })
        )
      } catch {
        // Ignore quota errors
      }

      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'hero_form_started_quiz',
          zip: data.zipCode,
        })
      }
    }

    // Lead is NOT submitted here — only after the full quiz completes.
    onQuizOpen()
  }

  const FormCard = (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocus={handleFormFocus}
      className="w-full bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-5 md:p-6 border border-slate-100"
    >
      {/* Progress bar — Endowed Progress Effect */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-heading font-semibold text-slate-500 uppercase tracking-[0.08em]">
            Step 1 of 3 · Your Information
          </span>
          <span className="text-[11px] font-heading font-bold text-emerald-600">20%</span>
        </div>
        <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '20%' }} />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[12px] font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            className={cn(
              'w-full px-4 rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all',
              errors.firstName ? 'border-red-300 bg-red-50' : 'border-slate-300'
            )}
            style={{ fontSize: '16px', height: '48px' }}
            {...register('firstName')}
          />
          {errors.firstName && <p className="text-[11px] text-red-600 mt-1">{errors.firstName.message}</p>}
        </div>

        <div>
          <label className="block text-[12px] font-medium text-slate-700 mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="(555) 555-5555"
            value={phoneDisplay}
            onChange={handlePhoneChange}
            autoComplete="tel"
            className={cn(
              'w-full px-4 rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all',
              errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-300'
            )}
            style={{ fontSize: '16px', height: '48px' }}
          />
          <input type="hidden" {...register('phone')} />
          {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-[12px] font-medium text-slate-700 mb-1">ZIP Code</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="90210"
            maxLength={5}
            autoComplete="postal-code"
            className={cn(
              'w-full px-4 rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all',
              errors.zipCode ? 'border-red-300 bg-red-50' : 'border-slate-300'
            )}
            style={{ fontSize: '16px', height: '48px' }}
            {...register('zipCode')}
          />
          {errors.zipCode && <p className="text-[11px] text-red-600 mt-1">{errors.zipCode.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-bold rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(5,150,105,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          style={{ fontSize: '17px', height: '56px' }}
        >
          See If I Qualify →
        </button>

        <div className="flex items-center justify-center gap-1.5 text-slate-500">
          <Lock size={12} className="text-emerald-500" />
          <span className="text-[11px]">
            Your info is secure · We&apos;ll call you back in under 2 minutes
          </span>
        </div>

        <p className="text-[10px] text-slate-400 leading-[1.5] text-center px-1">
          By clicking &ldquo;See If I Qualify,&rdquo; I agree to receive calls, texts, and emails from
          ShieldHome Pro and Vivint Smart Home at the number provided, including by autodialer.
          Consent is not a condition of purchase. Msg &amp; data rates may apply. Reply STOP to opt out.
        </p>
      </div>

      <div className="border-t border-slate-100 mt-4 pt-3 text-center">
        <a
          href={`tel:${PHONE_NUMBER_RAW}`}
          onClick={trackPhoneClick}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900"
        >
          <Phone size={13} />
          Prefer to talk? Call {PHONE_NUMBER}
        </a>
      </div>
    </form>
  )

  return (
    <section className="relative overflow-hidden bg-slate-900">
      {/* Background image — desktop only, behind right column */}
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[40%] pointer-events-none opacity-30">
        <Image
          src="/images/google/vivint-products-hero.jpg"
          alt=""
          fill
          priority
          className="object-contain object-right"
          sizes="40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden relative">
        {/* Mobile product image — top of hero for credibility */}
        <div className="relative h-[180px] overflow-hidden">
          <Image
            src="/images/google/vivint-products-hero.jpg"
            alt="Vivint smart home security lineup"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/20 to-slate-900" />
        </div>

        <div className="pt-3 pb-6 px-4 -mt-6 relative">
          {/* Pre-headline pill */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2.5 py-1 mb-3">
            <ShieldCheck size={11} className="text-emerald-400" />
            <span className="text-[10px] font-heading font-semibold text-emerald-300 uppercase tracking-[0.1em]">
              {variant.preHeadline}
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-white font-heading font-bold text-[24px] leading-[1.15] tracking-[-0.025em] mb-2">
            {variant.h1Mobile}
          </h1>

          {/* Subheadline */}
          <p className="text-slate-300 text-[13px] leading-[1.5] mb-4 font-body">
            {variant.subheadline}
          </p>

          {/* Form Step 1 */}
          {FormCard}

          {/* Trust strip */}
          <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 font-body tracking-[0.04em] uppercase mt-4">
            <span className="flex items-center gap-1">
              <span className="text-amber-400 text-sm">★</span>
              58K+ reviews
            </span>
            <span className="text-slate-700">|</span>
            <span>BBB A+</span>
            <span className="text-slate-700">|</span>
            <span>2M+ Homes</span>
          </div>
        </div>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:block relative">
        <div className="max-w-7xl mx-auto px-8 pt-16 pb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left column: copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1.5 mb-5">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span className="text-[11px] font-heading font-semibold text-emerald-300 uppercase tracking-[0.1em]">
                  {variant.preHeadline}
                </span>
              </div>

              <h1 className="text-white font-heading font-bold text-[44px] lg:text-[52px] leading-[1.05] tracking-[-0.03em] mb-4">
                {variant.h1Desktop}
              </h1>

              <p className="text-slate-300 text-[17px] leading-[1.55] mb-6 font-body max-w-[520px]">
                {variant.subheadline}
              </p>

              <ul className="space-y-2.5 mb-6">
                {[
                  '$0 Down with Qualifying Purchase',
                  'Free Professional Install (Usually Same-Week)',
                  '60-Day Money-Back Guarantee',
                ].map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5 text-[15px] text-slate-200 font-body">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4 text-[12px] text-slate-400 font-body tracking-[0.04em] uppercase">
                <span className="flex items-center gap-1">
                  <span className="text-amber-400 text-sm">★</span>
                  4.8/5 · 58K+ reviews
                </span>
                <span className="text-slate-700">|</span>
                <span>BBB A+</span>
                <span className="text-slate-700">|</span>
                <span>2M+ Homes</span>
              </div>
            </div>

            {/* Right column: form card */}
            <div className="lg:pl-6">{FormCard}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

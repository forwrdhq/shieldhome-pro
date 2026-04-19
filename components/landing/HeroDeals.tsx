'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { getHeadlineVariant } from '@/lib/headlineVariants'
import InlineLeadConfigurator from '@/components/landing/InlineLeadConfigurator'

export default function HeroDeals() {
  const searchParams = useSearchParams()
  const src = searchParams.get('src')
  const variant = getHeadlineVariant(src)

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
          <InlineLeadConfigurator />

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
            <div className="lg:pl-6"><InlineLeadConfigurator /></div>
          </div>
        </div>
      </div>
    </section>
  )
}

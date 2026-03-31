'use client'

import Image from 'next/image'
import { Star, Phone } from 'lucide-react'

function scrollToForm() {
  document.querySelector('#business-form')?.scrollIntoView({ behavior: 'smooth' })
}

export default function BusinessHero() {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      {/* ── Desktop: Product image — full right side ── */}
      <div className="hidden md:block absolute top-0 right-0 bottom-0 w-[45%] pointer-events-none">
        <Image
          src="/images/google/vivint-products-hero.jpg"
          alt=""
          fill
          priority
          className="object-contain object-right"
          sizes="45vw"
        />
        <div className="absolute inset-y-0 left-0 w-[35%] bg-gradient-to-r from-slate-900 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/80 to-transparent" />
      </div>

      {/* ══════════════════════════════════════
          MOBILE — content then product image
          ══════════════════════════════════════ */}
      <div className="md:hidden relative">
        <div className="pt-12 pb-4 px-5">
          {/* Audience Callout */}
          <p className="text-[9px] font-heading font-bold uppercase tracking-[0.16em] text-amber-400 mb-3">
            ATTENTION: Small Business Owners, Restaurant Owners &amp; Property Managers
          </p>

          {/* Eyebrow Badge */}
          <span className="inline-block text-[9px] font-heading font-semibold uppercase tracking-[0.12em] px-3 py-1 rounded-full border mb-3" style={{ color: 'var(--color-brass-300)', borderColor: 'rgba(232,203,167,0.25)', backgroundColor: 'rgba(232,203,167,0.06)' }}>
            Commercial Security — No Markup
          </span>

          {/* H1 */}
          <h1 className="font-heading font-bold text-[24px] leading-[1.12] tracking-[-0.025em] text-white mb-3">
            Get Vivint&apos;s AI Business Security Installed{' '}
            <span className="text-emerald-400">FREE</span> — Stuck in a Contract? We&apos;ll Buy It Out{' '}
            <span style={{ color: 'var(--color-brass-300)' }}>Up to $1,000</span>
          </h1>

          {/* Subheadline */}
          <p className="text-slate-400 text-[13px] leading-[1.5] mb-4 font-body max-w-[320px]">
            Same AI-powered hardware. Same professional installation. No commercial markup — ever. We&apos;ll cover your switching costs.
          </p>

          {/* CTA */}
          <button
            onClick={scrollToForm}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-semibold text-[15px] rounded-lg transition-all duration-200"
          >
            Claim My Free Business Audit →
          </button>

          {/* Call link */}
          <div className="text-center mt-2.5">
            <a
              href="tel:+18016166301"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-[11px] font-body transition-colors duration-300"
            >
              Or call (801) 616-6301
            </a>
          </div>
        </div>

        {/* Product image — full bleed */}
        <div className="relative mt-3">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-900 to-transparent z-10 pointer-events-none" />
          <Image
            src="/images/google/vivint-products-hero.jpg"
            alt="Vivint AI-powered business security system — cameras, doorbell, smart lock, and hub"
            width={800}
            height={500}
            className="w-full h-auto"
            sizes="100vw"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>

        {/* Mobile Stats */}
        <div className="bg-slate-50 px-5 py-5">
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: '8 sec', label: 'Response' },
              { value: '$0', label: 'Down' },
              { value: '$1K', label: 'Buyout' },
              { value: '30 Day', label: 'Guarantee' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading font-bold text-[16px] text-emerald-600 tracking-[-0.02em]">{stat.value}</p>
                <p className="text-[9px] font-body text-slate-400 uppercase tracking-[0.04em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          DESKTOP — text left, product image right
          ══════════════════════════════════════ */}
      <div className="hidden md:block relative">
        <div className="max-w-6xl mx-auto px-8 pt-16 pb-20">
          <div className="max-w-[540px]">
            {/* Audience Callout */}
            <p className="text-[11px] font-heading font-bold uppercase tracking-[0.14em] text-amber-400 mb-4">
              ATTENTION: Small Business Owners, Restaurant Owners &amp; Property Managers
            </p>

            {/* Trust Bar */}
            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-body tracking-[0.04em] uppercase mb-5">
              <span className="flex items-center gap-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                58,000+ reviews
              </span>
              <span className="text-slate-700">|</span>
              <span>BBB A+</span>
              <span className="text-slate-700">|</span>
              <span>Vivint Authorized Partner</span>
            </div>

            {/* Eyebrow Badge */}
            <span className="inline-block text-[11px] font-heading font-semibold uppercase tracking-[0.14em] px-4 py-1.5 rounded-full border mb-5" style={{ color: 'var(--color-brass-300)', borderColor: 'rgba(232,203,167,0.25)', backgroundColor: 'rgba(232,203,167,0.06)' }}>
              Commercial &amp; Business Security — No Markup
            </span>

            {/* H1 — Godfather Offer */}
            <h1 className="font-heading font-bold text-[40px] lg:text-[46px] tracking-[-0.035em] leading-[1.08] text-white mb-5">
              Get Vivint&apos;s AI Business Security Installed{' '}
              <span className="text-emerald-400">FREE</span> — Stuck in a Contract? We&apos;ll Buy It Out{' '}
              <span style={{ color: 'var(--color-brass-300)' }}>Up to $1,000</span>
            </h1>

            {/* Subheadline */}
            <p className="text-[15px] font-body text-slate-400 leading-[1.6] mb-6 max-w-[460px]">
              Most commercial security providers charge businesses 30–50% more for identical equipment.
              We don&apos;t — and we&apos;ll cover your switching costs so moving costs you nothing.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={scrollToForm}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-semibold text-[15px] rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
              >
                Claim My Free Business Audit →
              </button>
              <a
                href="tel:+18016166301"
                className="flex items-center gap-2 px-5 py-3.5 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-heading font-medium text-[14px] rounded-lg transition-all duration-200"
              >
                <Phone size={16} />
                (801) 616-6301
              </a>
            </div>

            {/* Risk Line */}
            <p className="text-[12px] font-body text-slate-500 mb-8">
              No pressure. No obligation. Most quotes take 8 minutes by phone.
            </p>

            {/* Stats Strip */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: '8 sec', label: 'Avg. Monitoring Response' },
                { value: '$0 Down', label: 'Equipment & Installation' },
                { value: 'Up to $1K', label: 'Contract Buyout' },
                { value: '30 Days', label: 'Satisfaction Guarantee' },
              ].map((stat) => (
                <div key={stat.label} className="text-center py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <p className="font-heading font-bold text-[18px] text-emerald-400 tracking-[-0.02em]">{stat.value}</p>
                  <p className="text-[10px] font-body text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

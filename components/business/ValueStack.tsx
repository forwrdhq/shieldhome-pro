'use client'

import Image from 'next/image'
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal'

function scrollToForm() {
  document.querySelector('#business-form')?.scrollIntoView({ behavior: 'smooth' })
}

const stackItems = [
  { item: 'Professional Vivint system design for your specific business layout', value: 299 },
  { item: 'Full hardware installation by certified Vivint technician', value: 399 },
  { item: 'AI Smart Deter camera — free upgrade with qualifying system', value: 299 },
  { item: 'Contract buyout — we cover up to $1,000 of your current contract', value: 1000 },
  { item: 'Insurance documentation package for 5–20% annual premium discount', value: 500 },
  { item: 'Section 179 tax deduction guidance on full equipment cost', value: 500 },
  { item: '24/7 in-house Vivint professional monitoring — 8-second response', value: 0, label: 'From $39.99/mo' },
  { item: 'Lifetime Vivint equipment warranty', value: 0, label: '$0 risk to you' },
]

const totalValue = stackItems.reduce((sum, item) => sum + item.value, 0)

export default function ValueStack() {
  const headingRef = useScrollReveal<HTMLDivElement>()
  const listRef = useStaggerReveal<HTMLDivElement>(60)

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div ref={headingRef} className="text-center mb-8 md:mb-14">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
            The Full Offer
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900 mb-2 md:mb-3">
            Everything You Get When You Claim Your Free Business Security Audit
          </h2>
          <p className="text-[13px] md:text-[15px] font-body text-slate-400 max-w-md mx-auto">
            Our exclusive partner package — deals and bonuses you won&apos;t get going direct.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 md:gap-14 items-start">
          {/* Left — Product image (desktop) */}
          <div className="hidden md:block md:col-span-5">
            <div className="sticky top-24">
              <Image
                src="/images/google/vivint-products-hero.jpg"
                alt="Vivint commercial security system with AI cameras, smart locks, doorbell, and monitoring hub"
                width={600}
                height={600}
                className="w-full h-auto rounded-2xl"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
              <p className="text-center text-[12px] text-slate-400 mt-4 font-body tracking-wide">
                Professional-grade equipment. Zero upfront cost.
              </p>
            </div>
          </div>

          {/* Right — Value list */}
          <div className="md:col-span-7">
            <div className="border border-slate-200 rounded-2xl p-4 md:p-8">
              {/* Urgency badge */}
              <div className="flex items-center justify-center gap-2 mb-4 py-2 bg-amber-50 rounded-lg border border-amber-100">
                <span className="text-[12px] font-heading font-semibold tracking-[-0.01em]" style={{ color: 'var(--color-brass-500, #C49157)' }}>
                  Limited time — Free AI Camera Upgrade included
                </span>
              </div>

              <div ref={listRef} className="space-y-0">
                {stackItems.map((item, i) => (
                  <div
                    key={item.item}
                    className={`flex items-start justify-between gap-4 py-3.5 ${
                      i !== stackItems.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[7px]"
                        style={{ backgroundColor: 'var(--color-emerald-500)' }}
                      />
                      <span className="text-[14px] font-body text-slate-700 leading-snug">
                        {item.item}
                      </span>
                    </div>
                    <span className="text-[13px] font-body text-slate-300 line-through flex-shrink-0 tabular-nums">
                      {item.value > 0 ? `$${item.value}` : item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t-2 border-slate-900 mt-5 pt-5">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[12px] font-heading font-semibold text-slate-400 uppercase tracking-[0.08em]">Total Value</span>
                  <span className="text-[17px] font-heading font-bold text-slate-300 line-through tabular-nums">${totalValue.toLocaleString()}+</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[12px] font-heading font-semibold text-slate-900 uppercase tracking-[0.08em]">Your Cost</span>
                  <span className="text-[22px] md:text-[26px] font-heading font-bold text-emerald-600 tracking-[-0.02em]">
                    A free 8-minute phone call
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
                >
                  Claim My Free Business Audit →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Close Line */}
        <p className="text-center text-[14px] md:text-[15px] font-body text-slate-500 mt-10 max-w-lg mx-auto leading-relaxed">
          The quote call is free. The installation is free.
          The only question is how long you&apos;re going to keep overpaying your current provider.
        </p>
      </div>
    </section>
  )
}

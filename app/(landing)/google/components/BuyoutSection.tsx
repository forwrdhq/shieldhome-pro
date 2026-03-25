'use client'

import { useScrollReveal, useStaggerReveal } from './useScrollReveal'

export default function BuyoutSection() {
  const headingRef = useScrollReveal<HTMLDivElement>()
  const listRef = useStaggerReveal<HTMLDivElement>(100)

  return (
    <section className="py-20 md:py-28 bg-slate-50 border-y border-slate-100">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <div ref={headingRef} className="text-center mb-10">
          <p className="text-[11px] font-heading font-semibold text-emerald-600 uppercase tracking-[0.14em] mb-3">
            Switching from ADT, Ring, or SimpliSafe?
          </p>
          <h2 className="font-heading font-bold text-[28px] md:text-[34px] tracking-[-0.025em] text-slate-900">
            We Handle Everything
          </h2>
        </div>

        <div ref={listRef} className="space-y-4 max-w-md mx-auto mb-10">
          {[
            'We pay up to $1,000 to buy out your contract',
            'We install your new system (usually next day)',
            'We configure everything and train your family',
            'You get a $200 Visa gift card on top',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-[3px]">
                <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
              <span className="text-[14px] font-body text-slate-700 leading-snug">{item}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-[14px] font-body text-slate-400 italic mb-8">
          Your only job? Answer the door.
        </p>

        <div className="text-center">
          <a
            href="#hero-form"
            onClick={() => {
              window.dataLayer?.push({ event: 'cta_click', section: 'buyout' })
            }}
            className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
          >
            Switch Now — See My Buyout Package
          </a>
        </div>
      </div>
    </section>
  )
}

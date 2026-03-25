'use client'

import Image from 'next/image'
import { useScrollReveal, useStaggerReveal } from './useScrollReveal'

export default function BuyoutSection() {
  const headingRef = useScrollReveal<HTMLDivElement>()
  const listRef = useStaggerReveal<HTMLDivElement>(100)

  return (
    <section className="py-14 md:py-32 bg-slate-50 border-y border-slate-100">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — Content */}
          <div>
            <div ref={headingRef} className="mb-8">
              <p className="text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-4" style={{ color: 'var(--color-brass-400)' }}>
                Switching from ADT, Ring, or SimpliSafe?
              </p>
              <h2 className="font-heading font-bold text-[28px] md:text-[34px] tracking-[-0.03em] text-slate-900">
                We Handle Everything
              </h2>
            </div>

            <div ref={listRef} className="space-y-5 mb-8">
              {[
                { bold: 'We pay up to $1,000', rest: ' to buy out your contract' },
                { bold: 'We install your new system', rest: ' — usually next day' },
                { bold: 'We configure everything', rest: ' and train your family' },
                { bold: 'You get a $200 Visa gift card', rest: ' on top' },
              ].map((item) => (
                <div key={item.bold} className="flex items-start gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[7px]"
                    style={{ backgroundColor: 'var(--color-emerald-500)' }}
                  />
                  <p className="text-[15px] font-body text-slate-600 leading-snug">
                    <span className="text-slate-900 font-semibold">{item.bold}</span>
                    {item.rest}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[14px] font-body text-slate-400 italic mb-8">
              Your only job? Answer the door.
            </p>

            <a
              href="#hero-form"
              onClick={() => {
                window.dataLayer?.push({ event: 'cta_click', section: 'buyout' })
              }}
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
            >
              Switch Now — See My Buyout Package
            </a>
          </div>

          {/* Right — Product image */}
          <div className="hidden md:block">
            <Image
              src="/images/products/outdoor-camera-pro.png"
              alt="Vivint outdoor security camera with Smart Deter technology"
              width={500}
              height={500}
              className="w-full max-w-sm mx-auto h-auto"
              sizes="(min-width: 768px) 40vw, 0vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

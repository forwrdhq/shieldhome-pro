'use client'

import Image from 'next/image'
import { useScrollReveal, useStaggerReveal } from './useScrollReveal'

interface ValueStackProps {
  isBuyoutVisitor?: boolean
}

const items = [
  { name: 'Complete Vivint Smart Home Security System', value: 599 },
  { name: 'Professional Installation by Certified Technician', value: 199 },
  { name: 'Indoor Camera Pro with 2-Way Audio', value: 199 },
  { name: 'Smart Doorbell Camera (Records Without Wi-Fi)', value: 249 },
  { name: 'Perimeter Protection Pack — Sensors for Every Entry', value: 499 },
  { name: '24/7 Professional Monitoring Setup & Activation', value: 99 },
  { name: 'First 90 Days of Monitoring FREE', value: 150 },
  { name: 'Welcome Home Reward — Visa Gift Card', value: 200 },
]

const buyoutItem = { name: 'Contract Buyout — We Pay Up to $1,000 to End Your Contract', value: 1000 }

export default function ValueStack({ isBuyoutVisitor }: ValueStackProps) {
  const allItems = isBuyoutVisitor ? [buyoutItem, ...items] : items
  const totalValue = allItems.reduce((sum, item) => sum + item.value, 0)
  const headingRef = useScrollReveal<HTMLDivElement>()
  const listRef = useStaggerReveal<HTMLDivElement>(60)

  return (
    <section className="py-12 md:py-20 bg-white relative">

      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div ref={headingRef} className="text-center mb-8 md:mb-16">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-4" style={{ color: 'var(--color-brass-400)' }}>
            What You Get
          </p>
          <h2 className="font-heading font-bold text-[24px] md:text-[38px] tracking-[-0.03em] text-slate-900 mb-2 md:mb-3">
            The Total Shield Package
          </h2>
          <p className="text-[14px] md:text-[16px] font-body text-slate-400 max-w-md mx-auto">
            Our exclusive partner package — deals and bonuses you won&apos;t get going direct. Installed by a certified Vivint technician, usually within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 md:gap-14 items-start">
          {/* Left — Product image */}
          <div className="hidden md:block md:col-span-5">
            <div className="sticky top-24">
              <Image
                src="/images/google/vivint-products-hero.jpg"
                alt="Vivint smart home security system with cameras, doorbell, smart lock, thermostat, and hub"
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
                <span className="text-[12px] font-heading font-semibold tracking-[-0.01em]" style={{ color: 'var(--color-brass-500)' }}>
                  Spring Flash Sale pricing applied
                </span>
              </div>
              <div ref={listRef} className="space-y-0">
                {allItems.map((item, i) => (
                  <div
                    key={item.name}
                    className={`flex items-start justify-between gap-4 py-3.5 ${
                      i !== allItems.length - 1 ? 'border-b border-slate-100' : ''
                    } ${
                      i === 0 && isBuyoutVisitor
                        ? 'bg-amber-50/60 -mx-2 px-2 rounded-lg border-b-0 mb-1'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[7px]"
                        style={{ backgroundColor: 'var(--color-emerald-500)' }}
                      />
                      <span className="text-[14px] font-body text-slate-700 leading-snug">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[13px] font-body text-slate-300 line-through flex-shrink-0 tabular-nums">
                      ${item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t-2 border-slate-900 mt-5 pt-5">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[12px] font-heading font-semibold text-slate-400 uppercase tracking-[0.08em]">Total Value</span>
                  <span className="text-[17px] font-heading font-bold text-slate-300 line-through tabular-nums">${totalValue.toLocaleString()}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[12px] font-heading font-semibold text-slate-900 uppercase tracking-[0.08em]">Your Cost</span>
                  <span className="text-[26px] md:text-[30px] font-heading font-bold text-emerald-600 tracking-[-0.02em] tabular-nums">
                    $0 Down + $24.99/mo
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <a
                  href="#hero-form"
                  onClick={() => {
                    window.dataLayer?.push({ event: 'cta_click', section: 'value_stack' })
                  }}
                  className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
                >
                  Get My Free Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

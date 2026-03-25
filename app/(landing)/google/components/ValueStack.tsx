'use client'

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
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="font-heading font-bold text-[28px] md:text-[34px] tracking-[-0.025em] text-slate-900 mb-2">
            The Total Shield Package
          </h2>
          <p className="text-[15px] font-body text-slate-400">
            Everything included with your system
          </p>
        </div>

        <div className="border border-slate-150 rounded-2xl p-6 md:p-8">
          <div ref={listRef} className="space-y-0">
            {allItems.map((item, i) => (
              <div
                key={item.name}
                className={`flex items-start justify-between gap-4 py-3 ${
                  i !== allItems.length - 1 ? 'border-b border-slate-100' : ''
                } ${
                  i === 0 && isBuyoutVisitor
                    ? 'bg-amber-50/60 -mx-2 px-2 rounded-lg border-b-0 mb-1'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Custom check — 1.5px stroke, squared ends */}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-[3px]">
                    <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="square" />
                  </svg>
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
          <div className="border-t border-slate-200 mt-4 pt-5">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-[13px] font-heading font-semibold text-slate-400 uppercase tracking-wide">Total Value</span>
              <span className="text-[18px] font-heading font-bold text-slate-300 line-through tabular-nums">${totalValue.toLocaleString()}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-heading font-semibold text-slate-900 uppercase tracking-wide">Your Cost</span>
              <span className="text-[24px] md:text-[28px] font-heading font-bold text-emerald-600 tracking-[-0.02em] tabular-nums">
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
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
            >
              Claim Your Package
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

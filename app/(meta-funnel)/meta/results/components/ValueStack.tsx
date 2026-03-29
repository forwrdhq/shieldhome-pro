'use client'

import { Check } from 'lucide-react'

const VALUE_ITEMS = [
  {
    name: 'Complete Vivint Smart Home Security System',
    description: 'Smart hub + door/window sensors + smart panel',
    retailPrice: '$1,200',
  },
  {
    name: 'White-Glove Professional Installation',
    description: 'Certified technician handles everything (~3 hrs)',
    retailPrice: '$499',
  },
  {
    name: 'The Perimeter Protection Pack',
    description: 'Extra sensors for every entry point',
    retailPrice: '$499',
  },
  {
    name: 'The Eagle Eye Camera Upgrade',
    description: 'Buy 2 cameras, get 1 FREE',
    retailPrice: '$299',
  },
  {
    name: 'The First 90 Days Free',
    description: 'Full 24/7 professional monitoring \u2014 on us',
    retailPrice: '$150',
  },
  {
    name: 'The Welcome Home Reward',
    description: '$200 Visa gift card (schedule this week)',
    retailPrice: '$200',
  },
]

export default function ValueStack() {
  return (
    <div style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both' }}>
      <p
        className="text-[11px] font-heading font-semibold uppercase tracking-[0.12em] text-center mb-5"
        style={{ color: 'var(--color-brass-300, #E8CBA7)' }}
      >
        Your Recommended Protection Plan
      </p>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden max-w-lg mx-auto backdrop-blur-sm">
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 text-center">
          <h3 className="text-[18px] font-heading font-bold text-white tracking-[-0.02em]">
            THE TOTAL SHIELD PACKAGE
          </h3>
          <p className="text-[12px] text-emerald-100 font-body mt-0.5">
            Everything you need. Nothing you don&apos;t.
          </p>
        </div>

        {/* Items */}
        <div className="p-5 md:p-6 space-y-3.5">
          {VALUE_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3"
              style={{ animation: `fadeUp 400ms cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 80}ms both` }}
            >
              <div className="w-5 h-5 bg-emerald-500/15 border border-emerald-500/25 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[13px] font-heading font-semibold text-white leading-tight">{item.name}</p>
                    <p className="text-[11px] text-slate-400 font-body mt-0.5">{item.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[12px] text-slate-500 line-through font-body">{item.retailPrice}</span>
                    <span className="block text-[10px] font-heading font-bold text-emerald-400 uppercase tracking-[0.05em]">INCLUDED</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t border-slate-700/50 px-5 md:px-6 py-5 bg-slate-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-slate-500 font-body">Total Package Value:</span>
            <span className="text-[18px] text-slate-500 line-through font-heading font-bold">$2,847</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-heading font-bold text-white uppercase tracking-[0.05em]">YOUR COST:</span>
            <div className="text-right">
              <span className="text-[28px] font-heading font-bold text-emerald-400 leading-none">$0 Down</span>
              <span className="block text-[13px] text-emerald-400/80 font-body mt-0.5">+ as low as $39.99/mo</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 text-center mt-3 font-body">
            That&apos;s just $1.33/day &mdash; less than your morning coffee
          </p>
        </div>
      </div>
    </div>
  )
}

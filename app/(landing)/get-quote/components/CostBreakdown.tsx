'use client'

import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal'

interface TierFeature {
  label: string
  value: string
}

interface Tier {
  name: string
  price: string
  highlighted?: boolean
  badge?: string
  features: TierFeature[]
  bottomLine: string
}

const tiers: Tier[] = [
  {
    name: 'DIY Systems',
    price: '$10–$30/mo',
    features: [
      { label: 'Equipment', value: '$200–$600 upfront' },
      { label: 'Install', value: 'Self-install' },
      { label: 'Monitoring', value: 'Optional, basic' },
      { label: 'Cameras', value: '1–2 included' },
      { label: 'Response time', value: 'Notification only' },
    ],
    bottomLine: 'Cheapest upfront, but you\u2019re on your own if something happens.',
  },
  {
    name: 'Professional Systems',
    price: '$25–$50/mo',
    highlighted: true,
    badge: 'Best Value',
    features: [
      { label: 'Equipment', value: '$0 down available' },
      { label: 'Install', value: 'Free professional installation' },
      { label: 'Monitoring', value: '24/7 professional, ~14 sec response' },
      { label: 'Cameras', value: '2–5+ included' },
      { label: 'Response time', value: 'Police/fire dispatched automatically' },
    ],
    bottomLine: 'The sweet spot. Full protection, zero DIY headaches.',
  },
  {
    name: 'Premium / Commercial',
    price: '$50–$100+/mo',
    features: [
      { label: 'Equipment', value: '$500–$2,000+ upfront' },
      { label: 'Install', value: 'Professional, multi-day' },
      { label: 'Monitoring', value: 'Enterprise-grade' },
      { label: 'Cameras', value: '8+ with NVR' },
      { label: 'Response time', value: 'Dedicated monitoring' },
    ],
    bottomLine: 'Overkill for most homes. Built for businesses.',
  },
]

function TierCard({ tier }: { tier: Tier }) {
  const base = tier.highlighted
    ? 'relative bg-emerald-50/30 rounded-2xl border-2 border-emerald-500 p-6 md:p-8 hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] transition-all duration-500'
    : 'relative bg-white rounded-2xl border border-slate-200 p-6 md:p-8 hover:border-slate-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)] transition-all duration-500'

  return (
    <div className={base}>
      {tier.badge && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-heading font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
          {tier.badge}
        </span>
      )}

      <h3 className="font-heading font-bold text-[16px] md:text-[18px] text-slate-900 tracking-[-0.01em] mb-1">
        {tier.name}
      </h3>
      <p className={`font-heading font-bold text-[26px] md:text-[32px] tracking-[-0.03em] mb-5 ${tier.highlighted ? 'text-emerald-700' : 'text-slate-900'}`}>
        {tier.price}
      </p>

      <ul className="space-y-3 mb-6">
        {tier.features.map((f) => (
          <li key={f.label} className="flex justify-between items-start gap-3 text-[13px] md:text-[14px] font-body">
            <span className="text-slate-400 shrink-0">{f.label}</span>
            <span className="text-right text-slate-700 font-medium">{f.value}</span>
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-200 pt-4 mt-auto">
        <p className="text-[13px] md:text-[14px] font-body italic text-slate-400 leading-relaxed">
          &ldquo;{tier.bottomLine}&rdquo;
        </p>
      </div>
    </div>
  )
}

export default function CostBreakdown() {
  const headingRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useStaggerReveal<HTMLDivElement>(120)

  return (
    <section className="py-14 md:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* ---------- heading ---------- */}
        <div ref={headingRef} className="text-center mb-8 md:mb-16">
          <p
            className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-4"
            style={{ color: 'var(--color-brass-400)' }}
          >
            Pricing Breakdown
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900 mb-2 md:mb-3">
            What Does Home Security Actually Cost?
          </h2>
          <p className="text-[13px] md:text-[16px] font-body text-slate-400 max-w-lg mx-auto">
            Here&rsquo;s the real breakdown&nbsp;&mdash; no hidden fees, no bait-and-switch.
          </p>
        </div>

        {/* ---------- cards ---------- */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>

        {/* ---------- callout ---------- */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 mt-8 md:mt-12">
          <div className="flex items-start gap-4">
            <span className="text-[28px] leading-none shrink-0" aria-hidden="true">
              💡
            </span>
            <div>
              <p className="font-heading font-bold text-[15px] md:text-[18px] tracking-[-0.02em] leading-snug mb-2">
                Our Pick: Get a complete professional system for{' '}
                <span className="text-emerald-400">$0 down + $24.99/mo</span>{' '}
                — that&rsquo;s less than $1/day for 24/7 protection.
              </p>
              <a
                href="#value-stack"
                className="inline-flex items-center text-[13px] md:text-[14px] font-heading font-semibold text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
              >
                See What&rsquo;s Included&nbsp;&rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

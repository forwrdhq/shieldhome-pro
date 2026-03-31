'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

function scrollToForm() {
  document.querySelector('#business-form')?.scrollIntoView({ behavior: 'smooth' })
}

type CellType = 'yes' | 'no' | 'warn' | 'text'

interface Row {
  feature: string
  shieldhome: string
  adt: string
  ring: string
  simplisafe: string
  types: [CellType, CellType, CellType, CellType]
  highlight?: boolean
}

const rows: Row[] = [
  {
    feature: 'Monthly Monitoring (starting)',
    shieldhome: '$39.99/mo',
    adt: '$49.99–$79.99/mo',
    ring: '$20/mo (no live agent)',
    simplisafe: '$39.99/mo',
    types: ['text', 'text', 'text', 'text'],
  },
  {
    feature: 'Equipment Markup for Business',
    shieldhome: 'None',
    adt: 'Custom quote (opaque)',
    ring: 'None',
    simplisafe: 'None',
    types: ['yes', 'no', 'yes', 'yes'],
  },
  {
    feature: 'Professional Installation',
    shieldhome: 'FREE',
    adt: '$99–$300+',
    ring: 'DIY only',
    simplisafe: 'DIY only',
    types: ['yes', 'no', 'no', 'no'],
  },
  {
    feature: 'Contract Buyout (up to $1,000)',
    shieldhome: 'Yes',
    adt: 'No',
    ring: 'No',
    simplisafe: 'No',
    types: ['yes', 'no', 'no', 'no'],
    highlight: true,
  },
  {
    feature: 'AI Smart Deterrence',
    shieldhome: 'Smart Deter',
    adt: 'Not available',
    ring: 'Not available',
    simplisafe: 'Not available',
    types: ['yes', 'no', 'no', 'no'],
  },
  {
    feature: '4K HDR Cameras',
    shieldhome: 'Yes',
    adt: '1080p max',
    ring: '1080p max',
    simplisafe: '1080p max',
    types: ['yes', 'no', 'no', 'no'],
  },
  {
    feature: 'Monitoring Response Time',
    shieldhome: '8 seconds',
    adt: '60+ seconds',
    ring: 'No live agents',
    simplisafe: 'Varies',
    types: ['yes', 'warn', 'no', 'warn'],
  },
  {
    feature: '30-Day Satisfaction Guarantee',
    shieldhome: 'Yes',
    adt: 'No',
    ring: 'No',
    simplisafe: 'No',
    types: ['yes', 'no', 'no', 'no'],
  },
  {
    feature: 'Insurance Discount Documentation',
    shieldhome: 'Provided',
    adt: 'On request',
    ring: 'No',
    simplisafe: 'No',
    types: ['yes', 'warn', 'no', 'no'],
  },
  {
    feature: 'Price Hike History',
    shieldhome: 'None on record',
    adt: 'Multiple increases',
    ring: 'Doubled in 2023',
    simplisafe: '3x in 4 years',
    types: ['yes', 'no', 'no', 'no'],
    highlight: true,
  },
  {
    feature: 'BBB Rating',
    shieldhome: 'A+',
    adt: 'A+',
    ring: 'C',
    simplisafe: 'A+',
    types: ['yes', 'yes', 'no', 'yes'],
  },
]

function CellIcon({ type }: { type: CellType }) {
  if (type === 'yes') return <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
  if (type === 'no') return <XCircle size={16} className="text-red-400 flex-shrink-0" />
  if (type === 'warn') return <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
  return null
}

export default function PricingComparison() {
  const headingRef = useScrollReveal<HTMLDivElement>()
  const tableRef = useScrollReveal<HTMLDivElement>({ delay: 150 })
  const roiRef = useScrollReveal<HTMLDivElement>({ delay: 300 })

  return (
    <section className="py-14 md:py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-5 md:px-12">
        <div ref={headingRef} className="text-center mb-10 md:mb-14">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
            Honest Comparison
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900 mb-2 md:mb-3">
            The Numbers Your Current Provider Doesn&apos;t Want You to See
          </h2>
          <p className="text-[13px] md:text-[16px] font-body text-slate-400 max-w-md mx-auto">
            An honest apples-to-apples comparison. We do this because we win it.
          </p>
        </div>

        {/* Comparison Table */}
        <div ref={tableRef} className="overflow-x-auto -mx-5 md:mx-0 mb-10 md:mb-12">
          <table className="w-full min-w-[700px] md:min-w-0 text-[13px] md:text-[14px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-heading font-semibold text-slate-500 w-[22%]">Feature</th>
                <th className="text-left py-3 px-4 font-heading font-bold text-emerald-700 bg-emerald-50/60 border-x-2 border-emerald-200 w-[19.5%]">
                  ShieldHome (Vivint)
                </th>
                <th className="text-left py-3 px-4 font-heading font-semibold text-slate-500 w-[19.5%]">ADT Business</th>
                <th className="text-left py-3 px-4 font-heading font-semibold text-slate-500 w-[19.5%]">Ring Business</th>
                <th className="text-left py-3 px-4 font-heading font-semibold text-slate-500 w-[19.5%]">SimpliSafe Business</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.feature}
                  className={`border-b border-slate-100 ${row.highlight ? 'bg-amber-50/40' : ''}`}
                >
                  <td className="py-3 px-4 font-body text-slate-700 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 font-body font-semibold text-emerald-800 bg-emerald-50/60 border-x-2 border-emerald-200">
                    <span className="flex items-center gap-1.5">
                      <CellIcon type={row.types[0]} />
                      {row.shieldhome}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-body text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CellIcon type={row.types[1]} />
                      {row.adt}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-body text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CellIcon type={row.types[2]} />
                      {row.ring}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-body text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CellIcon type={row.types[3]} />
                      {row.simplisafe}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Source Footnote */}
        <p className="text-[10px] md:text-[11px] font-body text-slate-400 text-center mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed">
          Competitor pricing per respective provider websites, March 2026. Ring pricing history per Ring public announcements, 2023.
          SimpliSafe rate history per customer communications, 2021–2025. BBB ratings per BBB.org, March 2026.
        </p>

        {/* ROI Callout Box */}
        <div ref={roiRef} className="max-w-2xl mx-auto bg-white border-2 border-emerald-200 rounded-2xl p-6 md:p-8">
          <p className="font-heading font-bold text-[16px] md:text-[18px] text-slate-900 mb-4 flex items-center gap-2">
            💡 The Math That Changes the Conversation
          </p>

          <div className="space-y-1.5 text-[13px] md:text-[14px] font-body text-slate-600 mb-5 font-mono">
            <p>Typical provider at $49.99/mo &nbsp;&nbsp;&nbsp; = $599.88/year</p>
            <p>ShieldHome at $39.99/mo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = $479.88/year</p>
            <p className="font-semibold text-emerald-700">Year-1 monitoring savings alone = $120.00</p>
          </div>

          <p className="text-[13px] font-body text-slate-600 mb-3 font-medium">Before you add:</p>
          <ul className="space-y-1.5 text-[13px] md:text-[14px] font-body text-slate-600 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              Insurance premium discount (5–20%) = up to $2,000/yr saved
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              Contract buyout if switching providers = up to $1,000 covered
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              Section 179 tax deduction = deduct full equipment cost in Year 1
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              Theft prevention value = avg. break-in costs $2,661+
            </li>
          </ul>

          <button
            onClick={scrollToForm}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-semibold text-[14px] md:text-[15px] rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
          >
            Ready to stop overpaying? → Claim My Free Quote
          </button>
        </div>
      </div>
    </section>
  )
}

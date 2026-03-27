'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

const features = [
  { feature: 'Professional Installation', vivint: 'FREE', adt: '$99–$199', simplisafe: '$124.99', ring: 'DIY' },
  { feature: '24/7 Pro Monitoring', vivint: 'From $24.99/mo', adt: 'From $24.99/mo', simplisafe: 'From $19.99/mo', ring: '$20/mo (limited)' },
  { feature: 'AI-Powered Cameras', vivint: true, adt: false, simplisafe: false, ring: false },
  { feature: 'Smart Sentry\u2122 Threat Blocker', vivint: true, adt: false, simplisafe: false, ring: false },
  { feature: 'Package Detection', vivint: true, adt: false, simplisafe: false, ring: true },
  { feature: 'Contract Buyout (up to $1,000)', vivint: true, adt: false, simplisafe: false, ring: false },
  { feature: 'Same/Next-Day Install', vivint: true, adt: 'Scheduled', simplisafe: 'DIY', ring: 'DIY' },
  { feature: 'Visa Gift Card Bonus', vivint: 'Up to $200', adt: '$100', simplisafe: false, ring: false },
  { feature: 'Money-Back Guarantee', vivint: '60 Days', adt: '6 Months', simplisafe: false, ring: '30 Days' },
  { feature: 'Google/Alexa Built In', vivint: true, adt: true, simplisafe: true, ring: true },
]

function Check({ highlight }: { highlight?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mx-auto">
      <circle cx="9" cy="9" r="8" fill={highlight ? '#059669' : '#F1F5F9'} />
      <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke={highlight ? '#fff' : '#94A3B8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Cross() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mx-auto">
      <path d="M6.5 6.5L11.5 11.5M11.5 6.5L6.5 11.5" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function Cell({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  if (value === true) return <Check highlight={highlight} />
  if (value === false) return <Cross />
  return (
    <span className={`text-[12px] font-body ${highlight ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
      {value}
    </span>
  )
}

interface ComparisonTableProps {
  onQuizOpen?: () => void
}

export default function ComparisonTable({ onQuizOpen }: ComparisonTableProps) {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section id="compare" className="py-14 md:py-32 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-8 md:mb-16">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-4" style={{ color: 'var(--color-brass-400)' }}>
            Why ShieldHome
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900 mb-2 md:mb-3">
            See How We Compare
          </h2>
          <p className="text-[13px] md:text-[16px] font-body text-slate-400 max-w-md mx-auto">
            Side-by-side, feature-for-feature — the facts speak for themselves.
          </p>
        </div>

        <div ref={ref} className="overflow-x-auto -mx-4 px-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden min-w-[640px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-5 text-left text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-[0.08em] w-[28%]">
                    Feature
                  </th>
                  <th className="py-4 px-4 text-center bg-emerald-50 relative">
                    <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 -translate-y-full bg-emerald-600 text-white text-[9px] font-heading font-bold px-3 py-1 rounded-t-lg uppercase tracking-wider">
                      Best Value
                    </span>
                    <span className="text-[13px] font-heading font-bold text-slate-900">
                      ShieldHome
                    </span>
                    <br />
                    <span className="text-[11px] font-body text-slate-500">(Vivint)</span>
                  </th>
                  <th className="py-4 px-4 text-center text-[12px] font-heading font-semibold text-slate-400">ADT</th>
                  <th className="py-4 px-4 text-center text-[12px] font-heading font-semibold text-slate-400">SimpliSafe</th>
                  <th className="py-4 px-4 text-center text-[12px] font-heading font-semibold text-slate-400">Ring/DIY</th>
                </tr>
              </thead>
              <tbody>
                {features.map((row, i) => (
                  <tr key={row.feature} className={`${i !== features.length - 1 ? 'border-b border-slate-100' : ''} group`}>
                    <td className="py-4 px-5 text-[13px] font-body font-medium text-slate-700">{row.feature}</td>
                    <td className="py-4 px-4 text-center bg-emerald-50/60 group-hover:bg-emerald-50 transition-colors duration-300">
                      <Cell value={row.vivint} highlight />
                    </td>
                    <td className="py-4 px-4 text-center"><Cell value={row.adt} /></td>
                    <td className="py-4 px-4 text-center"><Cell value={row.simplisafe} /></td>
                    <td className="py-4 px-4 text-center"><Cell value={row.ring} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-12">
          {onQuizOpen ? (
            <button
              onClick={onQuizOpen}
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
            >
              See Why Families Choose ShieldHome
            </button>
          ) : (
            <a
              href="#quiz"
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
            >
              See Why Families Choose ShieldHome
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useScrollReveal } from './useScrollReveal'

const features = [
  { feature: 'Professional Installation', shieldhome: 'FREE', adt: '$99–$199', simplisafe: '$124.99', ring: 'DIY' },
  { feature: '24/7 Pro Monitoring', shieldhome: 'From $24.99/mo', adt: 'From $24.99/mo', simplisafe: 'From $19.99/mo', ring: '$20/mo (limited)' },
  { feature: 'Contract After Equipment Paid', shieldhome: true, adt: '36 months', simplisafe: 'None', ring: 'None' },
  { feature: 'AI Smart Deter Camera', shieldhome: true, adt: false, simplisafe: false, ring: false },
  { feature: 'Contract Buyout (up to $1,000)', shieldhome: true, adt: false, simplisafe: false, ring: false },
  { feature: 'Same/Next-Day Install', shieldhome: true, adt: 'Scheduled', simplisafe: 'DIY', ring: 'DIY' },
  { feature: 'Visa Gift Card Bonus', shieldhome: 'Up to $200', adt: '$100', simplisafe: false, ring: false },
  { feature: 'Money-Back Guarantee', shieldhome: '60 Days', adt: '6 Months', simplisafe: false, ring: '30 Days' },
]

/* Custom check/cross SVGs — consistent 1.5px stroke */
function Check({ highlight }: { highlight?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mx-auto">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={highlight ? '#059669' : '#94A3B8'} strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

function Cross() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mx-auto">
      <path d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="square" />
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

export default function ComparisonSection() {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading font-bold text-[28px] md:text-[34px] tracking-[-0.025em] text-slate-900 mb-2">
            See How We Compare
          </h2>
          <p className="text-[15px] font-body text-slate-400">
            The facts speak for themselves
          </p>
        </div>

        <div ref={ref} className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-[0.08em] w-[30%]">
                  Feature
                </th>
                <th className="py-3 px-4 text-center bg-emerald-50/70 rounded-t-xl relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-heading font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Best Value
                  </span>
                  <span className="text-[12px] font-heading font-semibold text-slate-800">
                    ShieldHome<br /><span className="font-normal text-slate-500">(Vivint)</span>
                  </span>
                </th>
                <th className="py-3 px-4 text-center text-[12px] font-heading font-semibold text-slate-400">ADT</th>
                <th className="py-3 px-4 text-center text-[12px] font-heading font-semibold text-slate-400">SimpliSafe</th>
                <th className="py-3 px-4 text-center text-[12px] font-heading font-semibold text-slate-400">Ring/DIY</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row) => (
                <tr key={row.feature} className="border-t border-slate-100 group">
                  <td className="py-3.5 px-4 text-[13px] font-body font-medium text-slate-700">{row.feature}</td>
                  <td className="py-3.5 px-4 text-center bg-emerald-50/70 group-hover:bg-emerald-50 transition-colors duration-300">
                    <Cell value={row.shieldhome} highlight />
                  </td>
                  <td className="py-3.5 px-4 text-center"><Cell value={row.adt} /></td>
                  <td className="py-3.5 px-4 text-center"><Cell value={row.simplisafe} /></td>
                  <td className="py-3.5 px-4 text-center"><Cell value={row.ring} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-10">
          <a
            href="#hero-form"
            onClick={() => {
              window.dataLayer?.push({ event: 'cta_click', section: 'comparison' })
            }}
            className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
          >
            See Why Families Choose ShieldHome
          </a>
        </div>
      </div>
    </section>
  )
}

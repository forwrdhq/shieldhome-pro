import { Check, X, ArrowRight } from 'lucide-react'

const rows = [
  {
    feature: 'Monthly cost',
    current: '$45–$65/mo',
    shieldhome: 'Starting at $33/mo',
    highlight: false,
  },
  {
    feature: 'Contract',
    current: '36–60 months locked in',
    shieldhome: 'Flexible — cancel anytime',
    highlight: false,
  },
  {
    feature: 'Equipment',
    current: '3–10+ years old',
    shieldhome: 'Brand new, AI-powered',
    highlight: false,
  },
  {
    feature: 'Cameras',
    current: 'Low-res, no AI detection',
    shieldhome: '4K HDR, AI person/vehicle detection',
    highlight: false,
  },
  {
    feature: 'Smart home',
    current: null,
    shieldhome: 'Full Google/Alexa ecosystem',
    highlight: false,
  },
  {
    feature: 'Mobile app',
    current: 'Basic or outdated',
    shieldhome: 'Live HD feeds + smart controls',
    highlight: false,
  },
  {
    feature: 'Cancellation fee',
    current: '$800–$1,400',
    shieldhome: 'We cover up to $1,000',
    highlight: true,
  },
]

export default function SavingsComparison() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-emerald-500 font-bold text-sm uppercase tracking-widest mb-2">
            SIDE-BY-SIDE COMPARISON
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Your Current Provider vs. Vivint
          </h2>
          <p className="text-gray-600">See exactly what you&apos;re missing — and what you&apos;ll gain</p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-500 w-[28%]" />
                <th className="px-6 py-4 bg-red-50/50 text-center w-[36%]">
                  <span className="text-red-400 text-sm font-semibold">Your Current Provider</span>
                </th>
                <th className="px-6 py-4 bg-emerald-50 text-center w-[36%]">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-emerald-500 text-sm font-bold">ShieldHome + Vivint</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.feature}
                  className={row.highlight ? 'bg-emerald-50/40' : 'hover:bg-gray-50/50'}
                >
                  <td className="px-6 py-4 font-semibold text-gray-900 text-sm border-t border-gray-100">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4 text-center border-t border-gray-100">
                    {row.current === null ? (
                      <span className="inline-flex items-center gap-1.5 text-red-400 text-sm">
                        <X size={15} className="flex-shrink-0" /> Limited or none
                      </span>
                    ) : (
                      <span className={`text-sm ${row.highlight ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                        {row.highlight && <X size={14} className="inline mr-1 text-red-400" />}
                        {row.current}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center border-t border-gray-100">
                    <span className={`text-sm ${row.highlight ? 'text-emerald-500 font-bold text-base' : 'text-slate-900 font-semibold'}`}>
                      <Check size={15} className="inline mr-1 text-emerald-500" />
                      {row.shieldhome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Bottom savings banner */}
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="text-white">
              <p className="font-bold">Average annual savings after switching</p>
              <p className="text-gray-400 text-sm">Based on 2,400+ switches in the last 12 months</p>
            </div>
            <div className="text-emerald-500 font-extrabold text-2xl">$264/year</div>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {rows.map((row) => (
            <div
              key={row.feature}
              className={`rounded-xl border p-4 ${row.highlight ? 'border-emerald-600 bg-emerald-50/30 shadow-sm' : 'border-gray-200'}`}
            >
              <p className="font-semibold text-gray-900 text-sm mb-3">{row.feature}</p>
              <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                <div>
                  <p className="text-[10px] text-red-400 uppercase font-semibold mb-1">Current</p>
                  {row.current === null ? (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <X size={13} /> None
                    </p>
                  ) : (
                    <p className={`text-sm ${row.highlight ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                      {row.current}
                    </p>
                  )}
                </div>
                <ArrowRight size={14} className="text-gray-300" />
                <div>
                  <p className="text-[10px] text-emerald-500 uppercase font-semibold mb-1">Vivint</p>
                  <p className={`text-sm ${row.highlight ? 'text-emerald-500 font-bold' : 'text-slate-900 font-semibold'}`}>
                    {row.shieldhome}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Mobile savings banner */}
          <div className="bg-slate-900 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Average annual savings</p>
            <p className="text-emerald-500 font-extrabold text-2xl">$264/year</p>
            <p className="text-gray-500 text-xs">Based on 2,400+ switches</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="#switch-form"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-200 hover:-translate-y-0.5"
          >
            Check My Buyout Eligibility →
          </a>
        </div>
      </div>
    </section>
  )
}

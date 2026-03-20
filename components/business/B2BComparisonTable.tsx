'use client'

import { Check, X, Crown } from 'lucide-react'

const rows = [
  { feature: 'Monthly Monitoring', shield: '~$40/mo', adt: '$50–53/mo', trad: '$60–120/mo', shieldWin: true },
  { feature: 'Contract Required', shield: 'Month-to-Month Option', adt: '36 Months Mandatory', trad: '36–60 Months', shieldWin: true },
  { feature: 'Response Time', shield: '8 Seconds', adt: '~60 Seconds', trad: 'Varies', shieldWin: true },
  { feature: 'Smart Technology', shield: 'Full Smart Home/Business', adt: 'Basic', trad: 'Outdated', shieldWin: true },
  { feature: 'Professional Installation', shield: 'Included', adt: 'Included', trad: 'Extra Cost', shieldWin: true },
  { feature: 'Equipment Financing', shield: '0% APR Available', adt: 'Limited', trad: 'Rarely', shieldWin: true },
  { feature: 'Competitor Buyout', shield: 'Up to $1,000', adt: 'No', trad: 'No', shieldWin: true },
]

function WinBadge({ win }: { win: boolean }) {
  return win ? <Check size={16} className="text-[#00C853] inline ml-1" /> : <X size={16} className="text-red-400 inline ml-1" />
}

export default function B2BComparisonTable() {
  return (
    <section className="py-16 bg-[#F8F9FA]">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A2E] text-center mb-12">
          See How We Stack Up
        </h2>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 text-left text-gray-600 font-semibold bg-gray-50 w-1/4">Feature</th>
                <th className="p-4 text-center bg-[#1A1A2E] text-white font-bold relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00C853] text-white text-xs font-bold px-3 py-1 rounded-full">
                    BEST VALUE
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <Crown size={16} className="text-yellow-400" />
                    <span>ShieldHome (Vivint)</span>
                  </div>
                </th>
                <th className="p-4 text-center text-gray-600 font-semibold bg-gray-50">ADT Business</th>
                <th className="p-4 text-center text-gray-600 font-semibold bg-gray-50">Traditional Commercial</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-4 text-sm font-medium text-gray-700">{row.feature}</td>
                  <td className="p-4 text-center bg-green-50/80 border-x-2 border-[#00C853]/20">
                    <span className="font-bold text-[#1A1A2E] text-sm">{row.shield}</span>
                    <WinBadge win />
                  </td>
                  <td className="p-4 text-center text-sm text-gray-600">
                    {row.adt}
                    {row.feature !== 'Professional Installation' && <WinBadge win={false} />}
                  </td>
                  <td className="p-4 text-center text-sm text-gray-600">
                    {row.trad}
                    <WinBadge win={false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {rows.map((row) => (
            <div key={row.feature} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="font-semibold text-[#1A1A2E] text-sm mb-3">{row.feature}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2 border border-[#00C853]/20">
                  <span className="text-xs font-bold text-[#00C853]">ShieldHome</span>
                  <span className="text-sm font-bold text-[#1A1A2E]">{row.shield} <Check size={14} className="text-[#00C853] inline" /></span>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs text-gray-500">ADT Business</span>
                  <span className="text-sm text-gray-600">{row.adt}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs text-gray-500">Traditional</span>
                  <span className="text-sm text-gray-600">{row.trad}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

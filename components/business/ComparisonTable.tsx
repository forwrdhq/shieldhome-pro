const rows = [
  { feature: 'Monthly Monitoring', shield: '~$40/mo', adt: '$50–53/mo', traditional: '$60–120/mo', shieldBest: true },
  { feature: 'Contract Required', shield: 'Month-to-Month Option', adt: '36 Months Mandatory', traditional: '36–60 Months', shieldBest: true },
  { feature: 'Response Time', shield: '8 Seconds', adt: '~60 Seconds', traditional: 'Varies', shieldBest: true },
  { feature: 'Smart Technology', shield: 'Full Smart Business', adt: 'Basic', traditional: 'Outdated', shieldBest: true },
  { feature: 'Professional Installation', shield: 'Included', adt: 'Included', traditional: 'Extra Cost', shieldBest: false },
  { feature: 'Equipment Financing', shield: '0% APR Available', adt: 'Limited', traditional: 'Rarely', shieldBest: true },
  { feature: 'Competitor Buyout', shield: 'Up to $1,000', adt: 'No', traditional: 'No', shieldBest: true },
]

function Check({ good }: { good: boolean }) {
  return (
    <span className={`text-lg ${good ? 'text-green-500' : 'text-red-400'}`}>
      {good ? '✅' : '❌'}
    </span>
  )
}

export default function ComparisonTable() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1A1A2E' }}>
          See How We Stack Up
        </h2>

        {/* Desktop table */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 w-1/4">Feature</th>
                <th className="px-6 py-4 w-1/4">
                  <div
                    className="rounded-lg px-3 py-2 text-sm font-bold text-white text-center"
                    style={{ background: '#00C853' }}
                  >
                    ShieldHome (Vivint)
                    <span className="block text-xs font-semibold opacity-90 mt-0.5">⭐ BEST VALUE</span>
                  </div>
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 w-1/4">ADT Business</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700 w-1/4">Traditional Commercial</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{row.feature}</td>
                  <td
                    className="px-6 py-4 text-sm font-semibold text-center"
                    style={{ color: '#00C853', borderLeft: '2px solid #00C853', borderRight: '2px solid #00C853' }}
                  >
                    {row.shield} {row.shieldBest && '✅'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    {row.adt} {row.feature !== 'Professional Installation' && <Check good={false} />}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    {row.traditional} <Check good={false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {rows.map((row) => (
            <div key={row.feature} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-4 py-3 font-semibold text-sm" style={{ background: '#1A1A2E', color: 'white' }}>
                {row.feature}
              </div>
              <div className="grid grid-cols-3 divide-x divide-gray-100">
                <div className="px-3 py-3 text-center">
                  <div className="text-xs font-bold mb-1" style={{ color: '#00C853' }}>ShieldHome</div>
                  <div className="text-xs font-medium" style={{ color: '#00C853' }}>{row.shield} {row.shieldBest && '✅'}</div>
                </div>
                <div className="px-3 py-3 text-center">
                  <div className="text-xs font-bold text-gray-500 mb-1">ADT</div>
                  <div className="text-xs text-gray-600">{row.adt}</div>
                </div>
                <div className="px-3 py-3 text-center">
                  <div className="text-xs font-bold text-gray-500 mb-1">Traditional</div>
                  <div className="text-xs text-gray-600">{row.traditional}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

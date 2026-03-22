import { Check, X } from 'lucide-react'

const rows = [
  {
    feature: 'Monthly cost',
    current: '$45–$65/mo typical',
    shieldhome: 'Starting at $33/mo',
    highlight: false,
  },
  {
    feature: 'Contract length',
    current: '36–60 months locked in',
    shieldhome: 'Flexible — month-to-month available',
    highlight: false,
  },
  {
    feature: 'Equipment',
    current: '3–10+ years old',
    shieldhome: 'Brand new, latest generation',
    highlight: false,
  },
  {
    feature: 'Smart home integration',
    current: null,
    shieldhome: 'Full smart home ecosystem',
    highlight: false,
  },
  {
    feature: 'Mobile app',
    current: 'Basic or no app',
    shieldhome: 'Full HD camera feeds + smart controls',
    highlight: false,
  },
  {
    feature: 'Cancellation fee',
    current: '$800–$1,400 out of pocket',
    shieldhome: 'We cover up to $1,000',
    highlight: true,
  },
]

export default function SavingsComparison() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
            See How Much You&apos;ll Save
          </h2>
          <p className="text-gray-600">Compare your current provider to a Vivint smart home system</p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-500 w-1/3">
                  Feature
                </th>
                <th className="px-6 py-4 bg-gray-100 text-center text-sm font-semibold text-gray-500 w-1/3">
                  Your Current Provider
                </th>
                <th className="px-6 py-4 bg-green-50 text-center text-sm font-semibold text-[#00C853] w-1/3">
                  With ShieldHome + Vivint
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.feature}
                  className={row.highlight ? 'bg-green-50/30' : ''}
                >
                  <td className="px-6 py-4 font-semibold text-gray-900 border-t border-gray-100">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4 text-center border-t border-gray-100">
                    {row.current === null ? (
                      <span className="inline-flex items-center gap-1.5 text-red-400">
                        <X size={16} /> Limited or none
                      </span>
                    ) : (
                      <span className={row.highlight ? 'text-red-500 font-semibold' : 'text-gray-500'}>
                        {row.highlight && <X size={14} className="inline mr-1" />}
                        {row.current}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center border-t border-gray-100">
                    <span className={row.highlight ? 'text-[#00C853] font-bold text-lg' : 'text-[#1A1A2E] font-semibold'}>
                      <Check size={16} className="inline mr-1 text-[#00C853]" />
                      {row.shieldhome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {rows.map((row) => (
            <div
              key={row.feature}
              className={`rounded-xl border p-4 ${row.highlight ? 'border-[#00C853] bg-green-50/30' : 'border-gray-200'}`}
            >
              <p className="font-semibold text-gray-900 text-sm mb-3">{row.feature}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Current</p>
                  {row.current === null ? (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <X size={14} /> Limited or none
                    </p>
                  ) : (
                    <p className={`text-sm ${row.highlight ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                      {row.current}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#00C853] mb-1">ShieldHome</p>
                  <p className={`text-sm ${row.highlight ? 'text-[#00C853] font-bold' : 'text-[#1A1A2E] font-semibold'}`}>
                    <Check size={14} className="inline mr-0.5 text-[#00C853]" />
                    {row.shieldhome}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="#switch-form"
            className="inline-flex items-center gap-2 bg-[#00C853] hover:bg-[#00A846] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-green-200"
          >
            See How Much You&apos;ll Save
          </a>
        </div>
      </div>
    </section>
  )
}

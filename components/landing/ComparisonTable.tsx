import { Check, X, Crown } from 'lucide-react'
import Button from '@/components/ui/Button'

const features = [
  { feature: 'Free Expert Setup', vivint: true, adt: true, simplisafe: false, ring: false },
  { feature: '24/7 Pro Monitoring', vivint: true, adt: true, simplisafe: true, ring: false },
  { feature: 'Smart Home Controls', vivint: 'Full', adt: 'Full', simplisafe: 'Limited', ring: 'Limited' },
  { feature: 'AI-Powered Cameras', vivint: true, adt: false, simplisafe: false, ring: false },
  { feature: 'Package Detection', vivint: true, adt: false, simplisafe: false, ring: true },
  { feature: 'No DIY Required', vivint: true, adt: true, simplisafe: false, ring: false },
  { feature: 'Doorbell Camera w/ 180° View', vivint: true, adt: false, simplisafe: false, ring: true },
  { feature: 'Smart Sentry™ Threat Blocker', vivint: true, adt: false, simplisafe: false, ring: false },
  { feature: 'Google/Alexa Built In', vivint: true, adt: true, simplisafe: true, ring: true },
  { feature: 'Monthly Starting Price', vivint: '$1.33/day', adt: '~$1.83/day', simplisafe: '~$0.60/day', ring: '~$0.33/day' },
]

function Cell({ value, isVivint = false }: { value: boolean | string; isVivint?: boolean }) {
  if (value === true)
    return (
      <div className={`flex items-center justify-center ${isVivint ? 'text-[#00C853]' : 'text-gray-400'}`}>
        <Check size={20} />
      </div>
    )
  if (value === false) return <X size={20} className="text-gray-300 mx-auto" />
  return (
    <span className={`text-sm ${isVivint ? 'font-bold text-[#1A1A2E]' : 'text-gray-600'}`}>
      {value}
    </span>
  )
}

export default function ComparisonTable() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
            Why Choose Vivint?
          </h2>
          <p className="text-gray-600 text-lg">See how Vivint stacks up against the rest</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 text-left text-gray-600 font-semibold bg-gray-50 w-1/3">Feature</th>
                <th className="p-4 text-center bg-[#1A1A2E] text-white font-bold relative">
                  <div className="flex items-center justify-center gap-1.5">
                    <Crown size={16} className="text-yellow-400" />
                    <span>Vivint</span>
                  </div>
                  <div className="text-xs font-normal text-[#00C853] mt-0.5">Our Pick</div>
                </th>
                <th className="p-4 text-center text-gray-600 font-semibold bg-gray-50">ADT</th>
                <th className="p-4 text-center text-gray-600 font-semibold bg-gray-50">SimpliSafe</th>
                <th className="p-4 text-center text-gray-600 font-semibold bg-gray-50">Ring</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-4 text-sm font-medium text-gray-700">{row.feature}</td>
                  <td className="p-4 text-center bg-green-50/80 border-x-2 border-[#00C853]/20">
                    <Cell value={row.vivint} isVivint />
                  </td>
                  <td className="p-4 text-center"><Cell value={row.adt} /></td>
                  <td className="p-4 text-center"><Cell value={row.simplisafe} /></td>
                  <td className="p-4 text-center"><Cell value={row.ring} /></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="p-4 bg-gray-50" />
                <td className="p-4 text-center bg-[#00C853]/10 border-x-2 border-[#00C853]/20">
                  <span className="text-xs font-bold text-[#00C853] uppercase tracking-wider">Best Overall</span>
                </td>
                <td className="p-4 bg-gray-50" />
                <td className="p-4 bg-gray-50" />
                <td className="p-4 bg-gray-50" />
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="text-center mt-8">
          <a href="#quiz">
            <Button variant="primary" size="xl" className="w-full sm:w-auto">
              Get Your Free Vivint Quote
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}

import { Check, X } from 'lucide-react'
import Button from '@/components/ui/Button'

const features = [
  { feature: 'Free Expert Setup', vivint: true, adt: true, simplisafe: false, ring: false },
  { feature: '24/7 Pro Monitoring', vivint: true, adt: true, simplisafe: true, ring: false },
  { feature: 'Smart Home Controls', vivint: 'Full', adt: 'Full', simplisafe: 'Limited', ring: 'Limited' },
  { feature: 'AI-Powered Cameras', vivint: true, adt: false, simplisafe: false, ring: false },
  { feature: 'Package Detection', vivint: true, adt: false, simplisafe: false, ring: true },
  { feature: 'No DIY Required', vivint: true, adt: true, simplisafe: false, ring: false },
  { feature: 'Doorbell Camera w/ 180\u00b0 View', vivint: true, adt: false, simplisafe: false, ring: true },
  { feature: 'Smart Sentry\u2122 Threat Blocker', vivint: true, adt: false, simplisafe: false, ring: false },
  { feature: 'Google/Alexa Built In', vivint: true, adt: true, simplisafe: true, ring: true },
  { feature: 'Monthly Starting Price', vivint: '$1.33/day', adt: '~$1.83/day', simplisafe: '~$0.60/day', ring: '~$0.33/day' },
]

function Cell({ value, isVivint = false }: { value: boolean | string; isVivint?: boolean }) {
  if (value === true)
    return (
      <div className={`flex items-center justify-center ${isVivint ? 'text-emerald-500' : 'text-slate-400'}`}>
        <Check size={20} />
      </div>
    )
  if (value === false) return <X size={20} className="text-slate-300 mx-auto" />
  return (
    <span className={`text-sm font-body ${isVivint ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
      {value}
    </span>
  )
}

export default function ComparisonTable() {
  return (
    <section id="compare" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-12" data-animate>
          <h2 className="text-h2 text-slate-900 mb-3">
            Why Choose Vivint?
          </h2>
          <p className="text-body-lg text-slate-500">See how Vivint stacks up against the rest</p>
        </div>

        <div className="overflow-x-auto" data-animate>
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-4 px-6 text-left text-overline text-slate-700 w-1/3">Feature</th>
                <th className="py-4 px-6 text-center bg-emerald-50 text-overline text-slate-700">
                  <span>Vivint</span>
                  <div className="text-[10px] font-normal text-emerald-600 mt-0.5 normal-case tracking-normal">Our Pick</div>
                </th>
                <th className="py-4 px-6 text-center text-overline text-slate-700">ADT</th>
                <th className="py-4 px-6 text-center text-overline text-slate-700">SimpliSafe</th>
                <th className="py-4 px-6 text-center text-overline text-slate-700">Ring</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row) => (
                <tr key={row.feature} className="border-t border-slate-100">
                  <td className="py-4 px-6 text-body-sm font-medium text-slate-700">{row.feature}</td>
                  <td className="py-4 px-6 text-center bg-emerald-50">
                    <Cell value={row.vivint} isVivint />
                  </td>
                  <td className="py-4 px-6 text-center"><Cell value={row.adt} /></td>
                  <td className="py-4 px-6 text-center"><Cell value={row.simplisafe} /></td>
                  <td className="py-4 px-6 text-center"><Cell value={row.ring} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-10" data-animate>
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

'use client'

import { AlertTriangle, DollarSign, Lock, ShieldAlert } from 'lucide-react'

const stats = [
  {
    icon: <AlertTriangle size={24} className="text-red-500" />,
    stat: 'Every 25.7 seconds',
    desc: 'a burglary happens in America',
  },
  {
    icon: <ShieldAlert size={24} className="text-red-500" />,
    stat: '300% more likely',
    desc: 'homes without security are broken into',
  },
  {
    icon: <DollarSign size={24} className="text-red-500" />,
    stat: '$2,661 average loss',
    desc: 'in stolen property per break-in',
  },
  {
    icon: <Lock size={24} className="text-emerald-400" />,
    stat: '67% of burglars',
    desc: 'skip homes with security systems',
  },
]

interface CrimeStatsProps {
  onQuizOpen: () => void
}

export default function CrimeStats({ onQuizOpen }: CrimeStatsProps) {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16">
        <h2 className="text-h2 text-white text-center mb-3" data-animate>
          Why Smart Homeowners Don&apos;t Wait
        </h2>
        <p className="text-body-sm text-slate-400 text-center mb-12" data-animate>
          FBI crime data shows the real risk of leaving your home unprotected.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {stats.map((s) => (
            <div
              key={s.stat}
              className="bg-slate-800 rounded-lg p-5 border border-slate-700 text-center"
              data-animate
            >
              <div className="flex justify-center mb-3">{s.icon}</div>
              <div className="text-lg md:text-xl font-heading font-bold text-white mb-1">{s.stat}</div>
              <p className="text-caption text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center" data-animate>
          <button
            onClick={onQuizOpen}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-heading font-semibold text-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
          >
            See If Your Home Is at Risk
          </button>
        </div>
      </div>
    </section>
  )
}

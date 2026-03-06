'use client'

import { Shield, AlertTriangle, DollarSign, Lock } from 'lucide-react'

const stats = [
  {
    icon: <AlertTriangle size={24} className="text-red-500" />,
    stat: 'Every 25.7 seconds',
    desc: 'a burglary happens in America',
  },
  {
    icon: <Shield size={24} className="text-red-500" />,
    stat: '300% more likely',
    desc: 'homes without security are broken into',
  },
  {
    icon: <DollarSign size={24} className="text-red-500" />,
    stat: '$2,661 average loss',
    desc: 'in stolen property per break-in',
  },
  {
    icon: <Lock size={24} className="text-[#00C853]" />,
    stat: '67% of burglars',
    desc: 'skip homes with security systems',
  },
]

interface CrimeStatsProps {
  onQuizOpen: () => void
}

export default function CrimeStats({ onQuizOpen }: CrimeStatsProps) {
  return (
    <section className="py-12 bg-[#1A1A2E]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-3">
          Why Smart Homeowners Don&apos;t Wait
        </h2>
        <p className="text-gray-400 text-center mb-10 text-sm">
          FBI crime data shows the real risk of leaving your home unprotected.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {stats.map((s) => (
            <div
              key={s.stat}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 text-center"
            >
              <div className="flex justify-center mb-3">{s.icon}</div>
              <div className="text-lg md:text-xl font-extrabold text-white mb-1">{s.stat}</div>
              <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onQuizOpen}
            className="bg-[#00C853] hover:bg-[#00A846] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors inline-block"
          >
            Check My Home&apos;s Risk Score
          </button>
        </div>
      </div>
    </section>
  )
}

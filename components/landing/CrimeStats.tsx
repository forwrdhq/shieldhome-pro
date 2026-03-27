'use client'

import { AlertTriangle, DollarSign, Lock, ShieldAlert } from 'lucide-react'
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal'

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
  const headingRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useStaggerReveal<HTMLDivElement>(80)
  const ctaRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="py-14 md:py-20 bg-slate-900 relative overflow-hidden">
      {/* Warm radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(180, 130, 60, 0.04)' }} />

      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16 relative">
        <div ref={headingRef} className="text-center mb-8 md:mb-12">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-300)' }}>
            The Reality
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-white mb-2 md:mb-3">
            Why Smart Homeowners Don&apos;t Wait
          </h2>
          <p className="text-[13px] md:text-[15px] font-body text-slate-400 max-w-md mx-auto">
            FBI crime data shows the real risk of leaving your home unprotected.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {stats.map((s) => (
            <div
              key={s.stat}
              className="bg-slate-800/50 rounded-2xl p-5 md:p-6 border border-slate-700/40 hover:border-slate-600/40 transition-all duration-500 text-center"
            >
              <div className="flex justify-center mb-3">{s.icon}</div>
              <div className="text-[16px] md:text-[18px] font-heading font-bold text-white mb-1">{s.stat}</div>
              <p className="text-[12px] md:text-[13px] font-body text-slate-400 leading-[1.5]">{s.desc}</p>
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="text-center">
          <button
            onClick={onQuizOpen}
            className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
          >
            See If Your Home Is at Risk
          </button>
        </div>
      </div>
    </section>
  )
}

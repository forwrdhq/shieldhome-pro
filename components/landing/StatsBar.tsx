'use client'

import { useStaggerReveal } from '@/hooks/useScrollReveal'

const stats = [
  { value: '2M+', label: 'Homes Protected' },
  { value: '14s', label: 'Avg Response Time' },
  { value: '25+', label: 'Years in Business' },
  { value: '#1', label: 'SafeHome.org 2025' },
]

export default function StatsBar() {
  const statsRef = useStaggerReveal<HTMLDivElement>(100)

  return (
    <section className="py-10 md:py-14 bg-slate-50 border-y border-slate-100">
      <div ref={statsRef} className="max-w-4xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-4 gap-3 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading font-bold text-[22px] md:text-[34px] tracking-[-0.03em] text-slate-900 mb-0.5">
                {stat.value}
              </p>
              <p className="text-[9px] md:text-[12px] font-body text-slate-400 uppercase tracking-[0.04em] md:tracking-[0.06em] leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

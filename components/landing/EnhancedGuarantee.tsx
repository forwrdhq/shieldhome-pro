'use client'

import { useEffect, useRef } from 'react'
import { ShieldCheck, Lock, BadgeDollarSign } from 'lucide-react'

interface EnhancedGuaranteeProps {
  onQuizOpen?: () => void
}

const guarantees = [
  {
    icon: ShieldCheck,
    title: '60-Day Unconditional Guarantee',
    body: 'Not satisfied? We remove the system and refund every penny. No questions asked.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Break-In Deductible Coverage',
    body:
      'If a break-in happens while your system is armed, we cover up to $500 of your insurance deductible.',
  },
  {
    icon: Lock,
    title: 'Price Lock Guarantee',
    body:
      'Your monthly monitoring rate is locked for the life of your contract. No surprise rate hikes.',
  },
]

export default function EnhancedGuarantee({ onQuizOpen }: EnhancedGuaranteeProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if ((window as any).fbq) (window as any).fbq('trackCustom', 'GuaranteeSectionViewed')
            if ((window as any).dataLayer) {
              (window as any).dataLayer.push({ event: 'guarantee_viewed' })
            }
            obs.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-14 md:py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(180, 130, 60, 0.05)' }} />

      <div className="max-w-5xl mx-auto px-4 md:px-8 relative">
        <div className="text-center mb-10 md:mb-14">
          <p
            className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3"
            style={{ color: 'var(--color-brass-300)' }}
          >
            Our Promise
          </p>
          <h2 className="font-heading font-bold text-[24px] md:text-[40px] tracking-[-0.03em] text-white mb-3">
            The Protected Home Promise
          </h2>
          <p className="text-[14px] md:text-[16px] font-body text-slate-400 max-w-xl mx-auto leading-[1.6]">
            A stacked guarantee that makes saying yes essentially risk-free.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {guarantees.map((g) => {
            const Icon = g.icon
            return (
              <div
                key={g.title}
                className="bg-slate-800/60 rounded-2xl p-6 md:p-7 border border-slate-700/50 hover:border-emerald-500/40 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-emerald-400" />
                </div>
                <h3 className="text-white font-heading font-bold text-[16px] md:text-[17px] tracking-[-0.015em] mb-2">
                  {g.title}
                </h3>
                <p className="text-[14px] font-body text-slate-400 leading-[1.6]">{g.body}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          {onQuizOpen ? (
            <button
              onClick={onQuizOpen}
              className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-heading font-bold text-[15px] tracking-[-0.01em] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.4)]"
            >
              See The Full Protected Home Promise →
            </button>
          ) : (
            <a
              href="#quiz"
              className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-heading font-bold text-[15px] tracking-[-0.01em] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.4)]"
            >
              See The Full Protected Home Promise →
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

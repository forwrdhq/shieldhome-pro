'use client'

import { DollarSign, Lock, TrendingUp } from 'lucide-react'
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal'

const painCards = [
  {
    icon: <DollarSign size={22} />,
    title: 'The "Commercial" Tax',
    stat: '$300/Year for Nothing',
    body: 'Home monitoring starts at $24.99/mo. Business monitoring starts at $49.99/mo — for the same hardware. That gap is $300/year in pure commercial surcharge with zero additional value.',
  },
  {
    icon: <Lock size={22} />,
    title: 'Contracts Designed So You Can\'t Leave',
    stat: 'Up to 100% termination fees',
    body: "3–5 year contracts. Early termination fees up to 100% of your remaining balance. Relocating? Downsizing? Closing a location? Doesn't matter. You're still paying.",
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'The Rate-Hike Playbook',
    stat: 'Prices doubled in under 4 years',
    body: 'Ring doubled subscription prices in 2023. SimpliSafe raised rates 3x in 4 years. Brinks adds "regulatory recovery fees" after Year 1. What you sign today is never what you\'ll pay in Year 3.',
  },
]

export default function BusinessPainBar() {
  const headingRef = useScrollReveal<HTMLDivElement>()
  const cardsRef = useStaggerReveal<HTMLDivElement>(120)
  const proofRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="py-14 md:py-20 bg-slate-900">
      <div className="max-w-5xl mx-auto px-5 md:px-12">
        {/* Headline */}
        <div ref={headingRef} className="text-center mb-4 md:mb-6">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3 text-red-400/70">
            The Problem
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[36px] tracking-[-0.03em] text-white leading-tight">
            Why Are You Paying More Just Because It&apos;s Called a &ldquo;Business&rdquo; Account?
          </h2>
        </div>

        {/* Subheadline */}
        <p className="text-center text-[14px] md:text-[16px] font-body text-slate-400 max-w-2xl mx-auto mb-10 md:mb-14 leading-relaxed">
          Most commercial security providers charge businesses 30–50% more for identical equipment.
          Same cameras. Same sensors. Same monitoring centre. Different invoice. Here&apos;s exactly what they don&apos;t want you to know:
        </p>

        {/* Pain Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-5 md:gap-6 mb-10 md:mb-12">
          {painCards.map((card) => (
            <div
              key={card.title}
              className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-6 md:p-7 hover:border-slate-600/40 transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 mb-4">
                {card.icon}
              </div>
              <h3 className="font-heading font-bold text-[15px] md:text-[16px] text-white mb-1 tracking-[-0.01em]">
                {card.title}
              </h3>
              <p className="text-[12px] font-heading font-semibold text-red-400/80 mb-3">{card.stat}</p>
              <p className="text-[13px] md:text-[14px] font-body text-slate-400 leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* Source Footnote */}
        <p className="text-[10px] md:text-[11px] font-body text-slate-600 text-center mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed">
          ADT Business pricing per ADT.com, March 2026. Ring pricing history per Ring public announcements, 2023.
          SimpliSafe rate history per customer communications, 2021–2025.
        </p>

        {/* Proof Line */}
        <div ref={proofRef} className="text-center max-w-2xl mx-auto">
          <p className="text-[14px] md:text-[16px] font-body text-slate-300 leading-relaxed mb-6">
            Vivint business monitoring starts at <strong className="text-emerald-400">$39.99/mo</strong> — the same AI-powered hardware used in over 2 million installations. No commercial surcharge. No rate-hike history. No runaround when you need to talk to someone.
          </p>

          {/* Bridge Line */}
          <p className="text-[13px] md:text-[15px] font-body text-slate-500 italic">
            But here&apos;s what most security companies also get wrong: they sell you a system designed for generic risk — not yours.
            Here&apos;s what actually matters for your type of business:
          </p>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal'

const blocks = [
  {
    icon: '\u{1F6E1}',
    title: 'Smart Deter Technology',
    text: "Vivint cameras don't just record crime — they prevent it. Spotlights, sirens, and live 2-way audio scare off intruders before they touch your door.",
  },
  {
    icon: '\u{1F4F1}',
    title: 'One App, Total Control',
    text: 'Lock your doors, watch live camera feeds, adjust your thermostat, and arm your system — all from one app, anywhere in the world.',
  },
  {
    icon: '\u{1F4E1}',
    title: '24/7 Professional Monitoring',
    text: "Real U.S.-based agents watch your system around the clock. If something happens and you can't be reached, they dispatch first responders for you.",
  },
  {
    icon: '\u{1F527}',
    title: 'Professional Installation',
    text: 'No DIY headaches. A certified Vivint technician installs, tests, and walks you through everything — usually within 24 hours.',
  },
]

interface WhyVivintSectionProps {
  onQuizOpen?: () => void
}

export default function WhyVivintSection({ onQuizOpen }: WhyVivintSectionProps) {
  const headingRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useStaggerReveal<HTMLDivElement>(100)
  const ctaRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="py-14 md:py-32 bg-slate-900 relative overflow-hidden">
      {/* Subtle warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(180, 130, 60, 0.03)' }} />

      <div className="max-w-5xl mx-auto px-5 md:px-8 relative">
        <div ref={headingRef} className="text-center mb-10 md:mb-16">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-4" style={{ color: 'var(--color-brass-300)' }}>
            The Vivint Difference
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-white">
            Security That Outsmarts the Rest
          </h2>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 gap-4 md:gap-6">
          {blocks.map((block) => (
            <div
              key={block.title}
              className="bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700/40 hover:border-slate-600/40 transition-all duration-500"
            >
              <div className="flex items-start gap-4">
                <span className="text-[24px] flex-shrink-0 mt-0.5">{block.icon}</span>
                <div>
                  <h3 className="text-white font-heading font-semibold text-[16px] md:text-[17px] tracking-[-0.015em] mb-2">
                    {block.title}
                  </h3>
                  <p className="text-[14px] md:text-[15px] font-body text-slate-400 leading-[1.65]">
                    {block.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="text-center mt-10 md:mt-12">
          {onQuizOpen ? (
            <button
              onClick={onQuizOpen}
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
            >
              Get My Free Quote
            </button>
          ) : (
            <a
              href="#quiz"
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
            >
              Get My Free Quote
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

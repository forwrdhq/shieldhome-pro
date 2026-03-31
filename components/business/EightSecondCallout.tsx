'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

function scrollToForm() {
  document.querySelector('#business-form')?.scrollIntoView({ behavior: 'smooth' })
}

export default function EightSecondCallout() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-16 md:py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_70%)]" />

      <div className="relative max-w-4xl mx-auto px-5 md:px-12 text-center">
        {/* Large Stat Display */}
        <p className="font-heading font-bold text-[80px] md:text-[120px] lg:text-[140px] leading-none text-emerald-400 tracking-[-0.04em]">
          8
        </p>
        <p className="font-heading font-semibold text-[18px] md:text-[24px] text-emerald-400/80 uppercase tracking-[0.12em] -mt-2 mb-3">
          seconds
        </p>
        <p className="font-heading font-bold text-[18px] md:text-[26px] text-white tracking-[-0.02em] mb-2">
          Average Vivint monitoring response time
        </p>
        <p className="text-[16px] md:text-[20px] font-body text-slate-500 mb-8 md:mb-10">
          vs. 60+ second industry average
        </p>

        {/* Supporting Copy */}
        <p className="text-[14px] md:text-[16px] font-body text-slate-300 max-w-xl mx-auto leading-relaxed mb-8 md:mb-10">
          When your alarm triggers, Vivint&apos;s in-house monitoring centre responds in 8 seconds — not 60.
          Police are dispatched before most intruders realise the alarm isn&apos;t going to stop.
        </p>

        {/* Secondary Stats Strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] md:text-[13px] font-body text-slate-400 mb-8 md:mb-10">
          <span>24/7 in-house monitoring</span>
          <span className="text-slate-700">·</span>
          <span>No outsourced call centres</span>
          <span className="text-slate-700">·</span>
          <span>Police dispatch in under 2 minutes</span>
        </div>

        {/* Section CTA */}
        <button
          onClick={scrollToForm}
          className="text-emerald-400 hover:text-emerald-300 font-heading font-semibold text-[14px] md:text-[15px] transition-colors duration-200"
        >
          See what 8-second response means for your business →
        </button>
      </div>
    </section>
  )
}

'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ArrowRight } from 'lucide-react'

function scrollToForm() {
  document.querySelector('#business-form')?.scrollIntoView({ behavior: 'smooth' })
}

export default function CostOfInaction() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-14 md:py-20 bg-slate-900">
      <div className="max-w-3xl mx-auto px-5 md:px-12 text-center">
        <h2 className="font-heading font-bold text-[22px] md:text-[36px] tracking-[-0.03em] text-white mb-6 md:mb-8">
          What Does Staying With Your Current Provider Actually Cost You?
        </h2>

        <div className="space-y-3 mb-8 md:mb-10 text-left max-w-lg mx-auto">
          <div className="flex items-start gap-3 text-[14px] md:text-[16px] font-body text-slate-300">
            <ArrowRight size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-amber-400">$10+/month</strong> in commercial markup you don&apos;t owe
            </span>
          </div>
          <div className="flex items-start gap-3 text-[14px] md:text-[16px] font-body text-slate-300">
            <ArrowRight size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <span>
              <strong className="text-amber-400">$500+/year</strong> in insurance savings you&apos;re not capturing
            </span>
          </div>
          <div className="flex items-start gap-3 text-[14px] md:text-[16px] font-body text-slate-300">
            <ArrowRight size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <span>
              One break-in away from an average <strong className="text-amber-400">$2,661 in losses</strong> with 60-second response
            </span>
          </div>
        </div>

        <p className="text-[14px] md:text-[16px] font-body text-slate-400 mb-3 italic">
          Most business owners who switch say the same thing:
        </p>
        <p className="text-[16px] md:text-[20px] font-heading font-semibold text-white mb-8 md:mb-10">
          &ldquo;I wish I&apos;d done this two years ago.&rdquo;
        </p>

        <p className="text-[14px] md:text-[15px] font-body text-slate-400 mb-6">
          The quote call is free. The install is free. The only thing that costs you is waiting.
        </p>

        <button
          onClick={scrollToForm}
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-semibold text-[15px] rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
        >
          Stop paying the commercial markup. Claim your free audit below.
        </button>
      </div>
    </section>
  )
}

'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import { AlertTriangle } from 'lucide-react'

function scrollToForm() {
  document.querySelector('#business-form')?.scrollIntoView({ behavior: 'smooth' })
}

export default function WarningPS() {
  const warningRef = useScrollReveal<HTMLDivElement>()
  const psRef = useScrollReveal<HTMLDivElement>({ delay: 150 })

  return (
    <section className="py-14 md:py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-5 md:px-12">
        {/* Warning */}
        <div ref={warningRef} className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle size={22} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="font-heading font-bold text-[15px] md:text-[17px] text-amber-800">
              One thing before you close this tab:
            </p>
          </div>
          <div className="text-[13px] md:text-[15px] font-body text-amber-900/80 leading-relaxed space-y-3 ml-[34px]">
            <p>
              The free installation offer, the AI camera upgrade, and the contract buyout up to $1,000 are available for a limited time.
              We can&apos;t guarantee these terms will be available next week.
            </p>
            <p>
              If your business has a security gap right now — and statistically, it does — every day you wait is another day you&apos;re overpaying and underprotected.
            </p>
            <p className="font-medium text-amber-900">
              The quote call is 8 minutes. It&apos;s free. There&apos;s no obligation.
            </p>
          </div>
        </div>

        {/* PS */}
        <div ref={psRef} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 text-center">
          <p className="text-[13px] md:text-[15px] font-body text-slate-600 leading-relaxed mb-5">
            <strong className="text-slate-800">P.S.</strong> Just to recap what&apos;s available when you claim your free Business Security Audit today:{' '}
            Free professional installation ($399 value) · AI Smart Deter camera upgrade ($299 value) ·
            Contract buyout up to $1,000 · 30-Day Satisfaction Guarantee ·
            Insurance documentation for up to $2,000/yr in premium savings.
          </p>
          <p className="text-[14px] md:text-[16px] font-heading font-semibold text-slate-800 mb-2">
            Total value: <span className="text-emerald-600">$2,497+ in Year 1.</span>
          </p>
          <p className="text-[14px] md:text-[16px] font-heading font-semibold text-slate-800 mb-6">
            Cost to claim: <span className="text-emerald-600">One free 8-minute phone call.</span>
          </p>
          <button
            onClick={scrollToForm}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-semibold text-[15px] rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
          >
            Claim My Free Business Audit →
          </button>
        </div>
      </div>
    </section>
  )
}

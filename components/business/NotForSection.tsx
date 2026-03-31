'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import { XCircle, CheckCircle } from 'lucide-react'

function scrollToForm() {
  document.querySelector('#business-form')?.scrollIntoView({ behavior: 'smooth' })
}

const notFor = [
  'You need enterprise-scale coverage across 50+ locations (we focus on 1–10 location businesses)',
  'You need specialized industrial CCTV with custom server infrastructure',
  'Your insurance requires a specific non-Vivint monitoring company by name',
  'You want to self-install — our process requires a certified technician installation',
]

const isFor = [
  "You're a small-to-medium business owner currently paying a commercial markup for identical hardware",
  'You want professional installation without the $99–$300 fee competitors charge',
  'You need per-employee access control without a locksmith on speed dial',
  "You're on ADT, Brinks, Ring, or SimpliSafe and want to see an honest cost comparison",
]

export default function NotForSection() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-14 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-5 md:px-12">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900 mb-2 md:mb-3">
            ShieldHome Pro Is NOT the Right Fit for Every Business
          </h2>
          <p className="text-[13px] md:text-[16px] font-body text-slate-400 max-w-lg mx-auto">
            We&apos;d rather tell you now than waste your time on a call.
            Here&apos;s an honest assessment of where we&apos;re great — and where we&apos;re not.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
          {/* NOT For You */}
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 md:p-7">
            <h3 className="font-heading font-bold text-[15px] md:text-[16px] text-red-700 mb-4">
              This is NOT for you if:
            </h3>
            <ul className="space-y-3">
              {notFor.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] md:text-[14px] font-body text-slate-600 leading-relaxed">
                  <XCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* IS For You */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 md:p-7">
            <h3 className="font-heading font-bold text-[15px] md:text-[16px] text-emerald-700 mb-4">
              This IS for you if:
            </h3>
            <ul className="space-y-3">
              {isFor.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] md:text-[14px] font-body text-slate-600 leading-relaxed">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reframe Line */}
        <p className="text-center text-[14px] md:text-[16px] font-body text-slate-500 max-w-xl mx-auto leading-relaxed">
          If you&apos;re not sure whether we&apos;re the right fit — that&apos;s exactly what the{' '}
          <button onClick={scrollToForm} className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2">
            free quote call
          </button>{' '}
          is for. No pressure, no pitch. Just an honest answer about whether this makes sense for your business.
        </p>
      </div>
    </section>
  )
}

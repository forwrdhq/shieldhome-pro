'use client'

import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import { trackPhoneClick } from '@/lib/google-tracking'
import GoogleLeadForm from './GoogleLeadForm'

function getSlotsRemaining(): number {
  const day = new Date().getDay()
  if (day === 1 || day === 2) return 8
  if (day === 3 || day === 4) return 5
  if (day === 5) return 3
  return 2
}

export default function UrgencySection() {
  const slots = getSlotsRemaining()

  return (
    <>
      {/* Urgency Strip */}
      <section className="bg-amber-500 py-3">
        <p className="text-center text-[13px] font-heading font-semibold text-slate-900 px-4 tracking-[-0.01em]">
          Only {slots} installation slots remaining this week in your area — Schedule yours now
        </p>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-900 py-20 md:py-28 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto px-4 md:px-8 text-center relative">
          <h2 className="font-heading font-bold text-[28px] md:text-[34px] tracking-[-0.025em] text-white mb-3">
            Your Home Deserves Better Security
          </h2>
          <p className="text-[15px] font-body text-slate-400 mb-10">
            Get your free security assessment. We&apos;ll call you back in under 2 minutes.
          </p>

          <GoogleLeadForm compact className="max-w-md mx-auto" />

          <div className="mt-6">
            <a
              href={`tel:${PHONE_NUMBER_RAW}`}
              onClick={() => trackPhoneClick('final_cta')}
              className="text-slate-500 hover:text-slate-300 text-[13px] font-body transition-colors duration-300"
            >
              Prefer to talk? Call {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-slate-950 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[11px] text-slate-600 font-body tracking-wide">
            &copy; 2026 ShieldHome.pro &middot; Authorized Vivint Dealer &middot;{' '}
            <a href="/privacy" className="hover:text-slate-400 transition-colors duration-300">Privacy Policy</a>
          </p>
          <p className="text-[11px] text-slate-700 mt-1.5 font-body">
            Vivint&reg; is a registered trademark of Vivint Smart Home, Inc.
          </p>
        </div>
      </footer>
    </>
  )
}

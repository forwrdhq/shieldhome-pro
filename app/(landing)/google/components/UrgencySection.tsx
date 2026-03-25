'use client'

import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import { trackPhoneClick } from '@/lib/google-tracking'
import GoogleLeadForm from './GoogleLeadForm'

function getPromoEndDate(): string {
  const now = new Date()
  // Promo runs through end of current month
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return endOfMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

function getMonthName(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long' })
}

export default function UrgencySection() {
  const promoEnd = getPromoEndDate()
  const month = getMonthName()

  return (
    <>
      {/* Promotion strip — real offer with real date */}
      <section className="py-4" style={{ backgroundColor: 'var(--color-brass-300)' }}>
        <p className="text-center text-[13px] font-heading font-semibold text-slate-900 px-4 tracking-[-0.01em]">
          Spring Flash Sale — Buy 2 Cameras, Get 1 FREE + Free Outdoor Camera Pro through {promoEnd}
        </p>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-900 py-14 md:py-32 relative overflow-hidden">
        {/* Warm radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(180, 130, 60, 0.04)' }} />

        <div className="max-w-2xl mx-auto px-4 md:px-8 text-center relative">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-3 md:mb-5" style={{ color: 'var(--color-brass-300)' }}>
            Get Started
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-white mb-3 md:mb-4">
            Your Home Deserves Better Security
          </h2>
          <p className="text-[14px] md:text-[16px] font-body text-slate-400 mb-8 md:mb-12 max-w-md mx-auto">
            Get your free quote before the Spring Flash Sale ends March 31. We&apos;ll call you back in under 2 minutes.
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
            &copy; 2026 ShieldHome.pro &middot; Authorized Vivint Partner &middot; Serving All 50 States &middot;{' '}
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

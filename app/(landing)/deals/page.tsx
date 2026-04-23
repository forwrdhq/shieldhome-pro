'use client'

import { useState, useCallback, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Phone, BadgeDollarSign } from 'lucide-react'
import Navigation from '@/components/landing/Navigation'
import HeroDeals from '@/components/landing/HeroDeals'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

// Below-fold: lazy loaded for performance
const PromoBannerDeals = dynamic(() => import('@/components/landing/PromoBannerDeals'))
const TotalShieldPackage = dynamic(() => import('@/components/landing/TotalShieldPackage'))
const StatsBar = dynamic(() => import('@/components/landing/StatsBar'))
const AwardsMarquee = dynamic(() => import('@/components/landing/AwardsMarquee'))
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks'))
const CrimeStats = dynamic(() => import('@/components/landing/CrimeStats'))
const ProductShowcase = dynamic(() => import('@/components/landing/ProductShowcase'))
const TestimonialCarousel = dynamic(() => import('@/components/landing/TestimonialCarousel'))
const ComparisonTable = dynamic(() => import('@/components/landing/ComparisonTable'))
const WhyVivintSection = dynamic(() => import('@/components/landing/WhyVivintSection'))
const EnhancedGuarantee = dynamic(() => import('@/components/landing/EnhancedGuarantee'))
const InlineLeadConfigurator = dynamic(() => import('@/components/landing/InlineLeadConfigurator'))
const FAQSection = dynamic(() => import('@/components/landing/FAQSection'))
const Footer = dynamic(() => import('@/components/landing/Footer'))
const StickyPhoneCTA = dynamic(() => import('@/components/landing/StickyPhoneCTA'))

function DealsPageInner() {
  const [quizModalOpen, setQuizModalOpen] = useState(false)

  const openQuiz = useCallback(() => setQuizModalOpen(true), [])
  const closeQuiz = useCallback(() => setQuizModalOpen(false), [])

  return (
    <div className="min-h-screen bg-white">
      <a href="#main-content" className="skip-to-content">Skip to content</a>

      {/* Spacer for fixed trust bar */}
      <div className="h-9" />

      <Navigation onQuizOpen={openQuiz} />
      <PromoBannerDeals onQuizOpen={openQuiz} />

      <main id="main-content">
        {/* Hero — confidence headline + $0 down with form Step 1 above the fold */}
        <HeroDeals />

        {/* ADT / competitor contract buyout callout — moved up so switchers see it immediately */}
        <section className="bg-slate-100 py-10 md:py-14 border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <BadgeDollarSign size={28} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] md:text-[11px] font-heading font-bold uppercase tracking-[0.16em] text-emerald-700 mb-1.5">
                    Currently with ADT, Brinks, or Another Provider?
                  </p>
                  <h3 className="font-heading font-bold text-[20px] md:text-[26px] text-slate-900 mb-2 tracking-[-0.02em] leading-tight">
                    We&apos;ll Cover Up to $1,000 of Your Existing Contract
                  </h3>
                  <p className="text-[14px] md:text-[15px] font-body text-slate-600 leading-[1.55]">
                    Switch to Vivint and we&apos;ll buy out your contract — seamless switchover,
                    no gap in protection.
                  </p>
                </div>
                <button
                  onClick={openQuiz}
                  className="flex-shrink-0 inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-heading font-semibold text-[14px] md:text-[15px] tracking-[-0.01em] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
                >
                  See My Buyout
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* NEW: Total Shield Package Value Stack */}
        <TotalShieldPackage onQuizOpen={openQuiz} />

        {/* Social proof — placed right after value stack to validate the offer */}
        <StatsBar />
        <AwardsMarquee />

        {/* How It Works */}
        <HowItWorks />

        {/* Crime Stats */}
        <CrimeStats onQuizOpen={openQuiz} />

        {/* Products */}
        <ProductShowcase />

        {/* Testimonials */}
        <TestimonialCarousel />

        {/* Comparison */}
        <ComparisonTable onQuizOpen={openQuiz} />

        {/* Why Vivint */}
        <WhyVivintSection onQuizOpen={openQuiz} />

        {/* Enhanced Protected Home Promise */}
        <EnhancedGuarantee onQuizOpen={openQuiz} />

        {/* Quiz Section */}
        <section id="quiz" className="py-14 md:py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <div className="text-center mb-8 md:mb-12">
              <p
                className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3"
                style={{ color: 'var(--color-brass-400)' }}
              >
                Get Your Custom Quote
              </p>
              <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900 mb-2 md:mb-3">
                Find The Offers You Qualify For
              </h2>
              <p className="text-[13px] md:text-[16px] font-body text-slate-400 max-w-md mx-auto">
                Takes 60 seconds. $0 down.* Install this week.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <InlineLeadConfigurator
                headline="See which offers you qualify for"
                ctaLabel="See What I Qualify For"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection />

        {/* Final CTA */}
        <section className="bg-slate-900 py-14 md:py-32 relative overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none"
            style={{ backgroundColor: 'rgba(5, 150, 105, 0.06)' }}
          />

          <div className="max-w-2xl mx-auto px-4 md:px-8 text-center relative">
            <p
              className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-3 md:mb-5"
              style={{ color: 'var(--color-brass-300)' }}
            >
              Get Started
            </p>
            <h2 className="font-heading font-bold text-[24px] md:text-[40px] tracking-[-0.03em] text-white mb-3 md:mb-4 leading-[1.15]">
              Ready to See Which Offers You Qualify For?
            </h2>
            <p className="text-[14px] md:text-[16px] font-body text-slate-400 mb-8 md:mb-12 max-w-md mx-auto">
              Takes 60 seconds. $0 down.* Install this week.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={openQuiz}
                className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-lg font-heading font-bold text-[16px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.4)] w-full sm:w-auto"
              >
                See If I Qualify →
              </button>
              <a
                href={`tel:${PHONE_NUMBER_RAW}`}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors duration-300 text-[14px] font-body"
              >
                <Phone size={14} />
                <span>Call or text {PHONE_NUMBER}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <div className="bg-white border-t border-slate-100 px-6 py-4">
        <p className="max-w-4xl mx-auto text-[10px] text-slate-400 leading-[1.6] font-body text-center">
          *$0 down and free professional installation available with qualifying purchase and execution of a Vivint monitoring services agreement. Credit approval required. Monthly monitoring fees apply. Offer subject to change. ShieldHome Pro is an independent authorized Vivint dealer.
        </p>
      </div>

      <Footer />

      <StickyPhoneCTA onQuizOpen={openQuiz} />

      {/* Quiz Modal */}
      {quizModalOpen && <InlineLeadConfigurator isModal onClose={closeQuiz} />}
    </div>
  )
}

export default function DealsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <DealsPageInner />
    </Suspense>
  )
}

'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '@/components/landing/Navigation'
import HeroSection from '@/components/landing/HeroSection'
import { Phone } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

// Below-fold: lazy loaded for performance
const PromoBanner = dynamic(() => import('@/components/landing/PromoBanner'))
const StatsBar = dynamic(() => import('@/components/landing/StatsBar'))
const AwardsMarquee = dynamic(() => import('@/components/landing/AwardsMarquee'))
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks'))
const CrimeStats = dynamic(() => import('@/components/landing/CrimeStats'))
const ProductShowcase = dynamic(() => import('@/components/landing/ProductShowcase'))
const TestimonialCarousel = dynamic(() => import('@/components/landing/TestimonialCarousel'))
const ComparisonTable = dynamic(() => import('@/components/landing/ComparisonTable'))
const WhyVivintSection = dynamic(() => import('@/components/landing/WhyVivintSection'))
const GuaranteeSection = dynamic(() => import('@/components/landing/GuaranteeSection'))
const InlineLeadConfigurator = dynamic(() => import('@/components/landing/InlineLeadConfigurator'))
const FAQSection = dynamic(() => import('@/components/landing/FAQSection'))
const Footer = dynamic(() => import('@/components/landing/Footer'))
const StickyPhoneCTA = dynamic(() => import('@/components/landing/StickyPhoneCTA'))

export default function HomePage() {
  const [quizModalOpen, setQuizModalOpen] = useState(false)

  const openQuiz = useCallback(() => setQuizModalOpen(true), [])
  const closeQuiz = useCallback(() => setQuizModalOpen(false), [])

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', { content_name: 'home_security_landing' })
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Skip to content */}
      <a href="#main-content" className="skip-to-content">Skip to content</a>

      {/* Spacer for fixed trust bar (h-9 = 36px) so sticky nav starts below it */}
      <div className="h-9" />

      <Navigation onQuizOpen={openQuiz} />
      <PromoBanner onQuizOpen={openQuiz} />

      <main id="main-content">
        {/* Hero */}
        <HeroSection onQuizOpen={openQuiz} />

        {/* Stats Bar */}
        <StatsBar />

        {/* Awards Marquee */}
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

        {/* Guarantee */}
        <GuaranteeSection onQuizOpen={openQuiz} />

        {/* Quiz Section */}
        <section id="quiz" className="py-14 md:py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <div className="text-center mb-8 md:mb-12">
              <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
                Free Custom Quote
              </p>
              <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900 mb-2 md:mb-3">
                Get Your Free Custom Quote
              </h2>
              <p className="text-[13px] md:text-[16px] font-body text-slate-400 max-w-md mx-auto">
                Takes 60 seconds. No pressure, no obligation.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <InlineLeadConfigurator />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection />

        {/* Final CTA */}
        <section className="bg-slate-900 py-14 md:py-32 relative overflow-hidden">
          {/* Warm radial glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(180, 130, 60, 0.04)' }} />

          <div className="max-w-2xl mx-auto px-4 md:px-8 text-center relative">
            <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-3 md:mb-5" style={{ color: 'var(--color-brass-300)' }}>
              Get Started
            </p>
            <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-white mb-3 md:mb-4">
              Your Home Deserves the #1 Smart Security System
            </h2>
            <p className="text-[14px] md:text-[16px] font-body text-slate-400 mb-8 md:mb-12 max-w-md mx-auto">
              Take 60 seconds to get your free custom quote. No obligation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={openQuiz}
                className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)] w-full sm:w-auto"
              >
                Get My Free Quote
              </button>
              <a
                href={`tel:${PHONE_NUMBER_RAW}`}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors duration-300 text-[13px] font-body"
              >
                <Phone size={14} />
                <span>Or call {PHONE_NUMBER}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky Elements */}
      <StickyPhoneCTA onQuizOpen={openQuiz} />

      {/* Quiz Modal */}
      {quizModalOpen && (
        <InlineLeadConfigurator isModal onClose={closeQuiz} />
      )}
    </div>
  )
}

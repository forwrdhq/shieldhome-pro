'use client'

import { useState, useCallback, useEffect } from 'react'
import Navigation from '@/components/landing/Navigation'
import HeroSection from '@/components/landing/HeroSection'
import SocialProof from '@/components/landing/SocialProof'
import MediaLogos from '@/components/landing/MediaLogos'
import QuizFunnel from '@/components/landing/QuizFunnel'
import ComparisonTable from '@/components/landing/ComparisonTable'
import ProductShowcase from '@/components/landing/ProductShowcase'
import HowItWorks from '@/components/landing/HowItWorks'
import TestimonialCarousel from '@/components/landing/TestimonialCarousel'
import FAQSection from '@/components/landing/FAQSection'
import StickyPhoneCTA from '@/components/landing/StickyPhoneCTA'
import CrimeStats from '@/components/landing/CrimeStats'
import Footer from '@/components/landing/Footer'
import { Phone } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

export default function HomePage() {
  const [quizModalOpen, setQuizModalOpen] = useState(false)

  const openQuiz = useCallback(() => setQuizModalOpen(true), [])
  const closeQuiz = useCallback(() => setQuizModalOpen(false), [])

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', { content_name: 'home_security_landing' })
    }
  }, [])

  // Scroll-triggered animations
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference)')
    if (!mq.matches) return

    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.15 }
    )
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Skip to content */}
      <a href="#main-content" className="skip-to-content">Skip to content</a>

      <Navigation onQuizOpen={openQuiz} />

      <main id="main-content">
        {/* Hero — Slate 900 */}
        <HeroSection onQuizOpen={openQuiz} />

        {/* Trust Bar — Slate 50 */}
        <SocialProof />

        {/* Media Logos — White */}
        <MediaLogos />

        {/* How It Works — Slate 100 */}
        <HowItWorks />

        {/* Crime Stats — Slate 900 */}
        <CrimeStats onQuizOpen={openQuiz} />

        {/* Products — Slate 900 */}
        <ProductShowcase />

        {/* Testimonials — Slate 50 */}
        <TestimonialCarousel />

        {/* Comparison — White */}
        <ComparisonTable />

        {/* Quiz Section — Slate 100 */}
        <section id="quiz" className="py-20 bg-slate-100">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <div className="text-center mb-12" data-animate>
              <h2 className="text-h2 text-slate-900 mb-3">
                Get Your Free Custom Quote
              </h2>
              <p className="text-body-lg text-slate-500">Takes 60 seconds. No pressure, no obligation.</p>
            </div>
            <QuizFunnel />
          </div>
        </section>

        {/* FAQ — White */}
        <FAQSection />

        {/* Final CTA — Slate 900 */}
        <section className="bg-slate-900 py-20 text-center">
          <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-16" data-animate>
            <h2 className="text-h2 text-white mb-4">
              Your Home Deserves the #1 Smart Security System
            </h2>
            <p className="text-body-lg text-slate-400 mb-8">Take 60 seconds to get your free custom quote. No obligation.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={openQuiz}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-lg font-heading font-semibold text-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)] w-full sm:w-auto"
              >
                Get My Free Quote
              </button>
              <a
                href={`tel:${PHONE_NUMBER_RAW}`}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-150 text-sm"
              >
                <Phone size={16} />
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
        <QuizFunnel isModal onClose={closeQuiz} />
      )}
    </div>
  )
}

'use client'

import { useState, useCallback, useEffect } from 'react'
import CountdownTimer from '@/components/landing/CountdownTimer'
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
import ExitIntentPopup from '@/components/landing/ExitIntentPopup'
import CrimeStats from '@/components/landing/CrimeStats'
import SocialProofNotifications from '@/components/landing/SocialProofNotifications'
import StickyQuizCTA from '@/components/landing/StickyQuizCTA'
import AnimatedCounter from '@/components/landing/AnimatedCounter'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import { Phone, Shield } from 'lucide-react'

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
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="text-[#00C853]" size={28} />
                <div>
                  <div className="font-bold text-[#1A1A2E] text-lg leading-none">ShieldHome Pro</div>
                  <div className="text-xs text-gray-500">Authorized Vivint Smart Home Dealer</div>
                </div>
              </div>
            </div>
            <a
              href={`tel:${PHONE_NUMBER_RAW}`}
              className="flex items-center gap-2 bg-[#00C853] hover:bg-[#00A846] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              <Phone size={16} />
              <span className="hidden sm:inline">{PHONE_NUMBER}</span>
              <span className="sm:hidden">Call Now</span>
            </a>
          </div>
        </div>
      </header>

      <CountdownTimer />
      <HeroSection onQuizOpen={openQuiz} />
      <SocialProof />
      <MediaLogos />

      {/* Crime Stats Section */}
      <CrimeStats onQuizOpen={openQuiz} />

      {/* Animated Counter */}
      <div className="py-6 bg-white border-b border-gray-100">
        <AnimatedCounter />
      </div>

      <HowItWorks />
      <ProductShowcase />

      {/* Testimonials — moved BEFORE quiz for social proof */}
      <TestimonialCarousel />

      <ComparisonTable />

      {/* Quiz Section */}
      <section id="quiz" className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
              Get Your Free Custom Quote
            </h2>
            <p className="text-gray-600 text-lg">Takes 60 seconds. No pressure, no obligation.</p>
          </div>
          <QuizFunnel />
        </div>
      </section>

      <FAQSection />

      {/* Final CTA */}
      <section className="bg-[#1A1A2E] py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Your Home Deserves the #1 Smart Security System
          </h2>
          <p className="text-gray-300 text-lg mb-8">Take 60 seconds to get your free custom quote. No obligation.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openQuiz}
              className="bg-[#00C853] hover:bg-[#00A846] text-white px-10 py-4 rounded-xl font-bold text-lg transition-colors w-full sm:w-auto"
            >
              Get My Free Quote
            </button>
            <a href={`tel:${PHONE_NUMBER_RAW}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
              <Phone size={16} />
              <span>Or call {PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 pb-24 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="text-[#00C853]" size={22} />
                <span className="font-bold text-white text-base">ShieldHome Pro</span>
              </div>
              <p className="text-xs leading-relaxed">
                Authorized Vivint Smart Home Dealer. Free quotes, $0 down, expert setup.
              </p>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/compare/best-home-security-systems" className="hover:text-white transition-colors">Best Systems 2026</a></li>
                <li><a href="/home-security" className="hover:text-white transition-colors">Security by State</a></li>
                <li><a href="/home-security-statistics" className="hover:text-white transition-colors">Security Statistics</a></li>
              </ul>
            </div>

            {/* Compare */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Compare</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/compare/vivint-vs-adt" className="hover:text-white transition-colors">Vivint vs ADT</a></li>
                <li><a href="/compare/vivint-vs-simplisafe" className="hover:text-white transition-colors">Vivint vs SimpliSafe</a></li>
                <li><a href="/compare/vivint-vs-ring" className="hover:text-white transition-colors">Vivint vs Ring</a></li>
                <li><a href="/compare" className="hover:text-white transition-colors">All Comparisons</a></li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Tools</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/home-security-quiz" className="hover:text-white transition-colors">Security Quiz</a></li>
                <li><a href="/home-security-cost-calculator" className="hover:text-white transition-colors">Cost Calculator</a></li>
                <li><a href="/blog/how-much-does-vivint-cost" className="hover:text-white transition-colors">Vivint Pricing Guide</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-6 text-center space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/do-not-sell" className="hover:text-white transition-colors">Do Not Sell My Info</a>
            </div>
            <p className="text-xs max-w-2xl mx-auto">
              ShieldHome Pro is an independently operated authorized dealer of Vivint Smart Home products and services.
              Vivint® is a registered trademark of Vivint Smart Home, Inc.
            </p>
            <p className="text-xs">© {new Date().getFullYear()} ShieldHome Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Overlays & Sticky Elements */}
      <StickyPhoneCTA onQuizOpen={openQuiz} />
      <StickyQuizCTA onQuizOpen={openQuiz} />
      <SocialProofNotifications />
      <ExitIntentPopup onQuizOpen={openQuiz} />

      {/* Quiz Modal */}
      {quizModalOpen && (
        <QuizFunnel isModal onClose={closeQuiz} />
      )}
    </div>
  )
}

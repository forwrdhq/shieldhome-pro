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
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import { Phone, Shield } from 'lucide-react'

export default function HomePage() {
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
              <span className="sm:hidden">Call/Text Now</span>
            </a>
          </div>
        </div>
      </header>

      <CountdownTimer />
      <HeroSection />
      <SocialProof />
      <MediaLogos />

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

      <ComparisonTable />
      <ProductShowcase />
      <HowItWorks />
      <TestimonialCarousel />
      <FAQSection />

      {/* Final CTA */}
      <section className="bg-[#1A1A2E] py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Your Home Deserves the #1 Smart Security System
          </h2>
          <p className="text-gray-300 text-lg mb-8">Take 60 seconds to get your free custom quote. No obligation.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#quiz"
              className="bg-[#00C853] hover:bg-[#00A846] text-white px-10 py-4 rounded-xl font-bold text-lg transition-colors"
            >
              Get My Free Quote →
            </a>
            <a href={`tel:${PHONE_NUMBER_RAW}`} className="flex items-center gap-2 text-white hover:text-[#00C853] transition-colors">
              <Phone size={20} />
              <span>Or call/text {PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 pb-24 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3">
            <p className="font-semibold text-white">ShieldHome Pro — Authorized Vivint Smart Home Dealer</p>
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

      <StickyPhoneCTA />
      <ExitIntentPopup />
    </div>
  )
}

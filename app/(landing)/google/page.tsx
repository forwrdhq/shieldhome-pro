'use client'

import { useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import QuizFunnel from '@/components/landing/QuizFunnel'
import ComparisonTable from '@/components/landing/ComparisonTable'
import ProductShowcase from '@/components/landing/ProductShowcase'
import HowItWorks from '@/components/landing/HowItWorks'
import TestimonialCarousel from '@/components/landing/TestimonialCarousel'
import FAQSection from '@/components/landing/FAQSection'
import StickyPhoneCTA from '@/components/landing/StickyPhoneCTA'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'
import { CheckCircle, Phone } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

const HEADLINES: Record<string, string> = {
  'home-security': 'Professional Home Security Systems — Free Setup',
  'vivint': 'Get a Free Quote from a Vivint Authorized Dealer',
  'security-cameras': 'Smart Security Cameras with 24/7 Pro Monitoring',
  'home-alarm': 'Advanced Home Alarm Systems — Set Up in 24 Hours',
  'adt-alternative': 'Looking for an ADT Alternative? Compare Vivint',
}

function GoogleContent() {
  const searchParams = useSearchParams()
  const kw = searchParams.get('kw') || ''
  const headline = HEADLINES[kw] || 'Smart Home Security — Expert Setup, $0 Down'

  const [quizModalOpen, setQuizModalOpen] = useState(false)
  const openQuiz = useCallback(() => setQuizModalOpen(true), [])
  const closeQuiz = useCallback(() => setQuizModalOpen(false), [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation onQuizOpen={openQuiz} />

      {/* Hero */}
      <section className="bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{headline}</h1>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-slate-400">
            {['2M+ Homes Protected', '4.8/5 Rating', 'Free Setup', '24/7 Monitoring'].map(s => (
              <span key={s} className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-emerald-500" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section id="quiz" className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="text-center mb-10">
            <h2 className="text-h2 text-slate-900 mb-2">
              Get Your Free Custom Quote
            </h2>
            <p className="text-body text-slate-500">Takes 60 seconds. No pressure, no obligation.</p>
          </div>
          <QuizFunnel />
        </div>
      </section>

      <ComparisonTable />
      <ProductShowcase />
      <HowItWorks />
      <TestimonialCarousel />
      <FAQSection />

      <section className="bg-slate-900 py-12 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-h2 text-white mb-4">
            Ready to Get Protected?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openQuiz}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-heading font-semibold text-lg transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Get My Free Quote
            </button>
            <a href={`tel:${PHONE_NUMBER_RAW}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-150 text-sm">
              <Phone size={16} />
              <span>Or call {PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <StickyPhoneCTA onQuizOpen={openQuiz} />
      {quizModalOpen && (
        <QuizFunnel isModal onClose={closeQuiz} />
      )}
    </div>
  )
}

export default function GooglePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <GoogleContent />
    </Suspense>
  )
}

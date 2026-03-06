'use client'

import { useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import QuizFunnel from '@/components/landing/QuizFunnel'
import TestimonialCarousel from '@/components/landing/TestimonialCarousel'
import StickyPhoneCTA from '@/components/landing/StickyPhoneCTA'
import ExitIntentPopup from '@/components/landing/ExitIntentPopup'
import { Shield, Phone, CheckCircle, Star } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

const HEADLINES: Record<string, string> = {
  'home-security': 'Professional Home Security — Free Setup Today',
  'vivint': 'Get a Free Quote from a Vivint Authorized Dealer',
  'security-cameras': 'Smart Security Cameras — Free Installation',
  'home-alarm': 'Home Alarm Systems — Set Up in 24 Hours',
  'adt-alternative': 'Looking for an ADT Alternative? Compare Vivint',
}

function GoogleContent() {
  const searchParams = useSearchParams()
  const kw = searchParams.get('kw') || ''
  const headline = HEADLINES[kw] || 'Smart Home Security — $0 Down, Free Setup'

  const [quizModalOpen, setQuizModalOpen] = useState(false)
  const openQuiz = useCallback(() => setQuizModalOpen(true), [])
  const closeQuiz = useCallback(() => setQuizModalOpen(false), [])

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="text-[#00C853]" size={28} />
              <div>
                <div className="font-bold text-[#1A1A2E] text-lg leading-none">ShieldHome Pro</div>
                <div className="text-xs text-gray-500">Authorized Vivint Dealer</div>
              </div>
            </div>
            <a href={`tel:${PHONE_NUMBER_RAW}`} className="flex items-center gap-2 bg-[#00C853] hover:bg-[#00A846] text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors min-h-[44px]">
              <Phone size={16} />
              <span className="hidden sm:inline">{PHONE_NUMBER}</span>
              <span className="sm:hidden">Call Now</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero — tight, high-intent */}
      <section className="bg-[#1A1A2E] py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{headline}</h1>
          <p className="text-gray-300 mb-6">
            $0 down. Free cameras. Free expert installation. 24/7 professional monitoring.
          </p>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-5 mb-6 text-sm text-gray-300">
            <span className="flex items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className={i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400 fill-yellow-400 opacity-70'} />
                ))}
              </div>
              4.8/5 Rating
            </span>
            {['2M+ Homes', 'BBB A+', 'Free Setup'].map(s => (
              <span key={s} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-[#00C853]" />
                {s}
              </span>
            ))}
          </div>

          {/* Prominent phone CTA for high-intent */}
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            className="inline-flex items-center gap-2 text-[#00C853] hover:text-white text-lg font-bold transition-colors"
          >
            <Phone size={20} />
            Call Now: {PHONE_NUMBER}
          </a>
        </div>
      </section>

      {/* Quiz — the primary conversion point */}
      <section id="quiz" className="py-12 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A2E] mb-2">
              Get My Free Custom Quote
            </h2>
            <p className="text-gray-600">60 seconds. No obligation.</p>
          </div>
          <QuizFunnel />
        </div>
      </section>

      {/* Social proof — brief */}
      <TestimonialCarousel />

      {/* Final CTA */}
      <section className="bg-[#1A1A2E] py-10 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Ready to Get Protected?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openQuiz}
              className="bg-[#00C853] hover:bg-[#00A846] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors w-full sm:w-auto min-h-[48px]"
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

      <footer className="bg-gray-900 text-gray-400 py-8 pb-24 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <p className="font-semibold text-white">ShieldHome Pro — Authorized Vivint Smart Home Dealer</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms" className="hover:text-white">Terms of Service</a>
          </div>
          <p className="text-xs max-w-2xl mx-auto">
            ShieldHome Pro is an independently operated authorized dealer of Vivint Smart Home products and services.
            Vivint® is a registered trademark of Vivint Smart Home, Inc.
          </p>
          <p className="text-xs">© {new Date().getFullYear()} ShieldHome Pro. All rights reserved.</p>
        </div>
      </footer>

      <StickyPhoneCTA onQuizOpen={openQuiz} />
      <ExitIntentPopup onQuizOpen={openQuiz} />

      {quizModalOpen && (
        <QuizFunnel isModal onClose={closeQuiz} />
      )}
    </div>
  )
}

export default function GooglePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <GoogleContent />
    </Suspense>
  )
}

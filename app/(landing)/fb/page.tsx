'use client'

import { useState, useCallback } from 'react'
import QuizFunnel from '@/components/landing/QuizFunnel'
import TestimonialCarousel from '@/components/landing/TestimonialCarousel'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'
import { Star, Lock } from 'lucide-react'

export default function FacebookPage() {
  const [quizModalOpen, setQuizModalOpen] = useState(false)
  const openQuiz = useCallback(() => setQuizModalOpen(true), [])
  const closeQuiz = useCallback(() => setQuizModalOpen(false), [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <Navigation onQuizOpen={openQuiz} />

      {/* Hero */}
      <section className="bg-slate-900 py-8 text-center">
        <div className="max-w-xl mx-auto px-4">
          <p className="text-emerald-500 text-xs font-bold tracking-widest uppercase mb-2">
            FREE HOME SECURITY QUOTE
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Homes Without Security Are 3x More Likely to Be Broken Into
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-300 flex-wrap mt-3">
            <span className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              4.8/5 Rating
            </span>
            <span>• Free Setup</span>
            <span>• $0 Down</span>
            <span>• 24/7 Monitoring</span>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section id="quiz" className="py-8 px-4">
        <div className="max-w-xl mx-auto">
          <QuizFunnel />
        </div>
      </section>

      {/* Trust */}
      <section className="py-4 px-4">
        <div className="max-w-xl mx-auto flex items-center justify-center gap-2 text-sm text-gray-600">
          <Lock size={16} className="text-emerald-500" />
          <span>256-bit encryption. Your data is secure and will never be sold.</span>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <TestimonialCarousel />
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {quizModalOpen && (
        <QuizFunnel isModal onClose={closeQuiz} />
      )}
    </div>
  )
}

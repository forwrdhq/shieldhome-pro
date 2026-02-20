import QuizFunnel from '@/components/landing/QuizFunnel'
import TestimonialCarousel from '@/components/landing/TestimonialCarousel'
import ExitIntentPopup from '@/components/landing/ExitIntentPopup'
import { Shield, Phone, Star, Lock } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Home Security Quote — Vivint Authorized Dealer',
  description: 'Get a free home security quote in 60 seconds. Free professional installation + free doorbell camera.',
}

export default function FacebookPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Slim header */}
      <header className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-[#00C853]" size={24} />
            <span className="font-bold text-[#1A1A2E]">ShieldHome Pro</span>
          </div>
          <a href={`tel:${PHONE_NUMBER_RAW}`} className="flex items-center gap-1.5 text-[#00C853] font-semibold text-sm">
            <Phone size={16} />
            {PHONE_NUMBER}
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#1A1A2E] py-8 text-center">
        <div className="max-w-xl mx-auto px-4">
          <p className="text-[#00C853] text-xs font-bold tracking-widest uppercase mb-2">
            FREE HOME SECURITY QUOTE
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            Smart Security. Professionally Installed. Starting Today.
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-300 flex-wrap mt-3">
            <span className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              4.8/5 Rating
            </span>
            <span>• Free Installation</span>
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
          <Lock size={16} className="text-[#00C853]" />
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
      <footer className="bg-gray-900 text-gray-500 py-6 text-center text-xs px-4">
        <p className="mb-2">ShieldHome Pro — Authorized Vivint Smart Home Dealer</p>
        <p className="mb-2">
          <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
          {' | '}
          <a href="/terms" className="hover:text-gray-300">Terms of Service</a>
        </p>
        <p className="text-xs max-w-md mx-auto mb-2">
          ShieldHome Pro is an independently operated authorized dealer of Vivint Smart Home products and services.
        </p>
        <p>© {new Date().getFullYear()} ShieldHome Pro. All rights reserved.</p>
      </footer>

      <ExitIntentPopup />
    </div>
  )
}

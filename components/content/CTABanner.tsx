import { Phone, ArrowRight, Shield, BarChart3 } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface CTABannerProps {
  variant: 'quiz' | 'phone' | 'comparison'
  title?: string
  subtitle?: string
}

export default function CTABanner({ variant, title, subtitle }: CTABannerProps) {
  if (variant === 'quiz') {
    return (
      <div className="my-8 rounded-2xl bg-gradient-to-r from-[#00C853] to-[#00A846] p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">
              {title || 'Get Your Free Home Security Quote'}
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              {subtitle ||
                'Answer a few quick questions and get a personalized quote in under 2 minutes. No obligation, no credit card required.'}
            </p>
          </div>
          <a
            href="/home-security-quiz"
            className="inline-flex items-center gap-2 bg-white text-[#00C853] font-bold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0 text-sm"
          >
            Start Free Quiz
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    )
  }

  if (variant === 'phone') {
    return (
      <div className="my-8 rounded-2xl bg-[#1A1A2E] p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#00C853]/20 flex items-center justify-center">
            <Phone size={24} className="text-[#00C853]" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">
              {title || 'Speak With a Security Expert'}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {subtitle ||
                'Our team is available 7 days a week to answer your questions and help you find the perfect security solution for your home.'}
            </p>
          </div>
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            className="inline-flex items-center gap-2 bg-[#00C853] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#00A846] transition-colors flex-shrink-0 text-sm"
          >
            <Phone size={16} />
            Call {PHONE_NUMBER}
          </a>
        </div>
      </div>
    )
  }

  // variant === 'comparison'
  return (
    <div className="my-8 rounded-2xl bg-[#F8F9FA] border border-gray-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#00C853]/10 flex items-center justify-center">
          <BarChart3 size={24} className="text-[#00C853]" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#1A1A2E] mb-1">
            {title || 'Compare Top Home Security Systems'}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {subtitle ||
              'See how the leading home security providers stack up side-by-side on price, features, equipment, and customer satisfaction.'}
          </p>
        </div>
        <a
          href="/compare/best-home-security-systems"
          className="inline-flex items-center gap-2 bg-[#1A1A2E] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#2a2a4e] transition-colors flex-shrink-0 text-sm"
        >
          Compare Systems
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  )
}

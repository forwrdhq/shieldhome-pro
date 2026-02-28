'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle, Phone, MessageSquare, Home, Shield, AlertTriangle, Share2, Clock } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import { getRiskLevel } from '@/components/landing/QuizFunnel'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const entryPoints = searchParams.get('ep') || '1-5'
  const concerns = (searchParams.get('concerns') || '').split(',').filter(Boolean)
  const timeline = searchParams.get('timeline') || ''

  const risk = getRiskLevel(entryPoints, concerns)

  const riskColors: Record<string, { bg: string; border: string; text: string; bar: string }> = {
    HIGH: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', bar: 'bg-red-500' },
    MODERATE: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', bar: 'bg-yellow-500' },
    LOW: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', bar: 'bg-green-500' },
  }
  const riskStyle = riskColors[risk.level] || riskColors.MODERATE

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://shieldhome.pro'
  const shareText = 'I just got a free home security assessment from ShieldHome Pro. Check yours:'

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Conversion tracking pixels */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof fbq !== 'undefined') {
              fbq('track', 'Lead', { content_name: 'security_quote', value: 900, currency: 'USD' });
              fbq('track', 'CompleteRegistration');
            }
            if (typeof gtag !== 'undefined') {
              gtag('event', 'conversion', { value: 900.0, currency: 'USD' });
              gtag('event', 'generate_lead', { event_category: 'form_submission', event_label: 'quiz_funnel', value: 900 });
            }
          `
        }}
      />

      <div className="max-w-2xl mx-auto px-4 py-12 flex-1">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="text-[#00C853]" size={40} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
            Your Free Quote Request Is In!
          </h1>
        </div>

        {/* Security Risk Score Card */}
        <div className={`${riskStyle.bg} ${riskStyle.border} border rounded-2xl p-6 mb-8`}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className={riskStyle.text} />
            <h2 className="font-bold text-lg text-gray-900">Your Home Security Risk Score</h2>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`${riskStyle.bar} h-4 rounded-full transition-all duration-1000`}
                  style={{ width: `${risk.score}%` }}
                />
              </div>
            </div>
            <div className={`${riskStyle.text} font-extrabold text-2xl`}>{risk.score}</div>
          </div>

          <p className="text-gray-700 text-sm mb-3">
            Based on your answers, your home has{' '}
            <strong>{entryPoints} entry points</strong> and{' '}
            {concerns.length > 0 ? (
              <>concerns about <strong>{concerns.length} security risk{concerns.length > 1 ? 's' : ''}</strong></>
            ) : (
              'potential security gaps'
            )}
            .
          </p>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${riskStyle.bg} ${riskStyle.text} border ${riskStyle.border}`}>
            <Shield size={14} />
            Risk Level: {risk.level}
          </div>
        </div>

        {/* What Happens Next */}
        <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Here&apos;s what happens next:</h2>

        <div className="space-y-4 mb-8">
          {[
            {
              icon: <Clock className="text-[#00C853]" size={24} />,
              title: '1. Expect a Call Within 2 Minutes',
              desc: 'A Vivint Smart Home Pro will call you shortly to go over your custom security plan.',
            },
            {
              icon: <MessageSquare className="text-[#00C853]" size={24} />,
              title: '2. Check Your Phone',
              desc: "You'll also get a confirmation text in the next 60 seconds.",
            },
            {
              icon: <Home className="text-[#00C853]" size={24} />,
              title: '3. Quick Setup at Your Home',
              desc: timeline === 'ASAP'
                ? "Since you want to get protected ASAP, we'll aim to have a technician at your home within 24-48 hours."
                : "We'll schedule a free setup at a time that works for you. Most setups take about 2-3 hours.",
            },
          ].map(step => (
            <div key={step.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                {step.icon}
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A2E] mb-1">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Referral Card */}
        <div className="bg-[#1A1A2E] rounded-2xl p-6 mb-8 text-center">
          <Share2 size={24} className="text-[#00C853] mx-auto mb-3" />
          <h3 className="text-white font-bold text-lg mb-2">Know someone who needs home security?</h3>
          <p className="text-gray-400 text-sm mb-4">Share your link and they&apos;ll get a free security assessment too.</p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20"
            />
            <button
              onClick={() => {
                navigator.clipboard?.writeText(`${shareText} ${shareUrl}`)
              }}
              className="bg-[#00C853] hover:bg-[#00A846] text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Call CTA */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-gray-600 mb-4">Questions? We&apos;re here to help.</p>
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            className="inline-flex items-center gap-2 bg-[#00C853] hover:bg-[#00A846] text-white px-8 py-3 rounded-xl font-bold text-lg transition-colors"
          >
            <Phone size={20} />
            Call/Text Us: {PHONE_NUMBER}
          </a>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-xs">
        <p>ShieldHome Pro — Authorized Vivint Smart Home Dealer</p>
        <p className="mt-1">© {new Date().getFullYear()} ShieldHome Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="text-[#00C853]" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Loading your results...</h1>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}

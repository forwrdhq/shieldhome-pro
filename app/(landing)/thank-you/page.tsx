'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useMemo } from 'react'
import { CheckCircle, Phone, MessageSquare, Home, Shield, AlertTriangle, Calendar, Clock, Star, Play } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import { getRiskLevel } from '@/components/landing/QuizFunnel'

function generateCalendarUrl() {
  const now = new Date()
  const start = new Date(now.getTime() + 5 * 60 * 1000)
  const end = new Date(start.getTime() + 15 * 60 * 1000)

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'ShieldHome Pro — Security Consultation Call',
    dates: `${fmt(start)}/${fmt(end)}`,
    details: 'A Vivint Smart Home Pro will call you to discuss your personalized security plan. Have questions ready!',
  })

  return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`
}

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

  const callbackTime = useMemo(() => {
    const t = new Date(Date.now() + 2 * 60 * 1000)
    return t.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }, [])

  const calendarUrl = useMemo(() => generateCalendarUrl(), [])

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
            You&apos;re In! Your Free Quote Is On the Way.
          </h1>

          {/* Google review-style badge */}
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} className={i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400 fill-yellow-400 opacity-70'} />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">4.8/5 from 58,000+ reviews</span>
          </div>
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
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
              <Clock className="text-[#00C853]" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#1A1A2E] mb-1">1. Expect a Call by {callbackTime}</h3>
              <p className="text-gray-600 text-sm mb-3">A Vivint Smart Home Pro will call you shortly to go over your custom security plan.</p>
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1A1A2E] hover:bg-[#2a2a4e] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                <Calendar size={16} />
                Add to My Calendar
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
              <MessageSquare className="text-[#00C853]" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[#1A1A2E] mb-1">2. Check Your Phone</h3>
              <p className="text-gray-600 text-sm">You&apos;ll get a confirmation text in the next 60 seconds.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
              <Home className="text-[#00C853]" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[#1A1A2E] mb-1">3. Quick Setup at Your Home</h3>
              <p className="text-gray-600 text-sm">
                {timeline === 'ASAP'
                  ? "Since you want to get protected ASAP, we'll aim to have a technician at your home within 24 hours."
                  : "We'll schedule a free setup at a time that works for you. Most setups take about 2-3 hours."}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Consultation */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm text-center">
          <Calendar size={28} className="text-[#00C853] mx-auto mb-3" />
          <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">
            Prefer to Pick Your Own Time?
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Schedule your free consultation for whenever works best. Most calls take 10-15 minutes.
          </p>
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#00C853] hover:bg-[#00A846] text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            <Calendar size={18} />
            Pick My Preferred Time
          </a>
        </div>

        {/* Meet Your Pro — video placeholder */}
        <div className="bg-[#1A1A2E] rounded-2xl p-6 mb-8 text-center overflow-hidden">
          <h3 className="text-white font-bold text-lg mb-2">Meet Your Smart Home Pro</h3>
          <p className="text-gray-400 text-sm mb-4">See what to expect during your free consultation.</p>
          <div className="relative rounded-xl overflow-hidden aspect-video bg-black/40 flex items-center justify-center cursor-pointer group max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#00C853] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play size={28} className="text-white ml-1" />
            </div>
            <p className="absolute bottom-3 text-sm text-gray-300 font-medium">Watch 60-second intro</p>
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

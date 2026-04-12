'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Lock, CheckCircle } from 'lucide-react'
import { fireMetaEvent } from '../../components/MetaPixelEvents'
import SecurityScoreGauge from './SecurityScoreGauge'
import FloodlightCameraSection from './FloodlightCameraSection'
import ValueStack from './ValueStack'
import BookingCTA from './BookingCTA'

interface QuizResults {
  leadId: string | null
  firstName: string
  securityScore: number
  riskLevel: string
  vulnerabilities: string[]
  recommendedPackage: string
  quizAnswers: Record<string, unknown>
  eventId: string
}

export default function MetaResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<QuizResults | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('metaQuizResults')
    if (!stored) {
      router.push('/meta')
      return
    }

    const parsed: QuizResults = JSON.parse(stored)
    setResults(parsed)

    fireMetaEvent('ViewContent', {
      content_name: 'quiz_results',
      content_category: 'home_security',
      value: parsed.securityScore,
    })
  }, [router])

  if (!results) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Subtle emerald glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(16, 185, 129, 0.06) 0%, transparent 60%)',
        }}
      />

      {/* ═══ Header ═══ */}
      <div className="relative z-10 pt-8 pb-2 text-center" style={{ animation: 'fadeUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both' }}>
        <span className="text-white font-heading font-bold text-[15px] tracking-[-0.01em]">
          Shield<span className="text-emerald-400">Home</span>
        </span>
      </div>

      {/* ═══ Personalized greeting ═══ */}
      <div className="relative z-10 text-center mt-4 mb-6 px-5" style={{ animation: 'fadeUp 500ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both' }}>
        <p className="text-[13px] text-slate-400 font-body">
          {results.firstName}&apos;s Home Security Assessment Results
        </p>
      </div>

      {/* ═══ Security Score Gauge ═══ */}
      <div className="relative z-10 px-5">
        <SecurityScoreGauge
          score={results.securityScore}
          riskLevel={results.riskLevel}
          vulnerabilities={results.vulnerabilities}
        />
      </div>

      {/* ═══ Stat callout ═══ */}
      <div
        className="relative z-10 max-w-md mx-auto my-8 px-5"
        style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both' }}
      >
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-5 py-4 text-center">
          <p className="text-[13px] text-red-300/90 font-body leading-relaxed">
            &ldquo;Homes without a security system are broken into every <strong className="text-red-300">25.7 seconds</strong> in the United States.&rdquo;
          </p>
        </div>
      </div>

      {/* ═══ Floodlight Camera Section ═══ */}
      <div
        className="relative z-10 px-5 mb-10"
        style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 350ms both' }}
      >
        <FloodlightCameraSection />
      </div>

      {/* ═══ Value Stack ═══ */}
      <div className="relative z-10 px-5 mb-10">
        <ValueStack />
      </div>

      {/* ═══ Guarantee ═══ */}
      <div
        className="relative z-10 max-w-lg mx-auto px-5 mb-10"
        style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 400ms both' }}
      >
        <p
          className="text-[11px] font-heading font-semibold uppercase tracking-[0.12em] text-center mb-5"
          style={{ color: 'var(--color-brass-300, #E8CBA7)' }}
        >
          The Protected Home Promise
        </p>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-emerald-500/15 border border-emerald-500/25 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
            </div>
            <div>
              <p className="text-[13px] font-heading font-semibold text-white">60-Day Money-Back Guarantee</p>
              <p className="text-[12px] text-slate-400 font-body mt-0.5">Don&apos;t feel safer? We remove everything and refund every penny.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-emerald-500/15 border border-emerald-500/25 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
            </div>
            <div>
              <p className="text-[13px] font-heading font-semibold text-white">Break-In Deductible Coverage</p>
              <p className="text-[12px] text-slate-400 font-body mt-0.5">We cover up to $500 of your insurance deductible if a break-in occurs.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-emerald-500/15 border border-emerald-500/25 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
            </div>
            <div>
              <p className="text-[13px] font-heading font-semibold text-white">No Contract After Equipment Payoff</p>
              <p className="text-[12px] text-slate-400 font-body mt-0.5">Monitoring drops to $17.99/mo. No contract. You stay because you want to.</p>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 text-center mt-3 italic font-body">
          &ldquo;The risk is entirely on us. Not on you.&rdquo;
        </p>
      </div>

      {/* ═══ Testimonials ═══ */}
      <div
        className="relative z-10 max-w-lg mx-auto px-5 mb-10"
        style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 500ms both' }}
      >
        <p
          className="text-[11px] font-heading font-semibold uppercase tracking-[0.12em] text-center mb-5"
          style={{ color: 'var(--color-brass-300, #E8CBA7)' }}
        >
          What Homeowners Are Saying
        </p>
        <div className="space-y-3">
          {/* TODO: Replace with real testimonials */}
          {[
            {
              quote: 'I wish I\u2019d done this years ago. The peace of mind is worth 10x what I\u2019m paying.',
              name: 'Sarah M.',
            },
            {
              quote: 'The floodlight camera caught someone in our driveway at 2am. The spotlight came on and they RAN.',
              name: 'Mike T.',
            },
            {
              quote: 'Installation took 2 hours and the tech set up everything including the app on my phone.',
              name: 'Jennifer R.',
            },
          ].map((testimonial, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-[13px] text-slate-300 font-body italic leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="text-[11px] text-slate-500 mt-2 font-body">&mdash; {testimonial.name}, Homeowner</p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-6 text-[10px] text-slate-600 uppercase tracking-[0.1em] font-heading">
          <span>BBB A+</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full" />
          <span>4.8&#9733; Google</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full" />
          <span>Vivint Authorized</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full" />
          <span>2M+ Homes</span>
        </div>
      </div>

      {/* ═══ Booking CTA ═══ */}
      <div className="relative z-10 px-5 mb-10">
        <BookingCTA eventId={results.eventId} leadId={results.leadId} />
      </div>

      {/* ═══ Urgency ═══ */}
      <div
        className="relative z-10 max-w-md mx-auto px-5 mb-10"
        style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 600ms both' }}
      >
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl px-5 py-4 text-center">
          <p className="text-[13px] font-heading font-semibold text-amber-300 mb-1">
            Limited Availability
          </p>
          <p className="text-[12px] text-amber-300/70 font-body leading-relaxed">
            Our certified installation team can complete{' '}
            <strong className="text-amber-300">{process.env.NEXT_PUBLIC_META_SLOTS_REMAINING || '12'}</strong>{' '}
            installations per month in your area.
          </p>
          <p className="text-[11px] text-amber-300/50 mt-2 font-body">
            This exclusive offer expires 7 days from your assessment date.
          </p>
        </div>
      </div>

      {/* ═══ Footer ═══ */}
      <div className="relative z-10 text-center py-8 px-5">
        <div className="flex items-center justify-center gap-5 text-[10px] text-slate-600 uppercase tracking-[0.1em] font-heading mb-3">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>256-bit Encrypted</span>
          </div>
          <span className="w-1 h-1 bg-slate-700 rounded-full" />
          <span>Vivint Authorized</span>
        </div>
        <p className="text-[11px] text-slate-600 font-body">
          ShieldHome Pro &mdash; Authorized Vivint Smart Home Dealer
        </p>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Phone, FileDown, Shield, Lock } from 'lucide-react'
import { fireMetaEvent } from '../../components/MetaPixelEvents'

const META_PHONE = process.env.NEXT_PUBLIC_META_PHONE || '(801) 348-6050'
const META_PHONE_RAW = process.env.NEXT_PUBLIC_META_PHONE_RAW || '+18013486050'

interface StoredResults {
  leadId: string | null
  firstName: string
  securityScore: number
  riskLevel: string
  recommendedPackage: string
}

export default function ThankYouContent() {
  const router = useRouter()
  const [results, setResults] = useState<StoredResults | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('metaQuizResults')
    if (!stored) {
      router.push('/meta')
      return
    }

    const parsed = JSON.parse(stored)
    setResults(parsed)

    fireMetaEvent('Schedule', {
      value: 350.0,
      currency: 'USD',
      content_name: 'consultation_confirmed',
    })
  }, [router])

  if (!results) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const downloadUrl = results.leadId
    ? `/api/guides/download?leadId=${results.leadId}&source=thank_you`
    : '/api/guides/download?source=thank_you'

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Emerald glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Header */}
      <div className="relative z-10 pt-8 pb-2 text-center" style={{ animation: 'fadeUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both' }}>
        <span className="text-white font-heading font-bold text-[15px] tracking-[-0.01em]">
          Shield<span className="text-emerald-400">Home</span>
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center px-5 pt-8 pb-12 max-w-md mx-auto">
        {/* Success icon */}
        <div
          className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6"
          style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both' }}
        >
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>

        {/* Headline */}
        <h1
          className="text-[24px] md:text-[32px] font-heading font-bold text-white text-center leading-[1.15] tracking-[-0.03em] mb-3"
          style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 150ms both' }}
        >
          You&apos;re All Set, {results.firstName}!
        </h1>

        <p
          className="text-[14px] text-slate-400 font-body text-center leading-relaxed mb-8"
          style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both' }}
        >
          A ShieldHome security specialist will call you shortly to review your Security Score ({results.securityScore}/100) and walk you through your personalized protection plan.
        </p>

        {/* What happens next */}
        <div
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 mb-8"
          style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both' }}
        >
          <p
            className="text-[11px] font-heading font-semibold uppercase tracking-[0.12em] mb-4"
            style={{ color: 'var(--color-brass-300, #E8CBA7)' }}
          >
            What Happens Next
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-500/15 border border-emerald-500/25 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[11px] font-heading font-bold text-emerald-400">1</span>
              </div>
              <div>
                <p className="text-[13px] font-heading font-semibold text-white">We&apos;ll Call You</p>
                <p className="text-[12px] text-slate-400 font-body mt-0.5">A specialist will reach out within the hour to review your results.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-500/15 border border-emerald-500/25 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[11px] font-heading font-bold text-emerald-400">2</span>
              </div>
              <div>
                <p className="text-[13px] font-heading font-semibold text-white">Customize Your Plan</p>
                <p className="text-[12px] text-slate-400 font-body mt-0.5">We&apos;ll tailor the Total Shield Package to your home&apos;s specific needs.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-500/15 border border-emerald-500/25 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[11px] font-heading font-bold text-emerald-400">3</span>
              </div>
              <div>
                <p className="text-[13px] font-heading font-semibold text-white">Professional Installation</p>
                <p className="text-[12px] text-slate-400 font-body mt-0.5">A certified Vivint technician installs everything in ~3 hours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Can't wait CTA */}
        <div
          className="w-full mb-6"
          style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 400ms both' }}
        >
          <p className="text-[12px] text-slate-500 font-body text-center mb-3">
            Can&apos;t wait? Call us now:
          </p>
          <a
            href={`tel:${META_PHONE_RAW}`}
            className="flex items-center justify-center gap-2.5 w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-semibold text-[15px] py-4 px-8 rounded-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
          >
            <Phone className="w-5 h-5" />
            {META_PHONE}
          </a>
        </div>

        {/* Save contact */}
        <div
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6 text-center"
          style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 450ms both' }}
        >
          <p className="text-[12px] text-slate-400 font-body">
            Save our number so you know it&apos;s us when we call:
          </p>
          <p className="text-[15px] font-heading font-semibold text-emerald-400 mt-1">
            {META_PHONE} &mdash; ShieldHome Pro
          </p>
        </div>

        {/* Download guide */}
        <a
          href={downloadUrl}
          className="flex items-center justify-center gap-2 w-full border border-slate-700 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 font-body text-[13px] py-3 px-6 rounded-lg transition-all duration-300 cursor-pointer mb-8"
          style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 500ms both' }}
        >
          <FileDown className="w-4 h-4" />
          Download Your Free Home Security Guide
        </a>

        {/* Footer */}
        <div
          className="text-center"
          style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 550ms both' }}
        >
          <div className="flex items-center justify-center gap-5 text-[10px] text-slate-600 uppercase tracking-[0.1em] font-heading mb-3">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              <span>256-bit Encrypted</span>
            </div>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              <span>Vivint Authorized</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 font-body">
            ShieldHome Pro &mdash; Authorized Vivint Smart Home Dealer
          </p>
        </div>
      </div>
    </div>
  )
}

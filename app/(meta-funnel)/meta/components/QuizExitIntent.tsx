'use client'

import { useState, useEffect, useRef } from 'react'
import { fireMetaEvent } from './MetaPixelEvents'

function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1)
  digits = digits.slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function getEndOfWeek(): string {
  const now = new Date()
  const daysUntilSunday = 7 - now.getDay()
  const endOfWeek = new Date(now.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000)
  return endOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

export default function QuizExitIntent() {
  const [visible, setVisible] = useState(false)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const firedRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return
    if (sessionStorage.getItem('meta_exit_popup_shown')) return

    timerRef.current = setTimeout(() => {
      function handleMouseLeave(e: MouseEvent) {
        if (e.clientY <= 5 && !firedRef.current) {
          firedRef.current = true
          setVisible(true)
          fireMetaEvent('CustomizeProduct', {
            content_name: 'exit_intent_shown',
          })
          sessionStorage.setItem('meta_exit_popup_shown', Date.now().toString())
          document.removeEventListener('mouseleave', handleMouseLeave)
        }
      }
      document.addEventListener('mouseleave', handleMouseLeave)
      return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }, 30000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  async function handleSubmit() {
    if (phone.length < 14) return
    setLoading(true)
    try {
      const digits = phone.replace(/\D/g, '')
      await fetch('/api/leads/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Exit Popup Lead',
          phone: digits,
          smsConsent: false,
          tcpaConsent: true,
          quizAnswers: {},
          securityScore: 0,
          riskLevel: 'unknown',
          vulnerabilities: [],
          recommendedPackage: 'Unknown',
          leadScore: 0,
          priority: 'LOW',
        }),
      })
      fireMetaEvent('Lead', { value: 50, currency: 'USD', content_name: 'exit_popup' })
      setSubmitted(true)
    } catch (err) {
      console.error('Exit popup submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative"
        style={{ animation: 'fadeUp 400ms cubic-bezier(0.16, 1, 0.3, 1) both' }}
      >
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition-colors duration-300 cursor-pointer"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <p className="text-[20px] font-heading font-bold text-white mb-2">You&apos;re all set!</p>
            <p className="text-[13px] text-slate-400 font-body">We&apos;ll call to confirm your free camera bonus.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <h3 className="font-heading font-bold text-[22px] tracking-[-0.02em] text-white mb-1">
                Wait &mdash; Don&apos;t Miss This
              </h3>
              <p className="text-[13px] font-body text-slate-400">
                Get a <strong className="text-emerald-400">FREE Outdoor Camera</strong> added to your package when you schedule this week.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-500 text-[16px] font-body focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                onClick={handleSubmit}
                disabled={loading || phone.length < 14}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3.5 rounded-lg font-heading font-semibold text-[15px] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  'Add My Free Camera \u2192'
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center mt-3 font-body">
              Offer expires {getEndOfWeek()}
            </p>
            <p className="text-center text-[11px] text-slate-600 mt-1.5 font-body tracking-wide">
              No obligation. We&apos;ll call to confirm your free quote.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

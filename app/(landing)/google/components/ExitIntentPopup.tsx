'use client'

import { useState, useEffect, useRef } from 'react'
import { pushDataLayer, fireMetaEvent } from '@/lib/google-tracking'
import { captureTrackingData } from '@/lib/utm'

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

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const firedRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Don't show on mobile
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return

    // Don't show if already shown this session
    if (localStorage.getItem('shieldhome_exit_popup_shown')) return

    // Wait 10 seconds before enabling
    timerRef.current = setTimeout(() => {
      function handleMouseLeave(e: MouseEvent) {
        if (e.clientY <= 5 && !firedRef.current) {
          firedRef.current = true
          setVisible(true)
          pushDataLayer('exit_popup_shown')
          localStorage.setItem('shieldhome_exit_popup_shown', Date.now().toString())
          document.removeEventListener('mouseleave', handleMouseLeave)
        }
      }
      document.addEventListener('mouseleave', handleMouseLeave)
      return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }, 10000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  async function handleSubmit() {
    if (phone.length < 14) return
    setLoading(true)
    try {
      const tracking = captureTrackingData()
      await fetch('/api/leads/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tracking,
          firstName: 'Exit Popup Lead',
          phone,
          zipCode: '00000',
          source: 'exit_popup',
        }),
      })
      pushDataLayer('exit_popup_submitted')
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors duration-300"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <p className="text-h3 text-slate-900 mb-2">You&apos;re all set!</p>
            <p className="text-sm text-slate-500">We&apos;ll call to confirm your free camera bonus.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <h3 className="font-heading font-bold text-[22px] tracking-[-0.02em] text-slate-900 mb-1">Wait — Don&apos;t Miss This</h3>
              <p className="text-sm font-body text-slate-600">
                Get a <strong>FREE Outdoor Camera</strong> added to your package when you schedule this week.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-[16px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                onClick={handleSubmit}
                disabled={loading || phone.length < 14}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg font-heading font-semibold text-[15px] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  'Add My Free Camera →'
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center mt-3">
              Offer expires {getEndOfWeek()}
            </p>
            <p className="text-center text-[11px] text-slate-400 mt-1.5 font-body tracking-wide">
              No obligation. We&apos;ll call to confirm your free quote.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

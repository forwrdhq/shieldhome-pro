'use client'

import { useState, useEffect } from 'react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

interface PromoBannerDealsProps {
  onQuizOpen?: () => void
}

export default function PromoBannerDeals({ onQuizOpen }: PromoBannerDealsProps) {
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('shieldhome_deals_promo_dismissed')) {
      setDismissed(true)
      return
    }
    setMounted(true)
  }, [])

  function handleDismiss() {
    setDismissed(true)
    sessionStorage.setItem('shieldhome_deals_promo_dismissed', 'true')
  }

  function trackPhoneClick() {
    if (typeof window !== 'undefined') {
      const dl = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer
      dl?.push({ event: 'phone_click' })
    }
  }

  if (dismissed) return null

  return (
    <div
      className={`w-full relative z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 transition-all duration-300 ${mounted ? 'opacity-100 max-h-[200px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
    >
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-6 py-3">
        <div className="flex-shrink-0 w-[80px] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.optimizely.com/img/12265111463/4a11a35ac4ec431c9a8cd42dfaee367a.gif"
            alt=""
            className="w-[60px] h-[60px] object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col items-center gap-1 px-4">
          <div className="text-[14px] text-center">
            <span className="font-bold text-emerald-400">Spring Savings Now Live</span>
            <span className="text-slate-500"> &middot; </span>
            <span className="text-white">$0 down</span>
            <span className="text-slate-500"> &middot; </span>
            <span className="text-white">Limited April install slots</span>
          </div>
          <p className="text-[11px] text-slate-500">
            *Qualifying purchase required
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="text-slate-500 hover:text-white text-xl leading-none transition-colors duration-200"
            aria-label="Dismiss promotion banner"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden relative px-4 py-3">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-3 text-slate-500 hover:text-white text-lg leading-none z-10"
          aria-label="Dismiss promotion banner"
        >
          &times;
        </button>

        <div className="flex flex-col items-center gap-1.5 pr-5">
          <div className="text-[12px] text-center leading-tight">
            <span className="font-bold text-emerald-400">Spring Savings &middot; $0 down</span>
          </div>
          <p className="text-[10px] text-slate-500 text-center">
            Limited April install slots *Qualifying purchase required
          </p>

          <div className="flex items-center gap-2">
            {onQuizOpen && (
              <button
                onClick={onQuizOpen}
                className="text-[11px] font-heading font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 rounded-md"
              >
                Qualify →
              </button>
            )}
            <a
              href={`tel:${PHONE_NUMBER_RAW}`}
              onClick={trackPhoneClick}
              className="text-[12px] font-semibold text-emerald-400 underline"
            >
              Call {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Phone } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

interface StickyPhoneCTAProps {
  onQuizOpen: () => void
  darkMode?: boolean
}

export default function StickyPhoneCTA({ onQuizOpen }: StickyPhoneCTAProps) {
  function trackPhoneClick() {
    if (typeof window !== 'undefined') {
      if ((window as any).fbq) (window as any).fbq('track', 'Contact', { content_name: 'phone_call' })
      if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'phone_click' })
    }
  }

  return (
    <>
      {/* Desktop sticky bottom bar */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-700 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-6">
          <p className="text-sm font-body text-slate-400">Questions? Our Smart Home Pros are standing by.</p>
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            onClick={trackPhoneClick}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-heading font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            <Phone size={16} />
            {PHONE_NUMBER}
          </a>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-700 px-4 py-3 flex gap-2 h-14">
        <button
          onClick={onQuizOpen}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-heading font-semibold text-sm transition-colors duration-200"
        >
          Get My Free Quote
        </button>
        <a
          href={`tel:${PHONE_NUMBER_RAW}`}
          onClick={trackPhoneClick}
          className="flex items-center justify-center w-12 bg-slate-800 text-white rounded-lg"
          aria-label={`Call ${PHONE_NUMBER}`}
        >
          <Phone size={18} />
        </a>
      </div>
    </>
  )
}

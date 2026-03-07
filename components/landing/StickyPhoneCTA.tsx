'use client'

import { Phone } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

interface StickyPhoneCTAProps {
  onQuizOpen: () => void
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
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-[#1A1A2E] border-t border-gray-700 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6">
          <p className="text-white text-sm">Questions? Our Smart Home Pros are standing by.</p>
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            onClick={trackPhoneClick}
            className="flex items-center gap-2 bg-[#00C853] hover:bg-[#00A846] text-white px-6 py-2 rounded-lg font-bold transition-colors"
          >
            <Phone size={18} />
            {PHONE_NUMBER}
          </a>
        </div>
      </div>

      {/* Mobile sticky bottom bar — single clear CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3 safe-area-bottom flex gap-2">
        <button
          onClick={onQuizOpen}
          className="flex-1 bg-[#00C853] hover:bg-[#00A846] active:scale-[0.98] text-white py-3.5 rounded-xl font-bold text-base transition-all animate-pulse-green"
        >
          Check Your Home&apos;s Risk — Free
        </button>
        <a
          href={`tel:${PHONE_NUMBER_RAW}`}
          onClick={trackPhoneClick}
          className="flex items-center justify-center w-12 bg-[#1A1A2E] hover:bg-[#2a2a4e] text-white rounded-xl transition-colors"
          aria-label={`Call ${PHONE_NUMBER}`}
        >
          <Phone size={20} />
        </a>
      </div>
    </>
  )
}

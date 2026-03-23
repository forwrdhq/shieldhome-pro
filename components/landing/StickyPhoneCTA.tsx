'use client'

import { Phone } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

interface StickyPhoneCTAProps {
  onQuizOpen: () => void
  darkMode?: boolean
}

export default function StickyPhoneCTA({ onQuizOpen, darkMode }: StickyPhoneCTAProps) {
  function trackPhoneClick() {
    if (typeof window !== 'undefined') {
      if ((window as any).fbq) (window as any).fbq('track', 'Contact', { content_name: 'phone_call' })
      if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'phone_click' })
    }
  }

  return (
    <>
      {/* Desktop sticky bottom bar */}
      <div className={`hidden md:block fixed bottom-0 left-0 right-0 z-40 border-t py-3 shadow-2xl ${darkMode ? 'bg-[#0a1628]/95 backdrop-blur-md border-white/[0.06]' : 'bg-[#1A1A2E] border-gray-700'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6">
          <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-white'}`}>Questions? Our Smart Home Pros are standing by.</p>
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

      {/* Mobile sticky bottom bar — full-width quiz CTA */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t shadow-2xl px-4 py-3 flex gap-2 ${darkMode ? 'bg-[#0a1628]/95 backdrop-blur-md border-white/[0.06]' : 'bg-white border-gray-200'}`}>
        <button
          onClick={onQuizOpen}
          className="flex-1 bg-[#00C853] hover:bg-[#00A846] text-white py-3 rounded-xl font-bold text-base transition-colors"
        >
          Get My Free Quote
        </button>
        <a
          href={`tel:${PHONE_NUMBER_RAW}`}
          onClick={trackPhoneClick}
          className={`flex items-center justify-center w-12 text-white rounded-xl ${darkMode ? 'bg-white/10' : 'bg-[#1A1A2E]'}`}
          aria-label={`Call ${PHONE_NUMBER}`}
        >
          <Phone size={20} />
        </a>
      </div>
    </>
  )
}

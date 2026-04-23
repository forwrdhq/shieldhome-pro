'use client'

import { useState, useEffect } from 'react'
import { Phone, MessageSquare } from 'lucide-react'
import { PHONE_NUMBER_RAW } from '@/lib/constants'

interface StickyPhoneCTAProps {
  onQuizOpen: () => void
  darkMode?: boolean
}

export default function StickyPhoneCTA({ onQuizOpen }: StickyPhoneCTAProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function trackPhoneClick() {
    if (typeof window !== 'undefined') {
      if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'phone_click' })
    }
  }

  return (
    <>
      {/* Desktop sticky bar */}
      <div
        className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-slate-200 py-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-4">
          <p className="text-[13px] font-body text-slate-500">Questions? Call or text — our Smart Home Pros are standing by.</p>
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            onClick={trackPhoneClick}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-heading font-semibold text-[13px] tracking-[-0.01em] transition-all duration-300 hover:-translate-y-px"
          >
            <Phone size={14} />
            Call
          </a>
          <a
            href={`sms:${PHONE_NUMBER_RAW}`}
            onClick={trackPhoneClick}
            className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-lg font-heading font-semibold text-[13px] tracking-[-0.01em] transition-all duration-300 hover:-translate-y-px"
          >
            <MessageSquare size={14} />
            Text Us
          </a>
          <button
            onClick={onQuizOpen}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-heading font-semibold text-[13px] tracking-[-0.01em] transition-all duration-300 hover:-translate-y-px"
          >
            Get Free Quote
          </button>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-2.5 flex gap-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <a
          href={`tel:${PHONE_NUMBER_RAW}`}
          onClick={trackPhoneClick}
          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-heading font-semibold text-[13px] tracking-[-0.01em] transition-colors duration-300"
        >
          <Phone size={14} />
          Call
        </a>
        <a
          href={`sms:${PHONE_NUMBER_RAW}`}
          onClick={trackPhoneClick}
          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-heading font-semibold text-[13px] tracking-[-0.01em] transition-colors duration-300"
        >
          <MessageSquare size={14} />
          Text Us
        </a>
        <button
          onClick={onQuizOpen}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-heading font-semibold text-[13px] tracking-[-0.01em] transition-colors duration-300"
        >
          Get Quote
        </button>
      </div>
    </>
  )
}

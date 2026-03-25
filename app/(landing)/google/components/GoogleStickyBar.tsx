'use client'

import { useState, useEffect } from 'react'
import { PHONE_NUMBER_RAW } from '@/lib/constants'
import { trackPhoneClick, pushDataLayer } from '@/lib/google-tracking'

export default function GoogleStickyBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-2.5 flex gap-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
    >
      <a
        href={`tel:${PHONE_NUMBER_RAW}`}
        onClick={() => {
          trackPhoneClick('sticky')
          pushDataLayer('sticky_cta_click', { action: 'call' })
        }}
        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-heading font-semibold text-[13px] tracking-[-0.01em] transition-colors duration-300"
      >
        Call Now
      </a>
      <a
        href="#hero-form"
        onClick={() => {
          pushDataLayer('sticky_cta_click', { action: 'quote' })
        }}
        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-heading font-semibold text-[13px] tracking-[-0.01em] transition-colors duration-300"
      >
        Get Free Quote
      </a>
    </div>
  )
}

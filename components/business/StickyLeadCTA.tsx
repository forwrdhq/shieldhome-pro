'use client'

import { useState, useEffect } from 'react'
import { Phone } from 'lucide-react'
import { trackPhoneClick } from '@/lib/google-tracking'

function scrollToForm() {
  document.querySelector('#business-form')?.scrollIntoView({ behavior: 'smooth' })
}

export default function StickyLeadCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const formEl = document.querySelector('#business-form')

    // Track scroll position
    function handleScroll() {
      const scrollY = window.scrollY
      if (scrollY < 300) {
        setVisible(false)
        return
      }

      // Check if form is in viewport
      if (formEl) {
        const rect = formEl.getBoundingClientRect()
        const inView = rect.top < window.innerHeight && rect.bottom > 0
        setVisible(!inView)
      } else {
        setVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-4 py-3 flex gap-2.5">
        <button
          onClick={scrollToForm}
          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-semibold text-[13px] rounded-lg transition-colors duration-200"
        >
          Claim Free Business Audit
        </button>
        <a
          href="tel:+18016166301"
          onClick={() => trackPhoneClick('sticky_bar')}
          className="flex items-center justify-center gap-1.5 px-4 py-3 border border-slate-300 text-slate-700 font-heading font-medium text-[13px] rounded-lg transition-colors duration-200 hover:border-slate-400"
        >
          <Phone size={14} />
          Talk to a Pro Now
        </a>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Phone } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

interface NavigationProps {
  onQuizOpen?: () => void
}

export default function Navigation({ onQuizOpen }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function trackPhoneClick() {
    if (typeof window !== 'undefined') {
      if ((window as any).fbq) (window as any).fbq('track', 'Contact', { content_name: 'phone_call' })
      if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'phone_click' })
    }
  }

  return (
    <>
      {/* Utility Bar */}
      <div className="bg-slate-950 h-10 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-body hidden sm:block">
            24/7 Professional Monitoring
          </span>
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            onClick={trackPhoneClick}
            className="text-[13px] font-semibold text-brass-300 hover:text-brass-400 transition-colors duration-150 flex items-center gap-1.5 ml-auto sm:ml-0"
          >
            <Phone size={13} />
            {PHONE_NUMBER}
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'h-14 bg-slate-900/85 backdrop-blur-xl backdrop-saturate-[180%] shadow-md'
            : 'h-[72px] bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 md:px-12 lg:px-16 flex items-center justify-between">
          {/* Logo — text wordmark */}
          <a href="/" className="font-heading font-bold text-white text-xl tracking-tight drop-shadow-sm">
            Shield<span className="text-emerald-400">Home</span>
          </a>

          {/* Nav items */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#quiz" className="text-sm font-body font-medium text-slate-400 hover:text-white transition-colors duration-150">
              Get a Quote
            </a>
            <a href="#how-it-works" className="text-sm font-body font-medium text-slate-400 hover:text-white transition-colors duration-150">
              How It Works
            </a>
            <a href="#products" className="text-sm font-body font-medium text-slate-400 hover:text-white transition-colors duration-150">
              Equipment
            </a>
            <a href="#compare" className="text-sm font-body font-medium text-slate-400 hover:text-white transition-colors duration-150">
              Compare
            </a>
            {onQuizOpen ? (
              <button
                onClick={onQuizOpen}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-heading font-semibold px-5 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
              >
                Free Quote
              </button>
            ) : (
              <a
                href="#quiz"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-heading font-semibold px-5 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
              >
                Free Quote
              </a>
            )}
          </nav>

          {/* Mobile: phone button */}
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            onClick={trackPhoneClick}
            className="md:hidden flex items-center gap-2 text-brass-300 text-sm font-semibold"
          >
            <Phone size={16} />
            <span>Call</span>
          </a>
        </div>
      </header>
    </>
  )
}

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
      {/* Trust Bar — fixed top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-sm text-white h-9 flex items-center justify-center px-4">
        {/* Mobile */}
        <p className="md:hidden text-[11px] font-body text-slate-400 text-center tracking-[0.03em]">
          <span className="text-amber-400">&#9733;</span>{' '}
          4.8/5 from 58,000+ Reviews &middot; Vivint Authorized Partner
        </p>
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-0 text-[11px] font-body text-slate-400 tracking-[0.03em]">
          <span className="flex items-center gap-1">
            <span className="text-amber-400">&#9733;</span>
            4.8/5 &middot; 58,000+ Verified Reviews
          </span>
          <span className="mx-3 text-slate-700/60">|</span>
          <span>Vivint Authorized Partner</span>
          <span className="mx-3 text-slate-700/60">|</span>
          <span>BBB A+ Rated</span>
          <span className="mx-3 text-slate-700/60">|</span>
          <span>SafeHome.org Best of 2025</span>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-9 z-50 transition-all duration-200 ${
          scrolled
            ? 'h-14 bg-slate-900/85 backdrop-blur-xl backdrop-saturate-[180%] shadow-md'
            : 'h-[72px] bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 md:px-12 lg:px-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 font-heading font-extrabold text-white text-2xl tracking-tight">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <path d="M16 2L4 8v8c0 7.73 5.12 14.95 12 16.73C22.88 30.95 28 23.73 28 16V8L16 2z" fill="#10B981"/>
              <path d="M14 17.5l-3-3-1.5 1.5L14 20.5l8.5-8.5L21 10.5l-7 7z" fill="white"/>
            </svg>
            <span>Shield<span className="text-emerald-400">Home</span></span>
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
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-heading font-semibold px-5 py-2 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
              >
                Free Quote
              </button>
            ) : (
              <a
                href="#quiz"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-heading font-semibold px-5 py-2 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
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

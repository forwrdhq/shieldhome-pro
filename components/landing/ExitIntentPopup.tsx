'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Shield, AlertTriangle } from 'lucide-react'

interface ExitIntentPopupProps {
  onQuizOpen: () => void
}

export default function ExitIntentPopup({ onQuizOpen }: ExitIntentPopupProps) {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 5 && !dismissed) {
      setShow(true)
    }
  }, [dismissed])

  // Mobile: trigger on scroll-up at 50% depth
  const handleMobileScroll = useCallback(() => {
    if (dismissed) return
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)
    if (scrollPercent > 0.5) {
      const lastScrollY = (window as any).__lastScrollY || 0
      if (window.scrollY < lastScrollY - 50) {
        setShow(true)
      }
      (window as any).__lastScrollY = window.scrollY
    } else {
      (window as any).__lastScrollY = window.scrollY
    }
  }, [dismissed])

  useEffect(() => {
    if (sessionStorage.getItem('exitPopupDismissed')) {
      setDismissed(true)
      return
    }

    // 30-second delay before enabling
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
      if (window.innerWidth < 768) {
        window.addEventListener('scroll', handleMobileScroll, { passive: true })
      }
    }, 30000)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleMobileScroll)
    }
  }, [handleMouseLeave, handleMobileScroll])

  function dismiss() {
    setShow(false)
    setDismissed(true)
    sessionStorage.setItem('exitPopupDismissed', 'true')
    document.removeEventListener('mouseleave', handleMouseLeave)
    window.removeEventListener('scroll', handleMobileScroll)
  }

  function handleQuizClick() {
    dismiss()
    onQuizOpen()
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in">
        <div className="bg-[#1A1A2E] px-6 py-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/20 rounded-full mb-3">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Before You Go — Is Your Home at Risk?
          </h3>
          <p className="text-gray-300 text-sm mt-2">
            Take our free 60-second Home Security Assessment and find out.
          </p>
        </div>

        <div className="px-6 py-6 text-center">
          <button
            onClick={handleQuizClick}
            className="block w-full bg-[#00C853] hover:bg-[#00A846] text-white py-4 rounded-xl font-bold text-lg transition-colors mb-4"
          >
            Check My Risk Score
          </button>

          <button
            onClick={dismiss}
            className="text-gray-400 hover:text-gray-600 text-sm transition-colors underline"
          >
            No thanks, I&apos;ll leave my home unprotected
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
            <Shield size={12} />
            <span>No credit card required &bull; Takes 60 seconds</span>
          </div>
        </div>

        <button
          onClick={dismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close popup"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

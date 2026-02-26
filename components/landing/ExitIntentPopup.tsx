'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Shield, Phone, Clock } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 5 && !dismissed) {
      setShow(true)
    }
  }, [dismissed])

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('exitPopupDismissed')) {
      setDismissed(true)
      return
    }

    // Delay enabling exit-intent by 10 seconds so it doesn't fire immediately
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 10000)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseLeave])

  function dismiss() {
    setShow(false)
    setDismissed(true)
    sessionStorage.setItem('exitPopupDismissed', 'true')
    document.removeEventListener('mouseleave', handleMouseLeave)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Top accent */}
        <div className="bg-[#1A1A2E] px-6 py-5 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#00C853] rounded-full mb-3">
            <Clock size={28} className="text-white" />
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Before You Go — Quick Question
          </h3>
          <p className="text-gray-300 text-sm mt-1">
            Want to see if you qualify for a free security consultation?
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6 text-center">
          <p className="text-gray-700 text-sm mb-5 leading-relaxed">
            Most homeowners are surprised to learn they can get a professionally installed smart security system for <strong>$0 down</strong>. Our 60-second quiz will show you exactly what you qualify for — no commitment required.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-left bg-green-50 rounded-lg p-3">
              <div className="w-8 h-8 bg-[#00C853] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <span className="text-sm font-medium text-gray-800">Take the 60-second quiz</span>
            </div>
            <div className="flex items-center gap-3 text-left bg-green-50 rounded-lg p-3">
              <div className="w-8 h-8 bg-[#00C853] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <span className="text-sm font-medium text-gray-800">See your personalized quote (free, no obligation)</span>
            </div>
            <div className="flex items-center gap-3 text-left bg-green-50 rounded-lg p-3">
              <div className="w-8 h-8 bg-[#00C853] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <span className="text-sm font-medium text-gray-800">Decide on your own time — no pressure</span>
            </div>
          </div>

          <a
            href="#quiz"
            onClick={dismiss}
            className="block w-full bg-[#00C853] hover:bg-[#00A846] text-white py-4 rounded-xl font-bold text-lg transition-colors mb-3"
          >
            Get My Free Quote →
          </a>

          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#00C853] text-sm transition-colors"
          >
            <Phone size={14} />
            Or call {PHONE_NUMBER}
          </a>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
            <Shield size={12} />
            <span>No credit card required — takes 60 seconds</span>
          </div>
        </div>

        {/* Close button */}
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

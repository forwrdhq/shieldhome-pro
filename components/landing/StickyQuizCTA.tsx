'use client'

import { useState, useEffect } from 'react'
import { Shield, X } from 'lucide-react'

interface StickyQuizCTAProps {
  onQuizOpen: () => void
}

export default function StickyQuizCTA({ onQuizOpen }: StickyQuizCTAProps) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return

    function handleScroll() {
      // Show after scrolling past hero (~600px), hide when near quiz section
      const scrollY = window.scrollY
      const pageHeight = document.body.scrollHeight - window.innerHeight
      const scrollPercent = scrollY / pageHeight
      // Hide when user is near the quiz section (bottom 30% of page)
      setVisible(scrollY > 600 && scrollPercent < 0.7)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dismissed])

  if (dismissed || !visible) return null

  return (
    // Only show on desktop/tablet — mobile has the sticky bottom bar
    <div className="hidden md:block fixed top-16 left-0 right-0 z-40 bg-[#1A1A2E]/95 backdrop-blur-md border-b border-[#00C853]/20 shadow-lg animate-in">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Shield size={16} className="text-[#00C853] flex-shrink-0" />
          <span className="text-white text-sm font-medium truncate">
            Free Home Security Assessment — See What You Qualify For
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onQuizOpen}
            className="bg-[#00C853] hover:bg-[#00A846] text-white px-4 py-1.5 rounded-lg font-bold text-sm transition-colors whitespace-nowrap"
          >
            Get My Quote
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded hover:bg-white/10 text-gray-400"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

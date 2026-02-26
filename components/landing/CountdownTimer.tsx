'use client'

import { useState } from 'react'
import { X, Phone, Gift } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

const CURRENT_MONTH = new Date().toLocaleString('en-US', { month: 'long' })

export default function CountdownTimer() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-[#00C853] text-white py-2.5 px-4 relative">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-sm font-medium">
        <span className="flex items-center gap-1.5">
          <Gift size={15} className="flex-shrink-0" />
          <span><strong>{CURRENT_MONTH} Special:</strong> FREE Doorbell Camera + FREE Professional Installation</span>
        </span>
        <span className="hidden sm:inline text-white/80">|</span>
        <a
          href={`tel:${PHONE_NUMBER_RAW}`}
          className="flex items-center gap-1 underline hover:no-underline font-bold"
        >
          <Phone size={14} /> Call Now to Claim
        </a>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded"
        aria-label="Dismiss offer banner"
      >
        <X size={16} />
      </button>
    </div>
  )
}

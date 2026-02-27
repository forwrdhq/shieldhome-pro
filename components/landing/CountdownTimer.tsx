'use client'

import { useState, useEffect } from 'react'
import { X, Phone } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes in ms

function getSessionEnd(): number {
  if (typeof window === 'undefined') return Date.now() + SESSION_DURATION

  const stored = sessionStorage.getItem('promoEndTime')
  if (stored) {
    const end = parseInt(stored, 10)
    if (end > Date.now()) return end
  }

  const end = Date.now() + SESSION_DURATION
  sessionStorage.setItem('promoEndTime', String(end))
  return end
}

export default function CountdownTimer() {
  const [dismissed, setDismissed] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ m: 30, s: 0 })
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const endTime = getSessionEnd()

    function calc() {
      const diff = endTime - Date.now()
      if (diff <= 0) {
        setExpired(true)
        setTimeLeft({ m: 0, s: 0 })
        return
      }
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft({ m, s })
    }

    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])

  if (dismissed || expired) return null

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="bg-[#00C853] text-white py-2.5 px-4 relative">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-sm font-medium">
        <span>🎁 <strong>Limited Time:</strong> FREE Doorbell Camera + FREE Professional Installation</span>
        <span className="flex items-center gap-1">
          | Offer expires in
          <span className="bg-white text-[#00C853] font-bold px-2 py-0.5 rounded ml-1">
            {pad(timeLeft.m)}:{pad(timeLeft.s)}
          </span>
        </span>
        <a
          href={`tel:${PHONE_NUMBER_RAW}`}
          className="flex items-center gap-1 underline hover:no-underline font-bold"
        >
          <Phone size={14} /> Call/Text Now
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

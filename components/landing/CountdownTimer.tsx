'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

function getMonthEndMs(): number {
  const now = new Date()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
  return endOfMonth.getTime()
}

export default function CountdownTimer() {
  const [dismissed, setDismissed] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const endTime = getMonthEndMs()

    function calc() {
      const diff = endTime - Date.now()
      if (diff <= 0) {
        setExpired(true)
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 })
        return
      }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft({ d, h, m, s })
    }

    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])

  if (dismissed || expired) return null

  const pad = (n: number) => String(n).padStart(2, '0')
  const monthName = new Date().toLocaleString('en-US', { month: 'long' })

  return (
    <div className="bg-[#00C853] text-white py-2 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-medium pr-6">
        <span className="truncate">
          <strong>{monthName} Special:</strong> FREE Doorbell Camera + Setup
        </span>
        <span className="flex items-center gap-1 flex-shrink-0">
          <span className="hidden sm:inline">| Ends in</span>
          <span className="bg-white text-[#00C853] font-bold px-1.5 sm:px-2 py-0.5 rounded text-xs">
            {pad(timeLeft.d)}d {pad(timeLeft.h)}h {pad(timeLeft.m)}m {pad(timeLeft.s)}s
          </span>
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded"
        aria-label="Dismiss offer banner"
      >
        <X size={14} />
      </button>
    </div>
  )
}

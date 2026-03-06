'use client'

import { useState, useEffect } from 'react'
import { X, Zap } from 'lucide-react'

function getWeekEndMs(): number {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0=Sun
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 23, 59, 59, 999)
  return end.getTime()
}

function getSpotsRemaining(): number {
  // Deterministic per day — same for all visitors on the same day
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  return (seed % 8) + 3 // 3-10
}

export default function CountdownTimer() {
  const [dismissed, setDismissed] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const endTime = getWeekEndMs()

    function calc() {
      const diff = endTime - Date.now()
      if (diff <= 0) {
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

  if (dismissed) return null

  const pad = (n: number) => String(n).padStart(2, '0')
  const spots = getSpotsRemaining()

  return (
    <div className="bg-[#00C853] text-white py-2.5 px-4 relative">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-sm font-medium">
        <span className="flex items-center gap-1.5">
          <Zap size={14} className="fill-white" />
          <strong>This Week Only:</strong> FREE Outdoor Camera + Doorbell Camera
          <span className="hidden sm:inline">—</span>
          <span className="font-bold text-white/90">Only {spots} spots left</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="bg-white text-[#00C853] font-bold px-2 py-0.5 rounded ml-1 tabular-nums">
            {pad(timeLeft.d)}d {pad(timeLeft.h)}h {pad(timeLeft.m)}m {pad(timeLeft.s)}s
          </span>
        </span>
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

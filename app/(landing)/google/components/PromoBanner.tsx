'use client'

import { useState, useEffect } from 'react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import { trackPhoneClick } from '@/lib/google-tracking'

export default function PromoBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('shieldhome_promo_dismissed')) {
      setDismissed(true)
      return
    }

    setMounted(true)

    const targetDate = new Date('2026-03-31T23:59:59').getTime()

    function tick() {
      const now = Date.now()
      const diff = targetDate - now

      if (diff <= 0) {
        setExpired(true)
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  function handleDismiss() {
    setDismissed(true)
    sessionStorage.setItem('shieldhome_promo_dismissed', 'true')
  }

  if (dismissed || !mounted) return null

  const timerBoxes = [
    { value: timeLeft.days, label: 'd' },
    { value: timeLeft.hours, label: 'h' },
    { value: timeLeft.minutes, label: 'm' },
    { value: timeLeft.seconds, label: 's' },
  ]

  return (
    <div
      className="w-full relative z-40 pt-12"
      style={{ backgroundColor: 'rgba(253, 255, 231, 0.95)' }}
    >
      {/* ── Desktop ── */}
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-6 py-3">
        {/* Spinning Camera */}
        <div className="flex-shrink-0 w-[80px] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.optimizely.com/img/12265111463/4a11a35ac4ec431c9a8cd42dfaee367a.gif"
            alt=""
            className="w-[60px] h-[60px] object-contain"
          />
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center gap-1.5 px-4">
          <div className="text-[14px] text-center">
            <span className="font-bold" style={{ color: '#D4A843' }}>Spring Flash Sale — </span>
            <span className="text-black">Buy 2 Cameras, Get 1 FREE*</span>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-black">Mention offer when you call</span>
          </div>
          <p className="text-[11px] text-gray-500">
            *With qualifying system purchase &middot; ShieldHome partner exclusive
          </p>

          {/* Countdown */}
          <div className="flex items-center gap-3">
            <span className="text-black font-bold text-[14px]">Hurry! Call Now</span>
            {expired ? (
              <span className="text-red-600 font-bold text-[14px]">Offer Expired</span>
            ) : (
              <div className="flex gap-2">
                {timerBoxes.map(({ value, label }) => (
                  <div
                    key={label}
                    className="bg-white rounded-[5px] w-[52px] h-[38px] flex flex-col items-center justify-center shadow-sm"
                  >
                    <span className="text-black text-[22px] leading-none font-normal tabular-nums">
                      {String(value).padStart(2, '0')}
                    </span>
                    <span className="text-black text-[10px] leading-none">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Phone + Dismiss */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            onClick={() => trackPhoneClick('promo_banner')}
            className="text-[14px] font-semibold underline"
            style={{ color: '#D4A843' }}
          >
            {PHONE_NUMBER}
          </a>
          <button
            onClick={handleDismiss}
            className="text-black/40 hover:text-black text-xl leading-none transition-colors duration-200"
            aria-label="Dismiss promotion banner"
          >
            &times;
          </button>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden relative px-4 py-3">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-3 text-black/40 hover:text-black text-lg leading-none z-10"
          aria-label="Dismiss promotion banner"
        >
          &times;
        </button>

        <div className="flex flex-col items-center gap-2 pr-5">
          <div className="text-[13px] text-center">
            <span className="font-bold" style={{ color: '#D4A843' }}>Spring Flash Sale — </span>
            <span className="text-black">Buy 2 Cameras, Get 1 FREE*</span>
          </div>
          <p className="text-[10px] text-gray-500 text-center">
            *With qualifying system purchase &middot; Mention offer when you call
          </p>

          {!expired && (
            <div className="flex gap-1.5">
              {timerBoxes.map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-white rounded-[4px] w-[42px] h-[32px] flex flex-col items-center justify-center shadow-sm"
                >
                  <span className="text-black text-[16px] leading-none font-normal tabular-nums">
                    {String(value).padStart(2, '0')}
                  </span>
                  <span className="text-black text-[9px] leading-none">{label}</span>
                </div>
              ))}
            </div>
          )}

          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            onClick={() => trackPhoneClick('promo_banner')}
            className="text-[12px] font-semibold underline"
            style={{ color: '#D4A843' }}
          >
            Call {PHONE_NUMBER}
          </a>
        </div>
      </div>
    </div>
  )
}

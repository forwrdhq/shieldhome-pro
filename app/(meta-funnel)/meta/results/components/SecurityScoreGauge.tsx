'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react'

interface SecurityScoreGaugeProps {
  score: number
  riskLevel: string
  vulnerabilities: string[]
}

export default function SecurityScoreGauge({ score, riskLevel, vulnerabilities }: SecurityScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let frame: number
    const duration = 2000
    const startTime = Date.now()

    function animate() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(eased * score))

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const scoreColor = score < 40 ? '#EF4444' : score < 70 ? '#F59E0B' : '#10B981'
  const scoreBg = score < 40 ? 'rgba(239, 68, 68, 0.1)' : score < 70 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'
  const riskLabel = riskLevel === 'high' ? 'AT RISK' : riskLevel === 'medium' ? 'MODERATE RISK' : 'GOOD'
  const RiskIcon = riskLevel === 'high' ? ShieldAlert : riskLevel === 'medium' ? AlertTriangle : ShieldCheck

  const radius = 80
  const circumference = Math.PI * radius
  const offset = circumference - (displayScore / 100) * circumference

  return (
    <div className="text-center" style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both' }}>
      <p
        className="text-[11px] font-heading font-semibold uppercase tracking-[0.12em] mb-6"
        style={{ color: 'var(--color-brass-300, #E8CBA7)' }}
      >
        Your Home Security Score
      </p>

      {/* Gauge */}
      <div className="relative inline-block mb-5">
        <svg width="220" height="130" viewBox="0 0 220 130">
          {/* Background arc */}
          <path
            d="M 15 120 A 90 90 0 0 1 205 120"
            fill="none"
            stroke="#1E293B"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <path
            d="M 15 120 A 90 90 0 0 1 205 120"
            fill="none"
            stroke={scoreColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-100"
          />
        </svg>

        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-3">
          <span
            className="text-[56px] font-heading font-bold leading-none"
            style={{ color: scoreColor }}
          >
            {displayScore}
          </span>
          <span className="text-[13px] text-slate-500 font-body">/100</span>
        </div>
      </div>

      {/* Risk badge */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{ backgroundColor: scoreBg }}
        >
          <RiskIcon className="w-4 h-4" style={{ color: scoreColor }} />
          <span
            className="text-[11px] font-heading font-bold uppercase tracking-[0.1em]"
            style={{ color: scoreColor }}
          >
            {riskLabel}
          </span>
        </div>
      </div>

      {/* Vulnerabilities */}
      {vulnerabilities.length > 0 && (
        <div className="max-w-sm mx-auto text-left">
          <h3 className="text-[11px] font-heading font-semibold uppercase tracking-[0.1em] text-slate-400 mb-3">
            Top Vulnerabilities Detected
          </h3>
          <div className="space-y-2.5">
            {vulnerabilities.map((v, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 bg-red-500/5 border border-red-500/10 rounded-lg px-3.5 py-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span className="text-[13px] text-slate-300 font-body leading-snug">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Shield, BarChart3, FileCheck } from 'lucide-react'

const PHASES = [
  {
    message: 'Analyzing your home security profile...',
    icon: Shield,
  },
  {
    message: 'Comparing 47 protection configurations...',
    icon: BarChart3,
  },
  {
    message: 'Generating your personalized recommendation...',
    icon: FileCheck,
  },
]

interface QuizCalculatingProps {
  onComplete: () => void
}

export default function QuizCalculating({ onComplete }: QuizCalculatingProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    timers.push(setTimeout(() => setPhase(1), 1500))
    timers.push(setTimeout(() => setPhase(2), 3000))
    timers.push(setTimeout(() => onComplete(), 4500))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  const CurrentIcon = PHASES[phase].icon

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Subtle emerald glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Logo */}
      <div className="relative z-10 mb-10" style={{ animation: 'fadeUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both' }}>
        <span className="text-white font-heading font-bold text-[15px] tracking-[-0.01em]">
          Shield<span className="text-emerald-400">Home</span>
        </span>
      </div>

      {/* Spinner */}
      <div
        className="relative z-10 w-24 h-24 mb-8"
        style={{ animation: 'fadeUp 500ms cubic-bezier(0.16, 1, 0.3, 1) 100ms both' }}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        {/* Center icon container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
            <CurrentIcon className="w-7 h-7 text-emerald-400 transition-all duration-500" />
          </div>
        </div>
      </div>

      {/* Message */}
      <p
        className="relative z-10 text-[15px] font-heading font-semibold text-white text-center tracking-[-0.01em] mb-2"
        style={{ animation: 'fadeUp 400ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both' }}
      >
        {PHASES[phase].message}
      </p>

      {/* Phase dots */}
      <div
        className="relative z-10 flex items-center gap-2.5 mt-6"
        style={{ animation: 'fadeUp 400ms cubic-bezier(0.16, 1, 0.3, 1) 300ms both' }}
      >
        {PHASES.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i <= phase ? 'bg-emerald-500 scale-100' : 'bg-slate-700 scale-75'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        ))}
      </div>

      {/* Progress text */}
      <p
        className="relative z-10 text-[11px] text-slate-500 font-body mt-4 tracking-wide"
        style={{ animation: 'fadeUp 400ms cubic-bezier(0.16, 1, 0.3, 1) 400ms both' }}
      >
        Step {phase + 1} of 3
      </p>
    </div>
  )
}

'use client'

import { Shield, Lock, CheckCircle } from 'lucide-react'

interface QuizStartScreenProps {
  onStart: () => void
}

export default function QuizStartScreen({ onStart }: QuizStartScreenProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden">
      {/* Subtle warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Logo */}
      <div className="relative z-10 mb-6 hero-badge" style={{ animation: 'fadeUp 600ms var(--ease-out) 100ms both' }}>
        <span className="text-white font-heading font-bold text-[15px] tracking-[-0.01em]">
          Shield<span className="text-emerald-400">Home</span>
        </span>
      </div>

      {/* Badge */}
      <div
        className="relative z-10 inline-flex items-center gap-2.5 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 px-5 py-2 rounded-full text-[11px] font-heading font-semibold uppercase tracking-[0.12em] mb-8"
        style={{ animation: 'fadeUp 600ms var(--ease-out) 150ms both' }}
      >
        <span>Free</span>
        <span className="w-1 h-1 bg-emerald-500/40 rounded-full" />
        <span>90 Seconds</span>
        <span className="w-1 h-1 bg-emerald-500/40 rounded-full" />
        <span>No Obligation</span>
      </div>

      {/* Headline */}
      <h1
        className="relative z-10 text-white font-heading font-bold text-[28px] md:text-[40px] leading-[1.1] tracking-[-0.03em] text-center max-w-lg mb-4"
        style={{ animation: 'fadeUp 600ms var(--ease-out) 200ms both' }}
      >
        How Protected Is Your Home, Really?
      </h1>

      {/* Sub-headline */}
      <p
        className="relative z-10 text-slate-400 font-body text-[14px] md:text-[16px] leading-[1.6] text-center max-w-md mb-10"
        style={{ animation: 'fadeUp 600ms var(--ease-out) 300ms both' }}
      >
        Take the 90-second Home Security Assessment. Get your personalized Security Score + see what protection your home qualifies for.
      </p>

      {/* Shield icon */}
      <div
        className="relative z-10 w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-8"
        style={{ animation: 'fadeUp 600ms var(--ease-out) 350ms both' }}
      >
        <Shield className="w-8 h-8 text-emerald-400" />
      </div>

      {/* Social proof */}
      <div
        className="relative z-10 flex items-center gap-2 text-[12px] text-slate-500 mb-6"
        style={{ animation: 'fadeUp 600ms var(--ease-out) 380ms both' }}
      >
        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
        <span>5,847 homeowners assessed this month</span>
      </div>

      {/* CTA Button */}
      <button
        onClick={onStart}
        className="relative z-10 w-full max-w-md bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-semibold text-[15px] py-4 px-8 rounded-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
        style={{ animation: 'fadeUp 600ms var(--ease-out) 400ms both' }}
      >
        START MY FREE ASSESSMENT &rarr;
      </button>

      {/* Micro-text */}
      <p
        className="relative z-10 text-[11px] text-slate-600 mt-4 text-center tracking-wide"
        style={{ animation: 'fadeUp 600ms var(--ease-out) 450ms both' }}
      >
        Free &bull; No credit card &bull; No obligation
      </p>

      {/* Trust badges */}
      <div
        className="relative z-10 flex items-center gap-5 mt-8 text-[10px] text-slate-600 uppercase tracking-[0.1em] font-heading"
        style={{ animation: 'fadeUp 600ms var(--ease-out) 500ms both' }}
      >
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3" />
          <span>256-bit Encrypted</span>
        </div>
        <span className="w-1 h-1 bg-slate-700 rounded-full" />
        <span>BBB A+ Rated</span>
        <span className="w-1 h-1 bg-slate-700 rounded-full" />
        <span>Vivint Authorized</span>
      </div>
    </div>
  )
}

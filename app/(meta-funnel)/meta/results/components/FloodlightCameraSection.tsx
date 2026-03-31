'use client'

import { useEffect, useRef, useState } from 'react'
import { Lightbulb, Volume2, Eye, Zap } from 'lucide-react'

export default function FloodlightCameraSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className="max-w-lg mx-auto">
      <p
        className="text-[11px] font-heading font-semibold uppercase tracking-[0.12em] text-center mb-5"
        style={{ color: 'var(--color-brass-300, #E8CBA7)' }}
      >
        The Game-Changer
      </p>

      <h3 className="text-[18px] md:text-[22px] font-heading font-bold text-white text-center leading-[1.2] tracking-[-0.03em] mb-6">
        Smart Deter Floodlight Camera
      </h3>

      {/* Product visual with callout annotations */}
      <div
        className={`relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        {/* Camera illustration using icons */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32 bg-gradient-to-b from-slate-700 to-slate-800 rounded-2xl border border-slate-600/50 flex items-center justify-center">
            <Eye className="w-12 h-12 text-emerald-400" />
            {/* Animated pulse ring */}
            <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/20 animate-ping" style={{ animationDuration: '3s' }} />

            {/* Callout: Spotlight */}
            <div className="absolute -left-24 top-2 flex items-center gap-1.5">
              <div className="bg-amber-500/15 border border-amber-500/30 rounded-full p-1.5">
                <Lightbulb className="w-3 h-3 text-amber-400" />
              </div>
              <span className="text-[10px] text-amber-300 font-heading whitespace-nowrap">Spotlight</span>
              <div className="w-6 h-px bg-amber-500/30" />
            </div>

            {/* Callout: Speaker */}
            <div className="absolute -right-24 top-2 flex items-center gap-1.5">
              <div className="w-6 h-px bg-emerald-500/30" />
              <span className="text-[10px] text-emerald-300 font-heading whitespace-nowrap">Speaker</span>
              <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-full p-1.5">
                <Volume2 className="w-3 h-3 text-emerald-400" />
              </div>
            </div>

            {/* Callout: Motion Tracking */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
              <div className="w-px h-4 bg-sky-500/30" />
              <div className="flex items-center gap-1.5">
                <div className="bg-sky-500/15 border border-sky-500/30 rounded-full p-1.5">
                  <Zap className="w-3 h-3 text-sky-400" />
                </div>
                <span className="text-[10px] text-sky-300 font-heading whitespace-nowrap">Motion Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature descriptions */}
        <div className="space-y-3 mt-12">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-3 h-3 text-amber-400" />
            </div>
            <p className="text-[13px] text-slate-300 font-body">
              <strong className="text-white">TRACKS intruders</strong> with a spotlight that follows their movement
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <Volume2 className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="text-[13px] text-slate-300 font-body">
              <strong className="text-white">WHISTLES at them</strong> with a loud deterrent siren to scare them off
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-sky-500/10 border border-sky-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-3 h-3 text-sky-400" />
            </div>
            <p className="text-[13px] text-slate-300 font-body">
              <strong className="text-white">FLASHES to alert</strong> neighbors and create a visible deterrent
            </p>
          </div>
        </div>
      </div>

      {/* Comparison callout */}
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl px-5 py-4 text-center">
        <p className="text-[13px] text-slate-300 font-body leading-relaxed">
          While Ring and SimpliSafe cameras <strong className="text-slate-200">record crimes after they happen</strong>, this camera <strong className="text-emerald-400">actively PREVENTS them</strong>.
        </p>
      </div>

      {/* TODO: Replace with actual Vivint floodlight camera video when available.
           Use <video> tag with poster image, autoplay on scroll (muted), lazy-loaded.
           Check /public/videos/ for Gunnar's UGC video first. */}
    </div>
  )
}

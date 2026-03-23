'use client'

import { useState } from 'react'
import { Star, Phone, Play } from 'lucide-react'
import Button from '@/components/ui/Button'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

const YOUTUBE_ID = 'mgHIEsr_XH0'

interface HeroSectionProps {
  onQuizOpen: () => void
}

export default function HeroSection({ onQuizOpen }: HeroSectionProps) {
  const [videoPlaying, setVideoPlaying] = useState(false)

  return (
    <section className="bg-slate-900 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left: Copy — 3 columns */}
          <div className="lg:col-span-3">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full mb-6">
              <span className="text-emerald-700 text-xs font-semibold tracking-wide">
                March Special: Free Doorbell Camera
              </span>
            </div>

            <h1 className="hero-h1 text-display text-white max-w-[580px] mb-5">
              Smart Security That Protects What Matters Most
            </h1>

            <p className="hero-sub text-body-lg text-slate-400 max-w-[480px] mb-8">
              Get Vivint&apos;s #1-rated smart home security — $0 down, free expert setup, and 24/7 professional monitoring. Most homes are protected within 48 hours.
            </p>

            {/* CTA group */}
            <div className="hero-cta flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Button
                variant="primary"
                size="xl"
                className="w-full sm:w-auto text-lg px-10"
                onClick={onQuizOpen}
              >
                Get My Free Quote
              </Button>
              <a
                href={`tel:${PHONE_NUMBER_RAW}`}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-150 text-sm"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    if ((window as any).fbq) (window as any).fbq('track', 'Contact', { content_name: 'phone_call' })
                    if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'phone_click' })
                  }
                }}
              >
                <Phone size={16} />
                <span>Or call {PHONE_NUMBER}</span>
              </a>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className="text-amber-500 fill-amber-500" />
                  ))}
                </span>
                4.8/5 from 58,000+ reviews
              </span>
              <span className="hidden sm:inline">&middot;</span>
              <span>BBB A+</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>Free Setup</span>
            </div>
          </div>

          {/* Right: Video + stats — 2 columns */}
          <div className="hero-image hidden lg:block lg:col-span-2">
            <div className="relative bg-slate-800 rounded-xl border border-slate-700 p-6">
              {/* YouTube video */}
              <div className="rounded-lg overflow-hidden aspect-[16/9] mb-6 relative bg-black">
                {videoPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
                    title="Vivint Smart Home Security Overview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <button
                    onClick={() => setVideoPlaying(true)}
                    className="absolute inset-0 w-full h-full group cursor-pointer"
                    aria-label="Play video"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
                      alt="Vivint Smart Home Security System"
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-200" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg group-hover:-translate-y-0.5 transition-transform duration-200">
                        <Play size={24} className="text-white ml-0.5" />
                      </div>
                      <p className="text-sm font-semibold text-white mt-3 drop-shadow-lg">
                        Watch the Overview
                      </p>
                    </div>
                  </button>
                )}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-heading font-bold text-white">$0</div>
                  <div className="text-xs font-body text-slate-400 mt-0.5">Down Payment</div>
                </div>
                <div>
                  <div className="text-2xl font-heading font-bold text-emerald-400">FREE</div>
                  <div className="text-xs font-body text-slate-400 mt-0.5">Expert Setup</div>
                </div>
                <div>
                  <div className="text-2xl font-heading font-bold text-white">24/7</div>
                  <div className="text-xs font-body text-slate-400 mt-0.5">Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

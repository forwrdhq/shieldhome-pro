'use client'

import { useState } from 'react'
import { Star, Phone, Shield, CheckCircle, Play } from 'lucide-react'
import Button from '@/components/ui/Button'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

const YOUTUBE_ID = 'mgHIEsr_XH0'

interface HeroSectionProps {
  onQuizOpen: () => void
}

export default function HeroSection({ onQuizOpen }: HeroSectionProps) {
  const [videoPlaying, setVideoPlaying] = useState(false)

  return (
    <section className="relative min-h-[520px] md:min-h-[580px] flex items-center bg-gradient-to-br from-[#1A1A2E] via-[#1a2e1a] to-[#0a1a0a] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#00C853] blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-[#00BFA5] blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-5">
              <Shield size={14} className="text-[#00C853]" />
              <span className="text-[#00C853] text-xs font-bold tracking-widest uppercase">
                Vivint Authorized Dealer
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] mb-5">
              Protect Your Home and Family — $0 Down, Free Setup
            </h1>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed max-w-lg">
              Get Vivint&apos;s #1-rated smart security system with free cameras and free expert installation. Most homes are protected within 24 hours.
            </p>

            {/* Star rating */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i <= 4
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-yellow-400 fill-yellow-400 opacity-80'
                    }
                  />
                ))}
              </div>
              <span className="text-white font-semibold text-sm">
                4.8/5 from 58,000+ verified reviews
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
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
                className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
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
          </div>

          {/* Right: Video + stats */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                {/* YouTube video embed */}
                <div className="rounded-xl overflow-hidden aspect-[16/9] mb-6 relative bg-black">
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
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#00C853] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={28} className="text-white ml-1" />
                        </div>
                        <p className="text-sm font-semibold text-white mt-3 drop-shadow-lg">
                          Watch the Overview
                        </p>
                      </div>
                    </button>
                  )}
                </div>

                {/* Stats row — value anchor */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-extrabold text-white">$0</div>
                    <div className="text-xs text-gray-400 mt-0.5">Down Payment</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-[#00C853]">FREE</div>
                    <div className="text-xs text-gray-400 mt-0.5">Cameras</div>
                    <div className="text-[10px] text-gray-500">($249 value)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-[#00C853]">FREE</div>
                    <div className="text-xs text-gray-400 mt-0.5">Expert Setup</div>
                    <div className="text-[10px] text-gray-500">($199 value)</div>
                  </div>
                </div>
              </div>

              {/* Floating trust badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={20} className="text-[#00C853]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">2M+ Homes</div>
                  <div className="text-xs text-gray-500">Protected nationwide</div>
                </div>
              </div>

              {/* Floating BBB badge */}
              <div className="absolute -top-3 -right-3 bg-white rounded-xl shadow-xl px-3 py-2 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-700 font-extrabold text-xs">
                  A+
                </div>
                <div className="text-xs font-semibold text-gray-700">BBB Rated</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

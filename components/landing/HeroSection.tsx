'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Phone, Play } from 'lucide-react'
import Button from '@/components/ui/Button'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

const YOUTUBE_ID = 'mgHIEsr_XH0'

interface HeroSectionProps {
  onQuizOpen: () => void
}

function VideoModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 animate-fadeIn" />
      <div
        className="relative w-full max-w-[800px] aspect-video rounded-xl overflow-hidden shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
          title="Vivint Smart Home Security Overview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors z-10"
          aria-label="Close video"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 1L13 13M13 1L1 13" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function HeroSection({ onQuizOpen }: HeroSectionProps) {
  const [videoOpen, setVideoOpen] = useState(false)

  function trackPhoneClick() {
    if (typeof window !== 'undefined') {
      if ((window as any).fbq) (window as any).fbq('track', 'Contact', { content_name: 'phone_call' })
      if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'phone_click' })
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-slate-900">
        {/* Desktop: Product image — full right side */}
        <div className="hidden md:block absolute top-0 right-0 bottom-0 w-[50%] pointer-events-none">
          <Image
            src="/images/google/vivint-products-hero.jpg"
            alt=""
            fill
            priority
            className="object-contain object-right"
            sizes="50vw"
          />
          <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-r from-slate-900 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/60 to-transparent" />
        </div>

        {/* ── Mobile ── */}
        <div className="md:hidden relative">
          <div className="pt-8 pb-3 px-5">
            {/* Pre-headline */}
            <p className="text-[9px] font-heading font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--color-brass-300)' }}>
              Exclusive Vivint Deals — Authorized Partner
            </p>

            {/* Headline */}
            <h1 className="text-white font-heading font-bold text-[24px] leading-[1.15] tracking-[-0.025em] mb-2">
              Smart Security That Protects What Matters Most
            </h1>

            {/* Subheadline */}
            <p className="text-slate-400 text-[13px] leading-[1.5] mb-5 font-body max-w-[320px]">
              Vivint&apos;s AI-powered cameras don&apos;t just record — they deter intruders with spotlights, sirens, and live audio. $0 down + free installation nationwide.
            </p>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="xl"
                className="w-full text-[15px]"
                onClick={onQuizOpen}
              >
                Get My Free Quote
              </Button>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setVideoOpen(true)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors duration-200 text-[12px] font-body"
                >
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <Play size={12} className="text-white ml-0.5" />
                  </div>
                  Watch Overview
                </button>
                <a
                  href={`tel:${PHONE_NUMBER_RAW}`}
                  onClick={trackPhoneClick}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-[12px] font-body transition-colors duration-200"
                >
                  <Phone size={12} />
                  {PHONE_NUMBER}
                </a>
              </div>
            </div>

            {/* Trust strip */}
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 font-body tracking-[0.04em] uppercase mt-5">
              <span className="flex items-center gap-1">
                <span className="text-amber-400 text-sm">&#9733;</span>
                58,000+ reviews
              </span>
              <span className="text-slate-700">|</span>
              <span>BBB A+</span>
              <span className="text-slate-700">|</span>
              <span>2M+ Homes</span>
            </div>
          </div>

          {/* Mobile product image */}
          <div className="relative mt-3">
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-900 to-transparent z-10 pointer-events-none" />
            <Image
              src="/images/google/vivint-products-hero.jpg"
              alt="Vivint smart home security products"
              width={800}
              height={500}
              className="w-full h-auto"
              sizes="100vw"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ── Desktop ── */}
        <div className="hidden md:block relative">
          <div className="max-w-6xl mx-auto px-8 pt-16 pb-20">
            <div className="max-w-[520px]">
              {/* Pre-headline */}
              <p
                className="text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-4"
                style={{ color: 'var(--color-brass-300)' }}
              >
                Exclusive Vivint Deals — Authorized Partner
              </p>

              {/* Headline */}
              <h1 className="text-white font-heading font-bold text-[42px] leading-[1.1] tracking-[-0.03em] mb-4">
                Smart Security That Protects What Matters Most
              </h1>

              {/* Subheadline */}
              <p className="text-slate-400 text-[15px] leading-[1.6] mb-6 font-body">
                Vivint&apos;s AI-powered cameras don&apos;t just record — they deter intruders with spotlights, sirens, and live 2-way audio. As a top Vivint partner, we get you exclusive deals on the most advanced system available. Free professional installation nationwide.
              </p>

              {/* Trust strip */}
              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-body tracking-[0.04em] uppercase mb-6">
                <span className="flex items-center gap-1">
                  <span className="text-amber-400 text-sm">&#9733;</span>
                  58,000+ reviews
                </span>
                <span className="text-slate-700">|</span>
                <span>BBB A+</span>
                <span className="text-slate-700">|</span>
                <span>2M+ Homes</span>
              </div>

              {/* CTA group */}
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="primary"
                  size="xl"
                  className="text-lg px-10"
                  onClick={onQuizOpen}
                >
                  Get My Free Quote
                </Button>
                <button
                  onClick={() => setVideoOpen(true)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 text-sm font-body group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
                    <Play size={16} className="text-white ml-0.5" />
                  </div>
                  Watch Overview
                </button>
              </div>

              <a
                href={`tel:${PHONE_NUMBER_RAW}`}
                onClick={trackPhoneClick}
                className="text-slate-500 hover:text-slate-300 text-[13px] font-body transition-colors duration-300"
              >
                Or call {PHONE_NUMBER}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </>
  )
}

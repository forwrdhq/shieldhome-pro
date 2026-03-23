'use client'

import { Star, Phone } from 'lucide-react'
import Button from '@/components/ui/Button'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

interface HeroSectionProps {
  onQuizOpen: () => void
}

export default function HeroSection({ onQuizOpen }: HeroSectionProps) {
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

          {/* Right: Product image area — 2 columns */}
          <div className="hero-image hidden lg:block lg:col-span-2">
            <div className="relative bg-slate-800 rounded-xl border border-slate-700 p-8">
              {/* Product image placeholder — app screenshot or device mockup */}
              <div className="aspect-[4/3] bg-slate-700/50 rounded-lg flex items-center justify-center mb-6">
                <span className="text-slate-500 text-sm font-body">Product Image</span>
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

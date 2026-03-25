'use client'

import Image from 'next/image'
import { useScrollReveal, useStaggerReveal } from './useScrollReveal'

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v4l2.5 2.5" />
        <path d="M2 10h1M17 10h1M10 2v1M10 17v1" />
      </svg>
    ),
    title: 'Smart Deter',
    description: 'LED light ring lets porch pirates know they\'ve been spotted',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5V6a1 1 0 011-1h12a1 1 0 011 1v4.5" />
        <path d="M1 14.5h18" />
        <circle cx="7" cy="10" r="2" />
        <circle cx="13" cy="10" r="2" />
      </svg>
    ),
    title: '2-Way Talk',
    description: 'Answer your door from anywhere with two-way audio',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 10L10 1l9 9" />
        <path d="M3 8.5V17a1 1 0 001 1h12a1 1 0 001-1V8.5" />
      </svg>
    ),
    title: 'Wide-Angle Lens',
    description: '180° x 180° for the widest field of view on any doorbell',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="16" height="12" rx="2" />
        <circle cx="10" cy="10" r="3" />
        <path d="M14 7h.01" />
      </svg>
    ),
    title: 'Keeps Recording',
    description: 'Even when WiFi goes down — onboard recording stores footage',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="8" width="12" height="10" rx="1" />
        <path d="M8 8V5a2 2 0 014 0v3" />
        <path d="M7 2h6" />
      </svg>
    ),
    title: 'Package Detection',
    description: 'Know instantly when a package is delivered or removed',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="4" />
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4" />
      </svg>
    ),
    title: 'Night Vision',
    description: 'See clearly day or night with built-in infrared',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="16" height="16" rx="2" />
        <path d="M2 7h16M7 2v16" strokeDasharray="2 2" />
      </svg>
    ),
    title: 'Detection Zones',
    description: 'Customize exactly which areas trigger alerts',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 10a9 9 0 0118 0" />
        <path d="M4 10a6 6 0 0112 0" />
        <path d="M7 10a3 3 0 016 0" />
        <circle cx="10" cy="10" r="1" fill="currentColor" />
      </svg>
    ),
    title: '24/7 Playback',
    description: 'Continuous video recording for up to 10 days',
  },
]

export default function DoorbellDeepDive() {
  const headingRef = useScrollReveal<HTMLDivElement>()
  const featuresRef = useStaggerReveal<HTMLDivElement>(60)

  return (
    <section className="py-14 md:py-20 bg-slate-900 relative overflow-hidden">
      {/* Subtle warm glow */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(180, 130, 60, 0.04)' }} />

      <div className="max-w-5xl mx-auto px-5 md:px-8 relative">
        {/* Desktop: two columns */}
        <div className="md:flex md:items-start md:gap-12">

          {/* Left: Product image */}
          <div className="md:w-[38%] flex-shrink-0 mb-8 md:mb-0">
            <div className="relative rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/40 aspect-[3/4] max-w-[320px] mx-auto md:mx-0">
              <Image
                src="/images/google/products/doorbell-camera-pro.png"
                alt="Vivint Doorbell Camera Pro 2"
                fill
                className="object-cover"
                sizes="320px"
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            </div>
          </div>

          {/* Right: Features */}
          <div className="md:w-[62%]">
            <div ref={headingRef}>
              <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-300)' }}>
                Doorbell Camera Pro 2
              </p>
              <h2 className="font-heading font-bold text-[22px] md:text-[34px] tracking-[-0.03em] text-white mb-6 md:mb-8">
                Don&apos;t just record crime. Prevent it.
              </h2>
            </div>

            {/* Desktop: 2-col grid */}
            <div ref={featuresRef} className="hidden md:grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="md:hidden overflow-x-auto -mx-5 px-5 scrollbar-hide pb-2">
              <div className="flex gap-3 min-w-max">
                {features.map((feature) => (
                  <div key={feature.title} className="w-[220px] flex-shrink-0">
                    <FeatureCard feature={feature} />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-body text-slate-500 text-center mt-3 uppercase tracking-widest">
                Swipe to see more
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  return (
    <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30 hover:border-slate-600/40 transition-all duration-500">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-300">
          {feature.icon}
        </div>
        <div>
          <h3 className="text-white font-heading font-semibold text-[13px] md:text-[14px] tracking-[-0.01em] mb-0.5">
            {feature.title}
          </h3>
          <p className="text-[11px] md:text-[12px] font-body text-slate-400 leading-[1.5]">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Star } from 'lucide-react'

export default function GuaranteeSection() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="py-14 md:py-20 bg-slate-900 relative overflow-hidden">
      {/* Subtle warm radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(180, 130, 60, 0.04)' }} />

      <div className="relative max-w-5xl mx-auto px-5 md:px-12">
        <div className="text-center mb-8 md:mb-14">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-4" style={{ color: 'var(--color-brass-300)' }}>
            Our Promise
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-white">
            Our 30-Day &ldquo;Completely Satisfied&rdquo; Guarantee
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10 md:mb-12">
          <div className="bg-slate-800/50 rounded-2xl p-7 md:p-8 border border-slate-700/40 hover:border-slate-600/40 transition-all duration-500">
            <h3 className="text-white font-heading font-semibold text-[17px] tracking-[-0.015em] mb-3">
              30-Day Satisfaction Guarantee
            </h3>
            <p className="text-[14px] md:text-[15px] font-body text-slate-400 leading-[1.7]">
              If you are not completely satisfied with your installation within 30 days — for any reason — we will make it right.
              That means sending a certified tech back out, adjusting the system to your exact needs, or refunding your first month&apos;s monitoring fee.
              No arguments. No runaround. No questions asked.
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-7 md:p-8 border border-slate-700/40 hover:border-slate-600/40 transition-all duration-500">
            <h3 className="text-white font-heading font-semibold text-[17px] tracking-[-0.015em] mb-3">
              Lifetime Equipment Warranty
            </h3>
            <p className="text-[14px] md:text-[15px] font-body text-slate-400 leading-[1.7]">
              You&apos;ve spent years building your business. The last thing you need is a security system that adds stress instead of removing it.
              All Vivint equipment carries a manufacturer warranty with remote diagnostics and on-site technician dispatch when needed.
            </p>
          </div>
        </div>

        {/* Product image row */}
        <div className="flex justify-center gap-6 md:gap-10 mb-10 md:mb-12 opacity-60">
          {[
            { src: '/images/products/outdoor-camera-pro.png', alt: 'Outdoor camera', w: 80 },
            { src: '/images/products/doorbell-camera-pro.png', alt: 'Doorbell camera', w: 60 },
            { src: '/images/products/smart-lock.png', alt: 'Smart lock', w: 70 },
            { src: '/images/products/smart-hub.png', alt: 'Smart hub', w: 70 },
          ].map((img) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={img.w}
              height={img.w}
              className="h-14 md:h-20 w-auto object-contain"
            />
          ))}
        </div>

        {/* Trust Reinforcement */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12px] md:text-[13px] font-body text-slate-500">
          <span className="flex items-center gap-1">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            Over 58,000 customers
          </span>
          <span className="text-slate-700">·</span>
          <span>A+ BBB rating</span>
          <span className="text-slate-700">·</span>
          <span>We stand behind every installation</span>
        </div>
      </div>
    </section>
  )
}

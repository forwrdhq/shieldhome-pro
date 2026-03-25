'use client'

import Image from 'next/image'
import { useScrollReveal, useStaggerReveal } from './useScrollReveal'

/* Social proof stats — varied from TrustBar */
const stats = [
  { value: '2M+', label: 'Homes Protected' },
  { value: '14s', label: 'Avg Response Time' },
  { value: '25+', label: 'Years in Business' },
  { value: '#1', label: 'SafeHome.org 2025' },
]

const testimonials = [
  {
    text: 'They were at my house the next morning. The whole system was set up in under 2 hours. I finally sleep through the night.',
    name: 'Sarah M.',
    location: 'Provo, UT',
    date: 'March 2026',
    initials: 'SM',
    color: '#059669',
    rating: 5,
  },
  {
    text: "I was paying ADT $52/month for a system that couldn't even tell the difference between my dog and a person. Switched through ShieldHome, they bought out my entire contract, and now I have cameras that actually scare people off. Night and day difference.",
    name: 'Jason R.',
    location: 'Scottsdale, AZ',
    date: 'February 2026',
    initials: 'JR',
    color: '#0F172A',
    rating: 5,
  },
  {
    text: 'The Smart Deter camera caught someone on our porch at 2am and scared them off with the siren. Worth every penny.',
    name: 'Michelle K.',
    location: 'Charlotte, NC',
    date: 'March 2026',
    initials: 'MK',
    color: 'var(--color-brass-500)',
    rating: 5,
  },
  {
    text: "The app alone is worth it. I can check on my house from anywhere, lock the doors remotely, and get alerts the second something moves. My husband was skeptical but now he's the one checking the cameras constantly.",
    name: 'Amanda T.',
    location: 'Dallas, TX',
    date: 'March 2026',
    initials: 'AT',
    color: '#7C3AED',
    rating: 5,
  },
]

/* Star SVG */
function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
      <path d="M7 0.5L8.76 5.04L13.5 5.5L9.98 8.66L10.98 13.5L7 11.04L3.02 13.5L4.02 8.66L0.5 5.5L5.24 5.04L7 0.5Z" />
    </svg>
  )
}

export default function TrustSection() {
  const statsRef = useStaggerReveal<HTMLDivElement>(100)
  const testimonialRef = useStaggerReveal<HTMLDivElement>(120)
  const guaranteeRef = useScrollReveal<HTMLDivElement>()

  return (
    <>
      {/* ── Stats Bar — not a repeat of TrustBar ── */}
      <section className="py-10 md:py-14 bg-slate-50 border-y border-slate-100">
        <div ref={statsRef} className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-4 gap-3 md:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading font-bold text-[22px] md:text-[34px] tracking-[-0.03em] text-slate-900 mb-0.5">
                  {stat.value}
                </p>
                <p className="text-[9px] md:text-[12px] font-body text-slate-400 uppercase tracking-[0.04em] md:tracking-[0.06em] leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
              Real Customers, Real Results
            </p>
            <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900">
              What Our Customers Say
            </h2>
          </div>

          {/* Video testimonial */}
          <div className="mb-8 md:mb-10">
            <div className="relative rounded-2xl overflow-hidden aspect-video max-w-3xl mx-auto border border-slate-100 shadow-sm">
              <iframe
                src="https://www.youtube.com/embed/mgHIEsr_XH0?rel=0"
                title="Vivint customer video testimonial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          <div ref={testimonialRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="group bg-white rounded-2xl p-5 md:p-6 border border-slate-100 hover:border-slate-200 transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)]"
              >
                {/* Avatar */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-heading font-bold tracking-wide flex-shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-heading font-semibold text-slate-900 tracking-[-0.01em] truncate">
                      {t.name}
                    </p>
                    <p className="text-[10px] font-body text-slate-400 truncate">
                      {t.location} &middot; {t.date}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[12px] md:text-[13px] font-body text-slate-600 leading-[1.6]" style={{ textIndent: '-0.35em' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Aggregate review link */}
          <p className="text-center mt-8 text-[13px] font-body text-slate-400">
            Based on 58,000+ verified customer reviews
          </p>
        </div>
      </section>

      {/* ── Guarantee Block — with product image ── */}
      <section className="py-14 md:py-20 bg-slate-900 relative overflow-hidden">
        {/* Subtle warm radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(180, 130, 60, 0.04)' }} />

        <div ref={guaranteeRef} className="max-w-5xl mx-auto px-4 md:px-8 relative">
          <div className="text-center mb-8 md:mb-14">
            <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-4" style={{ color: 'var(--color-brass-300)' }}>
              Our Promise
            </p>
            <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-white">
              The Protected Home Promise
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/40 hover:border-slate-600/40 transition-all duration-500">
              <h3 className="text-white font-heading font-semibold text-[17px] tracking-[-0.015em] mb-3">
                60-Day Unconditional Guarantee
              </h3>
              <p className="text-[15px] font-body text-slate-400 leading-[1.7]">
                Not satisfied? We remove the system and refund every penny. No questions asked, no fees, no hassle.
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/40 hover:border-slate-600/40 transition-all duration-500">
              <h3 className="text-white font-heading font-semibold text-[17px] tracking-[-0.015em] mb-3">
                Break-In Deductible Coverage
              </h3>
              <p className="text-[15px] font-body text-slate-400 leading-[1.7]">
                If someone breaks in while your system is armed, we cover up to $500 of your insurance deductible.
              </p>
            </div>
          </div>

          {/* Product image row */}
          <div className="flex justify-center gap-6 md:gap-10 mb-12 opacity-60">
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
                className="h-16 md:h-20 w-auto object-contain"
              />
            ))}
          </div>

          <div className="text-center">
            <a
              href="#hero-form"
              onClick={() => {
                window.dataLayer?.push({ event: 'cta_click', section: 'guarantee' })
              }}
              className="inline-flex items-center justify-center text-white px-8 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
              style={{ backgroundColor: 'var(--color-emerald-600)' }}
            >
              Get Protected Today
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

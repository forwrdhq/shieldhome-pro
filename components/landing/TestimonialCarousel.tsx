'use client'

import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal'

interface TestimonialData {
  name: string
  location: string
  date: string
  rating: number
  text: string
  initials: string
  color: string
  source?: string
}

const defaultTestimonials: TestimonialData[] = [
  {
    name: 'Sarah M.',
    location: 'Phoenix, AZ',
    date: 'Dec 2024',
    rating: 5,
    text: 'The setup was fast and the technician was super professional. I feel so much safer knowing my home is watched 24/7. The app makes it easy to check in from anywhere.',
    initials: 'SM',
    color: '#059669',
  },
  {
    name: 'Robert T.',
    location: 'Dallas, TX',
    date: 'Jan 2025',
    rating: 5,
    text: 'Best choice we made for our family. The cameras are crystal clear and the smart home features are great. Our doorbell camera caught a package thief red-handed.',
    initials: 'RT',
    color: '#0F172A',
  },
  {
    name: 'Jennifer K.',
    location: 'Atlanta, GA',
    date: 'Nov 2024',
    rating: 5,
    text: "I was unsure at first about the monthly cost, but after seeing everything included — free setup, free doorbell camera — it was worth it. The system just works.",
    initials: 'JK',
    color: '#7C3AED',
  },
  {
    name: 'David R.',
    location: 'Denver, CO',
    date: 'Feb 2025',
    rating: 5,
    text: "I put it off for months. Then my neighbor's house got broken into. I called the next day and had my system set up within 48 hours. Wish I'd done it sooner.",
    initials: 'DR',
    color: 'var(--color-brass-500)',
  },
]

function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
      <path d="M7 0.5L8.76 5.04L13.5 5.5L9.98 8.66L10.98 13.5L7 11.04L3.02 13.5L4.02 8.66L0.5 5.5L5.24 5.04L7 0.5Z" />
    </svg>
  )
}

const YOUTUBE_ID = 'mgHIEsr_XH0'

interface TestimonialCarouselProps {
  testimonials?: TestimonialData[]
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps = {}) {
  const items = testimonials || defaultTestimonials
  const headingRef = useScrollReveal<HTMLDivElement>()
  const testimonialRef = useStaggerReveal<HTMLDivElement>(120)

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div ref={headingRef} className="text-center mb-8 md:mb-12">
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
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0`}
              title="Vivint customer video testimonial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              loading="lazy"
            />
          </div>
        </div>

        {/* Testimonial cards */}
        <div ref={testimonialRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {items.map((t) => (
            <div
              key={t.name}
              className="group bg-white rounded-2xl p-5 md:p-6 border border-slate-100 hover:border-slate-200 transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)]"
            >
              {/* Avatar */}
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-heading font-bold tracking-wide flex-shrink-0 ${t.color.startsWith('bg-') ? t.color : ''}`}
                  style={t.color.startsWith('bg-') ? undefined : { backgroundColor: t.color }}
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

        <p className="text-center mt-8 text-[13px] font-body text-slate-400">
          Based on 58,000+ verified customer reviews
        </p>
      </div>
    </section>
  )
}

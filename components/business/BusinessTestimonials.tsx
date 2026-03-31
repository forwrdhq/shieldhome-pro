'use client'

import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal'
import { Star, TrendingDown, Key, Zap, DollarSign } from 'lucide-react'

interface Testimonial {
  initials: string
  name: string
  business: string
  location: string
  date: string
  headline: string
  HeadlineIcon: React.ComponentType<{ size?: number; className?: string }>
  body: string
  color: string
}

const testimonials: Testimonial[] = [
  {
    initials: 'MC',
    name: 'Mike C.',
    business: 'Parkside Bar & Grill',
    location: 'Denver, CO',
    date: 'Jan 2025',
    headline: 'Insurance dropped $400/year. ADT contract was $74/mo for the same hardware.',
    HeadlineIcon: DollarSign,
    body: "We were paying ADT $74 a month and didn't really know what we were getting for it. Two months after switching, a guy came to our rear entrance at 11pm. The Smart Deter camera hit the spotlight and siren the second he touched the door handle. He ran. We watched it live on the app from home. Our insurance dropped $400 that year. I'm genuinely angry I didn't do this sooner.",
    color: '#059669',
  },
  {
    initials: 'TL',
    name: 'Tara L.',
    business: 'Mesa Verde Boutique',
    location: 'Phoenix, AZ',
    date: 'Feb 2025',
    headline: 'Saving $300/year vs. former ADT business plan — for the exact same hardware.',
    HeadlineIcon: TrendingDown,
    body: "I didn't know ADT had a separate business rate until ShieldHome walked me through the comparison side by side. I was paying $61/mo for the exact same monitoring my friend gets for her home for $29. Nobody told me that. Nobody at ADT was ever going to tell me that. I switched the same week. Setup was one morning.",
    color: '#D97706',
  },
  {
    initials: 'JR',
    name: 'Jason R.',
    business: 'Property Manager, 6 locations',
    location: 'Austin, TX',
    date: 'Dec 2024',
    headline: 'Access code changes now take 30 seconds. Used to cost $800/month in locksmith fees.',
    HeadlineIcon: Key,
    body: "Before ShieldHome I was calling locksmiths every time a tenant moved out. One month I paid $800 in locksmith fees across three properties. Now I open the app, revoke the old code, set the new one, done in 30 seconds. The system paid for itself in the first two months.",
    color: '#7C3AED',
  },
  {
    initials: 'SK',
    name: 'Sandra K.',
    business: 'Clearwater Legal',
    location: 'Salt Lake City, UT',
    date: 'Mar 2025',
    headline: 'Fully installed in 3 hours. Previous provider took 12 minutes to respond to a break-in attempt.',
    HeadlineIcon: Zap,
    body: "We had a break-in attempt at our previous location. The alarm went off but our old provider took almost 12 minutes to respond — the intruder was long gone. The 8-second response time from Vivint was the only reason we chose ShieldHome. The installer explained everything, finished in under 3 hours, and picked up the phone on the first ring when I had a question a week later.",
    color: '#0891B2',
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
      ))}
    </div>
  )
}

export default function BusinessTestimonials() {
  const headingRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useStaggerReveal<HTMLDivElement>(100)

  return (
    <section className="py-14 md:py-20 bg-slate-900">
      <div className="max-w-5xl mx-auto px-5 md:px-12">
        <div ref={headingRef} className="text-center mb-10 md:mb-14">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3 text-emerald-400/70">
            Real Results
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-white">
            Business Owners Who Made the Switch — And What Happened Next
          </h2>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 gap-5 md:gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 md:p-7 hover:bg-white/[0.06] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-heading font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-[13px] font-heading font-semibold text-white">
                    {t.name} — <span className="text-slate-400 font-normal">{t.business}</span>
                  </p>
                  <p className="text-[11px] font-body text-slate-500">
                    {t.location} · {t.date}
                  </p>
                </div>
              </div>

              <Stars />

              <div className="flex items-start gap-2 mt-3 mb-3">
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: t.color + '22' }}>
                  <span style={{ color: t.color, display: 'flex' }}>
                    <t.HeadlineIcon size={13} />
                  </span>
                </div>
                <p className="text-[13px] md:text-[14px] font-heading font-bold text-emerald-400">
                  {t.headline}
                </p>
              </div>

              <p className="text-[13px] font-body text-slate-400 leading-relaxed">
                &ldquo;{t.body}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-[12px] font-body text-slate-500 mt-8">
          Based on 58,000+ verified customer reviews across all ShieldHome Pro installations
        </p>
      </div>
    </section>
  )
}

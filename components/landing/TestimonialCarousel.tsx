'use client'

import { Star } from 'lucide-react'

interface TestimonialData {
  name: string
  location: string
  date: string
  rating: number
  text: string
  initials: string
  source: string
}

interface TestimonialCarouselProps {
  testimonials?: TestimonialData[]
}

const defaultTestimonials: TestimonialData[] = [
  {
    name: 'Sarah M.',
    location: 'Phoenix, AZ',
    date: 'Dec 2024',
    rating: 5,
    text: 'The setup was fast and the technician was super professional. I feel so much safer knowing my home is watched 24/7. The app makes it easy to check in from anywhere.',
    initials: 'SM',
    source: 'Google',
  },
  {
    name: 'Robert T.',
    location: 'Dallas, TX',
    date: 'Jan 2025',
    rating: 5,
    text: 'Best choice we made for our family. The cameras are crystal clear and the smart home features are great. Our doorbell camera caught a package thief red-handed.',
    initials: 'RT',
    source: 'Google',
  },
  {
    name: 'Jennifer K.',
    location: 'Atlanta, GA',
    date: 'Nov 2024',
    rating: 4,
    text: "I was unsure at first about the monthly cost, but after seeing everything included — free setup, free doorbell camera — it was worth it. Only wish the app loaded a bit faster.",
    initials: 'JK',
    source: 'BBB',
  },
  {
    name: 'David R.',
    location: 'Denver, CO',
    date: 'Feb 2025',
    rating: 5,
    text: "I put it off for months. Then my neighbor's house got broken into. I called the next day and had my system set up within 48 hours. Wish I'd done it sooner.",
    initials: 'DR',
    source: 'Google',
  },
  {
    name: 'Maria L.',
    location: 'Sacramento, CA',
    date: 'Jan 2025',
    rating: 5,
    text: "As a single mom, home security was a big deal. The whole process was easy — from the quiz to setup. My kids love saying 'Alexa, arm the system' before bed.",
    initials: 'ML',
    source: 'Facebook',
  },
  {
    name: 'James W.',
    location: 'Chicago, IL',
    date: 'Dec 2024',
    rating: 4,
    text: "Solid system. The outdoor cameras are great quality and the smart lock works well. Setup took about 3 hours. Support was helpful when I had questions.",
    initials: 'JW',
    source: 'Google',
  },
]

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps = {}) {
  const items = testimonials || defaultTestimonials

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-12" data-animate>
          <h2 className="text-h2 text-slate-900 mb-3">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={18} className="text-amber-500 fill-amber-500" />
              ))}
            </span>
            <span className="text-body text-slate-500">4.8/5 from 58,000+ reviews</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hover"
              data-animate
            >
              {/* Stars */}
              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < t.rating
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-slate-200 fill-slate-200'
                    }
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-body text-slate-700 mb-4 flex-1 line-clamp-3">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-body-sm font-heading font-semibold text-slate-900">{t.name}</p>
                  <p className="text-caption text-slate-500">
                    {t.location} &middot; {t.date}
                  </p>
                </div>
                <span className="text-caption text-slate-400">{t.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

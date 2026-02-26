'use client'

import { Star, CheckCircle, ExternalLink } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Phoenix, AZ',
    date: 'Dec 2024',
    rating: 5,
    text: 'The installation was seamless and the technician was incredibly professional. I feel so much safer knowing my home is monitored 24/7. The app makes it so easy to check in from anywhere.',
    initials: 'SM',
    color: 'bg-purple-500',
    platform: 'Google',
    verified: true,
  },
  {
    name: 'Robert T.',
    location: 'Dallas, TX',
    date: 'Jan 2025',
    rating: 5,
    text: 'Best decision we made for our family. The cameras are crystal clear and the smart home features are amazing. Our doorbell camera caught a package thief red-handed.',
    initials: 'RT',
    color: 'bg-blue-500',
    platform: 'Google',
    verified: true,
  },
  {
    name: 'Jennifer K.',
    location: 'Atlanta, GA',
    date: 'Nov 2024',
    rating: 4,
    text: "I was hesitant at first about the monthly cost, but after seeing everything included — free installation, free doorbell camera — it was worth it. Only wish the app loaded a bit faster.",
    initials: 'JK',
    color: 'bg-pink-500',
    platform: 'BBB',
    verified: true,
  },
  {
    name: 'David R.',
    location: 'Denver, CO',
    date: 'Feb 2025',
    rating: 5,
    text: "I put it off for months. Then my neighbor's house got broken into. I called ShieldHome Pro the next day and had my system installed within 48 hours. Wish I'd done it sooner.",
    initials: 'DR',
    color: 'bg-teal-500',
    platform: 'Google',
    verified: true,
  },
  {
    name: 'Maria L.',
    location: 'Sacramento, CA',
    date: 'Jan 2025',
    rating: 5,
    text: "As a single mom, home security was a big priority. The whole process was easy — from the quiz to installation. My kids love saying 'Alexa, arm the system' before bed.",
    initials: 'ML',
    color: 'bg-orange-500',
    platform: 'Trustpilot',
    verified: true,
  },
  {
    name: 'James W.',
    location: 'Chicago, IL',
    date: 'Dec 2024',
    rating: 4,
    text: "Solid system overall. The outdoor cameras are great quality and the smart lock integration works well. Setup took about 3 hours. Customer support was helpful when I had questions.",
    initials: 'JW',
    color: 'bg-indigo-500',
    platform: 'Google',
    verified: true,
  },
]

function PlatformBadge({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    Google: 'bg-blue-50 text-blue-700 border-blue-200',
    BBB: 'bg-amber-50 text-amber-700 border-amber-200',
    Trustpilot: 'bg-green-50 text-green-700 border-green-200',
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors[platform] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      <ExternalLink size={9} />
      {platform} Review
    </span>
  )
}

export default function TestimonialCarousel() {
  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600 font-medium">4.8/5 from 58,000+ reviews</span>
          </div>
          <p className="text-sm text-gray-500">
            Verified reviews from Google, BBB, and Trustpilot
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[#F8F9FA] rounded-xl p-6 border border-gray-100 flex flex-col"
            >
              {/* Stars + platform */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < t.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200 fill-gray-200'
                      }
                    />
                  ))}
                </div>
                <PlatformBadge platform={t.platform} />
              </div>

              {/* Review text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-gray-200 pt-4 flex items-center gap-3">
                <div
                  className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {t.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    {t.verified && <CheckCircle size={14} className="text-[#00C853] flex-shrink-0" />}
                  </div>
                  <p className="text-gray-500 text-xs">
                    {t.location} &bull; {t.date}
                  </p>
                </div>
                {t.verified && (
                  <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">Verified</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

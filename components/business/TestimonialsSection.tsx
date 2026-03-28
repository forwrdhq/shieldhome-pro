import { Star, CheckCircle } from 'lucide-react'

const testimonials = [
  {
    quote: "We were paying $89/month with our old provider. ShieldHome cut that in half and gave us cameras that actually work. Best decision we made all year.",
    name: 'Mike T.',
    business: 'Restaurant Owner',
    city: 'Phoenix, AZ',
    initials: 'MT',
    color: 'bg-blue-500',
  },
  {
    quote: "As a dental practice we needed HIPAA-compliant physical security. ShieldHome handled everything and we were up and running in 48 hours.",
    name: 'Dr. Sarah K.',
    business: 'Dental Practice Owner',
    city: 'Austin, TX',
    initials: 'SK',
    color: 'bg-purple-500',
  },
  {
    quote: "Had 3 break-ins in 2 years with our old system. Zero incidents since switching. The AI cameras are a completely different level.",
    name: 'James R.',
    business: 'Retail Store Owner',
    city: 'Denver, CO',
    initials: 'JR',
    color: 'bg-teal-500',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A2E] text-center mb-12">
          Trusted by Business Owners Across America
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-[#F8F9FA] rounded-xl p-6 border border-gray-100 flex flex-col">
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="border-t border-gray-200 pt-4 flex items-center gap-3">
                <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <CheckCircle size={14} className="text-[#00C853]" />
                  </div>
                  <p className="text-gray-500 text-xs">{t.business}, {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

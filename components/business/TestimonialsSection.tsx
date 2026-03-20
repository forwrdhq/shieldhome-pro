const testimonials = [
  {
    stars: 5,
    quote: 'We were paying $89/month with our old provider. ShieldHome cut that in half and gave us cameras that actually work. Best decision we made all year.',
    name: 'Mike T.',
    role: 'Restaurant Owner, Phoenix AZ',
  },
  {
    stars: 5,
    quote: 'As a dental practice we needed compliant physical security. ShieldHome handled everything and we were up and running in 48 hours.',
    name: 'Dr. Sarah K.',
    role: 'Dental Practice Owner, Austin TX',
  },
  {
    stars: 5,
    quote: 'Had 3 break-ins in 2 years with our old system. Zero incidents since switching. The AI cameras are a completely different level.',
    name: 'James R.',
    role: 'Retail Store Owner, Denver CO',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1A1A2E' }}>
          Trusted by Business Owners Across America
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
              <div>
                <p className="font-bold text-sm" style={{ color: '#1A1A2E' }}>{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

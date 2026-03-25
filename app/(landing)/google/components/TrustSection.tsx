'use client'

import { useScrollReveal, useStaggerReveal } from './useScrollReveal'

const badges = [
  'Vivint Authorized Dealer',
  'BBB A+ Rated',
  '2M+ Homes Protected',
  '14-Second Avg Response',
]

const testimonials = [
  {
    text: 'They were at my house the next morning. The whole system was set up in under 2 hours. I finally sleep through the night.',
    name: 'Sarah M.',
    location: 'Provo, UT',
  },
  {
    text: "Switched from ADT and couldn't be happier. They bought out my contract and the new cameras are incredible.",
    name: 'Jason R.',
    location: 'Sandy, UT',
  },
  {
    text: 'The Smart Deter camera caught someone on our porch at 2am and scared them off with the siren. Worth every penny.',
    name: 'Michelle K.',
    location: 'Orem, UT',
  },
]

/* Star SVG — single, reusable */
function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
      <path d="M7 0.5L8.76 5.04L13.5 5.5L9.98 8.66L10.98 13.5L7 11.04L3.02 13.5L4.02 8.66L0.5 5.5L5.24 5.04L7 0.5Z" />
    </svg>
  )
}

export default function TrustSection() {
  const badgeRef = useScrollReveal<HTMLDivElement>()
  const testimonialRef = useStaggerReveal<HTMLDivElement>(120)
  const guaranteeRef = useScrollReveal<HTMLDivElement>()

  return (
    <>
      {/* Authority Badge Strip */}
      <section className="py-6 bg-slate-50 border-y border-slate-100">
        <div ref={badgeRef} className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {badges.map((badge, i) => (
              <span key={badge} className="text-[11px] font-body text-slate-400 uppercase tracking-[0.08em] whitespace-nowrap">
                {i > 0 && <span className="inline-block mr-4 text-slate-200">—</span>}
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading font-bold text-[28px] md:text-[34px] tracking-[-0.025em] text-slate-900">
              What Our Customers Say
            </h2>
          </div>
          <div ref={testimonialRef} className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="group bg-white rounded-xl p-6 md:p-7 border border-slate-100 hover:border-slate-200 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
                {/* Quote — hanging punctuation */}
                <p className="text-[14px] font-body text-slate-600 leading-[1.65] mb-5" style={{ textIndent: '-0.4em' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <p className="text-[13px] font-heading font-semibold text-slate-900 tracking-[-0.01em]">
                    {t.name}
                  </p>
                  <p className="text-[12px] font-body text-slate-400">
                    {t.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Block */}
      <section className="py-20 md:py-28 bg-slate-900 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div ref={guaranteeRef} className="max-w-4xl mx-auto px-4 md:px-8 relative">
          <h2 className="font-heading font-bold text-[28px] md:text-[34px] tracking-[-0.025em] text-white text-center mb-12">
            The Protected Home Promise
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-slate-800/60 rounded-xl p-7 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500">
              <h3 className="text-white font-heading font-semibold text-[16px] tracking-[-0.01em] mb-3">
                60-Day Unconditional Guarantee
              </h3>
              <p className="text-[14px] font-body text-slate-400 leading-relaxed">
                Not satisfied? We remove the system and refund every penny. No questions asked.
              </p>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-7 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500">
              <h3 className="text-white font-heading font-semibold text-[16px] tracking-[-0.01em] mb-3">
                Break-In Deductible Coverage
              </h3>
              <p className="text-[14px] font-body text-slate-400 leading-relaxed">
                If someone breaks in while your system is armed, we cover up to $500 of your insurance deductible.
              </p>
            </div>
          </div>
          <div className="text-center">
            <a
              href="#hero-form"
              onClick={() => {
                window.dataLayer?.push({ event: 'cta_click', section: 'guarantee' })
              }}
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
            >
              Get Protected Today
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

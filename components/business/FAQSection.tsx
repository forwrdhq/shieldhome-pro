'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What does the free security assessment include?',
    a: 'A certified security specialist will visit your location, walk the property, identify vulnerabilities and coverage gaps, and provide a written security recommendation — at zero cost and zero obligation.',
  },
  {
    q: 'How does your pricing compare to ADT Business?',
    a: 'Our commercial monitoring starts at ~$40/month, compared to ADT Business at $50–53/month with a mandatory 36-month contract. We also offer a month-to-month option when equipment is purchased upfront.',
  },
  {
    q: 'What if I\'m currently locked in a contract?',
    a: 'We offer switching assistance up to $1,000 to help offset early termination fees. Ask your specialist about current switching offers when they contact you.',
  },
  {
    q: 'How quickly can you install?',
    a: 'Most installations are completed within 48–72 hours of signing. We work around your business hours to minimize disruption.',
  },
  {
    q: 'Do you offer financing?',
    a: 'Yes. We offer 0% APR financing for up to 60 months on equipment through Vivint\'s financing partners. Many businesses get a full system for under $100/month total (equipment + monitoring combined).',
  },
  {
    q: 'What areas do you serve?',
    a: 'We install nationwide across all 50 states through Vivint\'s certified installation network.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1A1A2E' }}>
          Common Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-sm pr-4" style={{ color: '#1A1A2E' }}>{faq.q}</span>
                <ChevronDown
                  className="w-5 h-5 flex-shrink-0 transition-transform text-gray-400"
                  style={{ transform: open === i ? 'rotate(180deg)' : 'none' }}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4 bg-gray-50">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

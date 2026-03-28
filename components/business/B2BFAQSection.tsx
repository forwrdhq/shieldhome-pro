'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    q: "What if I'm currently locked in a contract?",
    a: 'We offer switching assistance up to $1,000 to help offset early termination fees. Ask your specialist about current switching offers.',
  },
  {
    q: 'How quickly can you install?',
    a: 'Most installations are completed within 48–72 hours of signing. We work around your business hours to minimize disruption.',
  },
  {
    q: 'Do you offer financing?',
    a: "Yes. We offer 0% APR financing for up to 60 months on equipment through Vivint's financing partners. Many businesses get a full system for under $100/month total (equipment + monitoring combined).",
  },
  {
    q: 'What areas do you serve?',
    a: "We install nationwide across all 50 states through Vivint's certified installation network.",
  },
]

export default function B2BFAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A2E] text-center mb-10">
          Common Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#F8F9FA] rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-100 transition-colors"
                aria-expanded={open === i}
                aria-controls={`b2b-faq-${i}`}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={cn(
                    'text-gray-500 flex-shrink-0 transition-transform duration-200',
                    open === i && 'rotate-180'
                  )}
                />
              </button>
              <div
                id={`b2b-faq-${i}`}
                role="region"
                className={cn(
                  'overflow-hidden transition-all duration-200',
                  open === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="px-5 pb-5 text-gray-600 leading-relaxed text-sm">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

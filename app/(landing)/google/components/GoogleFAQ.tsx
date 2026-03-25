'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { pushDataLayer } from '@/lib/google-tracking'

const faqs = [
  {
    q: 'How much does this actually cost?',
    a: "The Total Shield Package starts at $0 down with monitoring as low as $24.99/month. Most families pay $35-$55/month total including equipment financing. That's less than $2/day for complete home protection.",
  },
  {
    q: 'Am I locked into a long contract?',
    a: "Once your equipment is paid off, you're month-to-month with no cancellation fees. If you finance over 36 months, you have a service agreement during that period — but your equipment is yours and your rate is locked in.",
  },
  {
    q: 'I already have ADT/SimpliSafe/Ring. Why switch?',
    a: "We'll pay up to $1,000 to buy out your existing contract. Vivint's Smart Deter cameras don't just record — they actively deter intruders with spotlights, sirens, and 2-way audio. Plus you get free installation and a Visa gift card.",
  },
  {
    q: 'How fast can you install?',
    a: 'Most installations happen within 24-48 hours. In many cases, same-day. Your certified technician handles everything — placement, wiring, app setup, and training. Your only job is to answer the door.',
  },
  {
    q: "What if I don't like it?",
    a: "Our 60-day Protected Home Promise means you try the full system risk-free. If you're not completely satisfied for any reason, we remove everything and refund your money.",
  },
  {
    q: 'Who is ShieldHome? Is this legit?',
    a: "ShieldHome.pro is an authorized Vivint dealer. Vivint protects 2M+ homes and has 25+ years in business. Your equipment, monitoring, and support all come from Vivint — we're your local partner with exclusive deals.",
  },
]

export default function GoogleFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  function handleToggle(i: number) {
    const isOpening = open !== i
    setOpen(isOpening ? i : null)
    if (isOpening) {
      pushDataLayer('faq_open', { question: faqs[i].q })
    }
  }

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <h2 className="text-h2 text-slate-900 text-center mb-10">
          Common Questions
        </h2>
        <div className="divide-y divide-slate-100">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => handleToggle(i)}
                className="w-full flex items-center justify-between py-5 text-left group"
                aria-expanded={open === i}
              >
                <span className="text-h4 text-slate-900 pr-4">{faq.q}</span>
                {open === i
                  ? <Minus size={20} className="text-slate-900 flex-shrink-0" />
                  : <Plus size={20} className="text-slate-400 flex-shrink-0" />
                }
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  open === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <div className="pb-6 text-body text-slate-600 leading-relaxed">
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

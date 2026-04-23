'use client'

import { useState } from 'react'
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
    a: "ShieldHome is a top-performing Vivint Smart Home marketing partner. Because of our volume and direct relationship with Vivint, we negotiate exclusive promotions, bonus equipment, and package deals that aren't available on Vivint.com or through most other partners. Once your system is installed, you're a full Vivint customer with 24/7 monitoring, the app, and all warranties — we just get you a better deal getting there.",
  },
]

/* Custom plus/minus SVG — matching stroke weight to body type */
function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn(
        'flex-shrink-0 transition-transform duration-300',
        open && 'rotate-45'
      )}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

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
    <section className="py-14 md:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <div className="text-center mb-8 md:mb-14">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-4" style={{ color: 'var(--color-brass-400)' }}>
            Questions & Answers
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900">
            Common Questions
          </h2>
        </div>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-100 last:border-b-0">
              <button
                onClick={() => handleToggle(i)}
                className="w-full flex items-center justify-between py-6 text-left group"
                aria-expanded={open === i}
              >
                <span className="font-heading font-semibold text-[15px] md:text-[17px] tracking-[-0.01em] text-slate-900 pr-4 group-hover:text-slate-700 transition-colors duration-300">
                  {faq.q}
                </span>
                <span className={cn(
                  'transition-colors duration-300',
                  open === i ? 'text-slate-900' : 'text-slate-300 group-hover:text-slate-500'
                )}>
                  <ToggleIcon open={open === i} />
                </span>
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-400',
                  open === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <div className="pb-7 text-[15px] font-body text-slate-500 leading-[1.7] max-w-[90%]">
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

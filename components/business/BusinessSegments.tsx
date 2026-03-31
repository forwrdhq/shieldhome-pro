'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { pushDataLayer } from '@/lib/google-tracking'

function scrollToForm() {
  document.querySelector('#business-form')?.scrollIntoView({ behavior: 'smooth' })
}

interface SegmentItem {
  emoji: string
  title: string
  stat: string
  pains: string[]
  solution: string
  cta: string
}

const segments: SegmentItem[] = [
  {
    emoji: '🏪',
    title: 'Retail & Small Business',
    stat: 'Employee and customer theft costs U.S. retailers $112B+ per year',
    pains: [
      "Shoplifters visually scan for stores without deterrents — if they don't see a visible system, your store is on their list",
      "Employee theft accounts for up to 75% of inventory loss — and most of it happens when you're not watching",
      'False alarms from cheap consumer systems can result in $250+ city fines per incident',
    ],
    solution: 'AI Smart Deter cameras activate a spotlight and 85dB siren the moment a threat is detected — before entry, not after. Most incidents are deterred before a window is broken.',
    cta: 'Protect My Retail Location →',
  },
  {
    emoji: '🏢',
    title: 'Offices & Professional Services',
    stat: 'Office break-ins spike 340% after hours and on weekends',
    pains: [
      "Every time an employee leaves, you're manually managing access codes — or worse, not managing them at all",
      "ADT's business platform requires 3 separate apps to do what a single app should do — your team uses none of them consistently",
      'After-hours unauthorised access goes completely undetected until you check footage days later',
    ],
    solution: 'Per-employee smart lock codes you can grant or revoke instantly from your phone. Text alert every time any code is used. One app. Total visibility.',
    cta: 'Protect My Office →',
  },
  {
    emoji: '🏭',
    title: 'Warehouses & Industrial',
    stat: 'Cargo theft incidents average $214,000 per event — and 80% occur at loading docks',
    pains: [
      "Standard camera systems can't cover a loading dock and full warehouse floor simultaneously without blind spots",
      "Consumer-grade cameras at 1080p can't capture licence plates or faces clearly enough to be useful in an investigation",
      'Environmental monitoring gaps — temperature, humidity, power outages — leave inventory at risk between checks',
    ],
    solution: '4K HDR cameras with 40×50ft motion detection coverage. Up to 12 cameras per location with Smart Drive local storage. Zero blind spots.',
    cta: 'Protect My Facility →',
  },
  {
    emoji: '🍽️',
    title: 'Restaurants & Food Service',
    stat: '60% of restaurant theft occurs after close — most owners have no idea what happens at 2am',
    pains: [
      'Kitchen staff with unsupervised access after closing have caused the majority of after-hours restaurant losses',
      'Delivery access windows — when your back door is propped open for 20 minutes — are the most exploited vulnerability in food service',
      'A false alarm at 3am means a police response, a fine, and you\'re woken up with no useful footage',
    ],
    solution: 'Smart Deter cameras cover every entry point. Motion-triggered alerts go to your phone the moment anything moves after hours. Review footage from bed.',
    cta: 'Protect My Restaurant →',
  },
]

export default function BusinessSegments() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const headingRef = useScrollReveal<HTMLDivElement>()

  function toggle(index: number) {
    const isOpening = openIndex !== index
    setOpenIndex(isOpening ? index : null)
    if (isOpening) {
      pushDataLayer('segment_tab_opened', { segment: segments[index].title })
    }
  }

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-5 md:px-12">
        <div ref={headingRef} className="text-center mb-10 md:mb-14">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
            Industry Solutions
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900">
            What&apos;s the Biggest Security Risk for YOUR Business?
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {segments.map((seg, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={seg.title}
                className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'border-emerald-200 bg-emerald-50/30 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                {/* Header */}
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <span className="text-[24px] md:text-[28px]">{seg.emoji}</span>
                    <div>
                      <h3 className="font-heading font-bold text-[15px] md:text-[17px] text-slate-900 tracking-[-0.01em]">
                        {seg.title}
                      </h3>
                      <p className="text-[12px] md:text-[13px] font-body text-slate-500 mt-0.5">
                        {seg.stat}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-5 md:px-6 pb-6">
                    {/* Pain Points */}
                    <ul className="space-y-2.5 mb-5">
                      {seg.pains.map((pain, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-[13px] md:text-[14px] font-body text-slate-600 leading-relaxed">
                          <span className="text-red-400 mt-0.5 flex-shrink-0">⚠️</span>
                          {pain}
                        </li>
                      ))}
                    </ul>

                    {/* Solution Callout */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 md:p-5 mb-5">
                      <p className="text-[11px] font-heading font-semibold uppercase tracking-[0.1em] text-emerald-700 mb-2">
                        How Vivint solves this
                      </p>
                      <p className="text-[13px] md:text-[14px] font-body text-emerald-900/80 leading-relaxed">
                        {seg.solution}
                      </p>
                    </div>

                    {/* Segment CTA */}
                    <button
                      onClick={scrollToForm}
                      className="text-emerald-600 hover:text-emerald-700 font-heading font-semibold text-[14px] transition-colors duration-200"
                    >
                      {seg.cta}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

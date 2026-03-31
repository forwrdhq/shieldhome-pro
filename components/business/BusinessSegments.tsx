'use client'

import { useState } from 'react'
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
      'Shoplifters visually scan entry points — stores without visible deterrents go on their list',
      'Employee theft accounts for up to 75% of inventory loss — most happens when you\'re not watching',
      'Consumer-grade systems generate false alarms that result in $250+ city fines per incident',
      'Most retail break-ins happen within 60 seconds of alarm trigger — standard monitoring is too slow',
    ],
    solution: 'AI Smart Deter cameras activate a spotlight and 85dB siren the moment a threat is detected — before entry, not after. Most incidents are deterred before a window is broken. Insurance carriers give discounts for documented deterrence systems. The 8-second monitoring response means police are in transit before most intruders get inside.',
    cta: 'Protect My Retail Location →',
  },
  {
    emoji: '🏢',
    title: 'Offices & Professional Services',
    stat: 'Office break-ins spike 340% after hours and on weekends',
    pains: [
      'Every time an employee leaves, access codes need updating — or they don\'t get updated at all',
      'ADT\'s business platform requires 3 separate apps to do what one app should handle',
      'After-hours unauthorized access goes completely undetected until footage is reviewed days later',
      'Most offices have no record of who entered and when — creating liability gaps',
    ],
    solution: 'Per-employee smart lock codes you grant or revoke instantly from your phone. Text alert every time any code is used. One app: arm/disarm, live feeds, door locks, review footage. This is the #1 complaint from every office customer switching from ADT — they were managing three separate platforms.',
    cta: 'Protect My Office →',
  },
  {
    emoji: '🏭',
    title: 'Warehouses & Industrial',
    stat: 'Cargo theft incidents average $214,000 per event — 80% occur at loading docks',
    pains: [
      'Standard cameras can\'t cover loading docks AND the full warehouse floor without blind spots',
      'Consumer-grade 1080p cameras can\'t capture license plates or faces usably in an investigation',
      'Environmental monitoring gaps — temperature, humidity, power outages — leave inventory at risk',
      'After-close access is often completely unmonitored',
    ],
    solution: '4K HDR cameras with 40×50ft motion detection coverage eliminate blind spots. Up to 12 cameras per location with Smart Drive local storage for 30-day footage retention. Motion-triggered alerts on every entry point — loading dock, side entrances, parking areas. Environmental sensors for temperature and humidity protect cold-storage and sensitive inventory.',
    cta: 'Protect My Facility →',
  },
  {
    emoji: '🍽️',
    title: 'Restaurants & Food Service',
    stat: '60% of restaurant theft occurs after close — most owners have no idea what happens at 2am',
    pains: [
      'Kitchen staff with unsupervised after-hours access account for the majority of post-close losses',
      'Delivery windows — when the back door is propped open — are the most exploited vulnerability',
      'A false alarm at 3am means a police response, a potential fine, and you\'re woken up with no useful footage',
      'Most restaurants have zero documented access records — insurance claims are nearly impossible',
    ],
    solution: 'Smart Deter cameras on every entry point. Motion alerts to your phone the second anything moves after hours. Smart locks on kitchen and back-of-house access — per-employee codes, instant revoke, text log of every entry. Watch footage from anywhere. Document everything for insurance.',
    cta: 'Protect My Restaurant →',
  },
]

export default function BusinessSegments() {
  const [activeTab, setActiveTab] = useState(0)
  const headingRef = useScrollReveal<HTMLDivElement>()

  function handleTabClick(index: number) {
    setActiveTab(index)
    pushDataLayer('tab_click', { tab_name: segments[index].title, section: 'industry_segments' })
  }

  const active = segments[activeTab]

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-5 md:px-12">
        <div ref={headingRef} className="text-center mb-8 md:mb-10">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
            Industry Solutions
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900 mb-2">
            What&apos;s the Biggest Security Risk for YOUR Business?
          </h2>
          <p className="text-[13px] md:text-[15px] font-body text-slate-400">
            Click your business type. We built a different solution for each one.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-1 scrollbar-hide">
          {segments.map((seg, i) => (
            <button
              key={seg.title}
              type="button"
              onClick={() => handleTabClick(i)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border text-[13px] font-heading font-semibold transition-all duration-200 ${
                activeTab === i
                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-[0_4px_12px_rgba(5,150,105,0.3)]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="text-[16px]">{seg.emoji}</span>
              <span className="whitespace-nowrap">{seg.title}</span>
            </button>
          ))}
        </div>

        {/* Active Panel */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          {/* Stat Callout */}
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
            <p className="text-[13px] md:text-[14px] font-heading font-semibold text-amber-800">
              📊 {active.stat}
            </p>
          </div>

          <div className="p-5 md:p-7">
            {/* Pain Points */}
            <ul className="space-y-3 mb-6">
              {active.pains.map((pain, j) => (
                <li key={j} className="flex items-start gap-3 text-[13px] md:text-[14px] font-body text-slate-600 leading-relaxed">
                  <span className="text-red-400 flex-shrink-0 mt-0.5">⚠️</span>
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
                {active.solution}
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-heading font-semibold text-[14px] transition-colors duration-200"
            >
              {active.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

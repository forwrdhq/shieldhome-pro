'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQSectionProps {
  faqs?: { q: string; a: string }[]
  title?: string
  subtitle?: string
  darkMode?: boolean
}

const defaultFaqs = [
  {
    q: 'How much does a Vivint system cost?',
    a: "Every home is different, so we give free custom quotes. Most homeowners pay $0 upfront for equipment with free expert setup. Monthly monitoring starts around $1.33/day (about $39.99/month). Your Smart Home Pro will build a package based on your home's size and needs — so you only pay for what you need.",
  },
  {
    q: 'Is expert setup really free?',
    a: "Yes — 100% free. Vivint sends a certified tech to your home at no charge. They'll set up all equipment, connect everything to your WiFi, set up your app, and walk you through how it all works. Most setups take 2-4 hours. No hidden fees.",
  },
  {
    q: 'Do I need a landline or internet?',
    a: "No landline needed. Vivint systems use a built-in cell connection, so your system stays connected even if your WiFi goes down. WiFi is used for camera streaming and smart home features, but the core security works over cellular. This is more reliable than old landline systems.",
  },
  {
    q: "What's the contract length?",
    a: "Vivint offers plans from month-to-month to multi-year. Longer plans often come with better equipment pricing and promos (like the free doorbell camera). Your Smart Home Pro will walk you through all options so you can pick what works best for your budget.",
  },
  {
    q: 'Can I keep my smart home devices?',
    a: "Usually, yes. Vivint works with Google Assistant, Amazon Alexa, Philips Hue, Kwikset locks, Nest thermostats, and many other popular devices. Your tech can connect them during setup. If you have an existing security system, Vivint can often use existing wiring.",
  },
  {
    q: 'What if the power goes out?',
    a: "Vivint systems have battery backup that keeps security running during outages — usually 24+ hours. Since the system uses cell signal (not just WiFi), monitoring continues even if your internet goes down. You'll get a phone alert if power is lost.",
  },
  {
    q: 'What if I move?',
    a: "Vivint makes moving easy. They'll send a pro to take down your equipment and set it up at your new home. Many customers use this as a chance to upgrade or add new equipment too.",
  },
  {
    q: 'Is ShieldHome Pro the same as Vivint?',
    a: "ShieldHome Pro is an authorized dealer of Vivint Smart Home. We help homeowners get set up with Vivint's #1-rated security system. Once your system is set up, you're a full Vivint customer with 24/7 monitoring, support, the app, and all warranties.",
  },
]

export default function FAQSection({ faqs, title, subtitle, darkMode }: FAQSectionProps = {}) {
  const [open, setOpen] = useState<number | null>(null)
  const items = faqs || defaultFaqs

  if (darkMode) {
    return (
      <section className="py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-[22px] md:text-[28px] font-extrabold text-white tracking-tight">
              {title || 'Common Questions'}
            </h2>
          </div>
          <div className="space-y-2">
            {items.map((faq, i) => (
              <div key={i} className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="font-semibold text-white/80 pr-4 text-[14px]">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'text-white/30 flex-shrink-0 transition-transform duration-200',
                      open === i && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    open === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="px-5 pb-5 text-white/55 leading-relaxed text-[13px]">
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

  return (
    <section className="py-16 bg-[#F8F9FA]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
            {title || 'Common Questions'}
          </h2>
          <p className="text-gray-600">{subtitle || 'Everything you need to know before getting started'}</p>
        </div>
        <div className="space-y-3">
          {items.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
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
                id={`faq-answer-${i}`}
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

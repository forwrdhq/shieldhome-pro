'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
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
        <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="text-center mb-10">
            <h2 className="text-h3 text-white">
              {title || 'Common Questions'}
            </h2>
          </div>
          <div className="divide-y divide-slate-700/50">
            {items.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                  aria-expanded={open === i}
                  aria-controls={`faq-dark-${i}`}
                >
                  <span className="text-body-sm font-heading font-semibold text-slate-300 pr-4 group-hover:text-white transition-colors duration-150">{faq.q}</span>
                  {open === i
                    ? <Minus size={18} className="text-slate-400 flex-shrink-0" />
                    : <Plus size={18} className="text-slate-500 flex-shrink-0" />
                  }
                </button>
                <div
                  id={`faq-dark-${i}`}
                  role="region"
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    open === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <div className="pb-5 text-body-sm text-slate-500 leading-relaxed">
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
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-12" data-animate>
          <h2 className="text-h2 text-slate-900 mb-3">
            {title || 'Common Questions'}
          </h2>
          <p className="text-body text-slate-500">{subtitle || 'Everything you need to know before getting started'}</p>
        </div>

        <div className="divide-y divide-slate-100" data-animate>
          {items.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="text-h4 text-slate-900 pr-4">{faq.q}</span>
                {open === i
                  ? <Minus size={20} className="text-slate-900 flex-shrink-0" />
                  : <Plus size={20} className="text-slate-400 flex-shrink-0" />
                }
              </button>
              <div
                id={`faq-answer-${i}`}
                role="region"
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

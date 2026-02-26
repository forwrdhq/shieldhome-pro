'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'How much does a Vivint system cost?',
    a: "Every home is different, which is why we provide free custom quotes. Most homeowners pay $0 upfront for equipment with professional installation included. Monthly monitoring starts at around $1.33/day (roughly $39.99/month). Your Smart Home Pro will design a package based on your home's size, entry points, and the features you want — so you only pay for what you need.",
  },
  {
    q: 'Is professional installation really free?',
    a: "Yes — 100% free. Vivint sends a certified Smart Home Pro technician to your home at no charge. They'll install all equipment, run wiring where needed, connect everything to your WiFi, set up your mobile app, and walk you through how to use the entire system. Most installations are completed in 2-4 hours. There are no hidden installation fees.",
  },
  {
    q: 'Do I need a landline or internet connection?',
    a: "No landline is needed. Vivint systems use a built-in cellular connection as the primary communication method, so your system stays connected even if your WiFi goes down. WiFi is used for camera streaming and smart home features, but the core security monitoring works over cellular. This is more reliable than traditional landline systems.",
  },
  {
    q: "What's the contract length?",
    a: "Vivint typically offers service agreements ranging from month-to-month to multi-year plans. Longer agreements often come with better equipment pricing and promotions (like the free doorbell camera). Your Smart Home Pro will walk you through all available options and pricing during your free consultation so you can choose what works best for your budget.",
  },
  {
    q: 'Can I keep my existing smart home devices?',
    a: "In most cases, yes. Vivint integrates with Google Assistant, Amazon Alexa, Philips Hue, Kwikset smart locks, Nest thermostats, and many other popular smart home devices. Your technician can connect compatible devices during installation. If you have an existing security system from another provider, Vivint can often use existing sensor wiring to minimize new hardware.",
  },
  {
    q: 'What happens if my system loses power or internet?',
    a: "Vivint systems have a built-in battery backup that keeps your security system running during power outages — typically for 24+ hours. Since the system uses cellular communication (not just WiFi), monitoring continues even if your internet goes down. You'll receive a notification on your phone if power is lost so you're always aware.",
  },
  {
    q: "What if I move to a new home?",
    a: "Vivint makes moving easy. Contact their support team and they'll schedule a professional to uninstall your equipment at your current home and reinstall it at your new one. They'll also help you update your monitoring address. Many customers find this is a great time to upgrade or add new equipment as well.",
  },
  {
    q: 'Is ShieldHome Pro the same as Vivint?',
    a: "ShieldHome Pro is an independently operated authorized dealer of Vivint Smart Home products and services. We help homeowners get set up with Vivint's #1-rated smart home security system. Once your system is installed, you're a full Vivint customer with access to their 24/7 monitoring, customer support, app, and all service warranties.",
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16 bg-[#F8F9FA]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">Everything you need to know before getting started</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
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
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">
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

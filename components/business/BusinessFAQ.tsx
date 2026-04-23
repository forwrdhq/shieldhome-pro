'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'Does Vivint actually charge businesses the same as homes?',
    answer: 'Equipment and installation are identical — same 4K cameras, smart locks, and AI hardware used in residential installs. Business monitoring starts at $39.99/mo, comparable to residential Smart Home plans. There is no commercial surcharge on hardware the way ADT structures their business pricing. ADT\'s business monitoring floors at $49.99/mo for the same system.',
  },
  {
    question: "What's the 30-Day Guarantee exactly?",
    answer: "Simple and unconditional. If you're not completely satisfied within 30 days of installation — for any reason — we'll send a certified technician back out, adjust the system to your exact needs, or refund your first month's monitoring fee. No conditions. No arguments.",
  },
  {
    question: "I'm locked into a contract with my current provider. Now what?",
    answer: "We cover contract buyouts up to $1,000 regardless of your current provider. Your ShieldHome Pro will assess your exact situation on the audit call. In most cases, the monitoring savings plus the buyout means you're financially ahead from Month 1. For contracts with more than $1,000 remaining, we'll calculate whether switching still makes sense — and we'll be honest if it doesn't.",
  },
  {
    question: 'I have multiple locations. Can you handle that?',
    answer: 'Yes. Vivint supports multiple locations under one account and one app. Your ShieldHome Pro will quote each location individually. Multi-location customers typically see larger total savings because the commercial markup compounds across every site. We focus on businesses with 1–10 locations.',
  },
  {
    question: "Is installation actually free — what's the catch?",
    answer: "100% free installation by a certified Vivint technician. The arrangement is that you become a Vivint monitoring customer — the free installation is tied to the monitoring plan. Your ShieldHome Pro will be completely transparent about the full cost structure on the audit call. No surprises, no hidden fees.",
  },
  {
    question: 'Will this qualify me for a business insurance discount?',
    answer: 'In almost every case, yes. Professionally monitored security systems typically qualify for 5–20% discounts on commercial property insurance premiums. We provide the documentation your carrier needs. Most business owners save $500–$2,000/year. Ask your ShieldHome Pro about your specific carrier on the call.',
  },
  {
    question: 'What are the contract options?',
    answer: "Monitoring agreements range from month-to-month to multi-year. Longer plans include better equipment promotions and pricing. Your ShieldHome Pro will walk you through what makes financial sense for your specific situation — no pressure to commit to any term.",
  },
  {
    question: 'How is ShieldHome different from calling Vivint directly?',
    answer: "ShieldHome Pro works directly with Vivint Smart Home professionals to bring you exclusive promotions — like the current free AI camera upgrade and $1,000 contract buyout — that aren't always available direct. You're still a full Vivint customer with all warranties, monitoring, and support. We just get you better entry-point deals.",
  },
  {
    question: 'What if something malfunctions after installation?',
    answer: "Two layers of protection. Our 30-Day Satisfaction Guarantee covers the first month completely. After that, Vivint's lifetime equipment warranty covers hardware failures with remote diagnostics and on-site technician dispatch when needed. ShieldHome customers also have a direct line to our team for the lifetime of their account.",
  },
  {
    question: 'How long does installation take?',
    answer: 'Typically 24–48 hours from quote to fully installed system. Single-location businesses are usually complete in half a day (2–3 hours on-site). Multi-location businesses: we stagger installations to minimize disruption.',
  },
  {
    question: 'Does it work with my compliance or insurance requirements?',
    answer: "For most businesses — yes. Vivint generates the documentation most carriers require: 24/7 monitored alarm certificate, access control logs with timestamps, and video retention records. For highly specific requirements (certain HIPAA configurations, state-specific mandates), your Business Pro will confirm compatibility on the call. We don't guess on compliance.",
  },
  {
    question: "I'm already a Vivint customer. Can I upgrade?",
    answer: 'Yes — and this is often the fastest path. If you have Vivint residential, adding a business account or upgrading existing equipment is streamlined. Call us at (801) 348-6050 and ask about the business upgrade path.',
  },
]

export default function BusinessFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const headingRef = useScrollReveal<HTMLDivElement>()

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-5 md:px-12">
        <div ref={headingRef} className="text-center mb-10 md:mb-12">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
            Common Questions
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900">
            Questions We Get From Business Owners Before They Switch
          </h2>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={faq.question}
                className={`border rounded-xl transition-all duration-300 ${isOpen ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 md:p-5 text-left"
                >
                  <h3 className="font-heading font-semibold text-[14px] md:text-[15px] text-slate-800 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-4 md:px-5 pb-4 md:pb-5 text-[13px] md:text-[14px] font-body text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

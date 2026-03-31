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
    answer: 'Yes. Equipment and installation are identical — same 4K cameras, same smart locks, same AI hardware. Business monitoring starts at $39.99/mo, comparable to residential Smart Home plans. There is no commercial surcharge on hardware the way ADT structures their business pricing.',
  },
  {
    question: "What's your 30-Day Guarantee exactly?",
    answer: "Simple and unconditional. If you're not completely satisfied within 30 days of installation — for any reason — we'll send a technician back out, adjust the system to your needs, or refund your first month's monitoring fee. No arguments. No conditions.",
  },
  {
    question: "I'm locked into a contract with my current provider. What happens?",
    answer: "We cover contract buyouts up to $1,000 regardless of your current provider. Your ShieldHome Pro will assess your exact situation on the quote call. In most cases, the monitoring savings plus the buyout means you're financially ahead from Month 1.",
  },
  {
    question: 'I have multiple locations. Can you manage that?',
    answer: 'Yes. Vivint supports multiple locations under one account and one app. Your ShieldHome Pro will quote each location individually. Multi-location customers typically see larger total savings because the markup compounds across every site.',
  },
  {
    question: "Is installation actually free — what's the catch?",
    answer: "100% free. Certified Vivint technician. No hidden fees. The arrangement is that you become a Vivint monitoring customer — the free installation is tied to the monitoring plan. Your ShieldHome Pro will be completely transparent about the full cost structure on the call. No surprises.",
  },
  {
    question: 'Will this qualify me for an insurance discount?',
    answer: 'In almost every case, yes. We provide the documentation your carrier needs to apply the monitored security discount — typically 5–20% on your annual premium. Most business owners save $500–$2,000/yr. Ask us on the quote call about your specific carrier.',
  },
  {
    question: 'What are the contract options?',
    answer: "Month-to-month through to multi-year. Longer plans include better equipment promotions. No pressure to commit to any term — your ShieldHome Pro will walk you through what makes financial sense for your specific situation.",
  },
  {
    question: 'How is ShieldHome different from calling Vivint directly?',
    answer: "ShieldHome Pro is an authorised Vivint dealer with exclusive promotions — like the current free AI camera upgrade — that aren't always available direct. You're still a full Vivint customer with all warranties, monitoring, and support. We just get you better entry deals.",
  },
  {
    question: 'What if something malfunctions after installation?',
    answer: "All Vivint equipment carries a manufacturer warranty. Vivint's monitoring centre also runs remote diagnostics. If something needs an on-site fix, a technician is dispatched. ShieldHome customers have a direct line to our team for the lifetime of the account.",
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

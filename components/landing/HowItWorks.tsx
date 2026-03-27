'use client'

import { ClipboardList, Phone, Wrench } from 'lucide-react'
import { ReactNode } from 'react'
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal'

interface StepData {
  icon: ReactNode
  title: string
  description: string
}

interface HowItWorksProps {
  steps?: StepData[]
  title?: string
  subtitle?: string
  footer?: string
}

const defaultSteps: StepData[] = [
  {
    icon: <ClipboardList size={24} />,
    title: 'Take the 60-Second Quiz',
    description: 'Answer a few quick questions about your home so we can build the right security system for you.',
  },
  {
    icon: <Phone size={24} />,
    title: 'Get Your Free Quote',
    description: 'A Vivint Smart Home Pro will call you with a custom quote — no pressure, no obligation.',
  },
  {
    icon: <Wrench size={24} />,
    title: 'Free Expert Setup',
    description: 'Pick a time that works. A Vivint tech sets up your system and walks you through everything.',
  },
]

export default function HowItWorks({ steps, title, subtitle, footer }: HowItWorksProps = {}) {
  const items = steps || defaultSteps
  const headingRef = useScrollReveal<HTMLDivElement>()
  const stepsRef = useStaggerReveal<HTMLDivElement>(100)
  const footerRef = useScrollReveal<HTMLParagraphElement>()

  return (
    <section id="how-it-works" className="py-14 md:py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16">
        <div ref={headingRef} className="text-center mb-10 md:mb-14">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
            Simple Process
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900 mb-2 md:mb-3">
            {title || 'How It Works'}
          </h2>
          <p className="text-[13px] md:text-[16px] font-body text-slate-400 max-w-md mx-auto">
            {subtitle || 'Get protected in 3 simple steps'}
          </p>
        </div>

        <div ref={stepsRef} className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-slate-200" />

          {items.map((step, i) => (
            <div key={step.title} className="relative text-center bg-white rounded-2xl p-6 md:p-8 border border-slate-100 hover:border-slate-200 transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)]">
              <div className="relative inline-flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mb-3 relative z-10">
                  {step.icon}
                </div>
                <span className="text-[10px] font-heading font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--color-brass-400)' }}>
                  Step {i + 1}
                </span>
              </div>
              <h3 className="font-heading font-bold text-[16px] md:text-[17px] tracking-[-0.015em] text-slate-900 mb-3">{step.title}</h3>
              <p className="text-[14px] font-body text-slate-400 max-w-xs mx-auto leading-[1.6]">{step.description}</p>
            </div>
          ))}
        </div>

        <p ref={footerRef} className="text-center mt-10 text-[14px] font-body text-slate-500 font-medium">
          {footer || <>Most customers are fully protected within <strong className="text-slate-700">24-48 hours</strong></>}
        </p>
      </div>
    </section>
  )
}

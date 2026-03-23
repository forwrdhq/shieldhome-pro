import { ClipboardList, Phone, Wrench } from 'lucide-react'
import { ReactNode } from 'react'

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

  return (
    <section id="how-it-works" className="py-20 bg-slate-100">
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-12" data-animate>
          <h2 className="text-h2 text-slate-900 mb-3">
            {title || 'How It Works'}
          </h2>
          <p className="text-body-lg text-slate-500">{subtitle || 'Get protected in 3 simple steps'}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-slate-300" />

          {items.map((step, i) => (
            <div key={step.title} className="relative text-center" data-animate>
              <div className="relative inline-flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mb-3 relative z-10">
                  {step.icon}
                </div>
                <span className="text-overline text-emerald-600 mb-3">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="text-h4 text-slate-900 mb-3">{step.title}</h3>
              <p className="text-body text-slate-500 max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-body text-slate-500 font-medium" data-animate>
          {footer || <>Most customers are fully protected within <strong className="text-slate-700">24-48 hours</strong></>}
        </p>
      </div>
    </section>
  )
}

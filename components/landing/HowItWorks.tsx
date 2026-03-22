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
    icon: <ClipboardList size={28} />,
    title: 'Take the 60-Second Quiz',
    description: 'Answer a few quick questions about your home so we can build the right security system for you.',
  },
  {
    icon: <Phone size={28} />,
    title: 'Get Your Free Quote',
    description: 'A Vivint Smart Home Pro will call you with a custom quote — no pressure, no obligation.',
  },
  {
    icon: <Wrench size={28} />,
    title: 'Free Expert Setup',
    description: 'Pick a time that works. A Vivint tech sets up your system and walks you through everything.',
  },
]

export default function HowItWorks({ steps, title, subtitle, footer }: HowItWorksProps = {}) {
  const items = steps || defaultSteps

  return (
    <section className="py-16 bg-[#F8F9FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
            {title || 'How It Works'}
          </h2>
          <p className="text-gray-600 text-lg">{subtitle || 'Get protected in 3 simple steps'}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gray-200" />

          {items.map((step, i) => (
            <div key={step.title} className="relative text-center">
              <div className="relative inline-flex flex-col items-center">
                <div className="w-16 h-16 bg-[#00C853] text-white rounded-full flex items-center justify-center mb-2 shadow-lg relative z-10">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-[#00C853] uppercase tracking-widest mb-3">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-gray-600 font-medium">
          {footer || <>Most customers are fully protected within <strong>24-48 hours</strong></>}
        </p>
      </div>
    </section>
  )
}

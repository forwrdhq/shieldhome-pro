'use client'

import { DollarSign, FileText, Wrench, Truck, ShieldCheck } from 'lucide-react'

const objections = [
  {
    icon: <DollarSign size={24} />,
    question: 'Is it too expensive?',
    answer: "$0 down. That's about $1.33/day — less than your morning coffee. Free setup and a free doorbell camera are included.",
  },
  {
    icon: <FileText size={24} />,
    question: 'What about contracts?',
    answer: 'Flexible plans available. Month-to-month or multi-year — you pick what fits your budget. Your pro walks you through every option.',
  },
  {
    icon: <Wrench size={24} />,
    question: 'Is setup a hassle?',
    answer: "A certified pro handles everything — free. Most homes are done in 2-3 hours. You don't lift a finger.",
  },
  {
    icon: <Truck size={24} />,
    question: 'What if I move?',
    answer: 'Vivint moves with you. A pro will take down your system and set it back up at your new home.',
  },
]

interface ObjectionCrusherProps {
  onQuizOpen: () => void
}

export default function ObjectionCrusher({ onQuizOpen }: ObjectionCrusherProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
            Still on the Fence? We Get It.
          </h2>
          <p className="text-gray-600 text-lg">
            Here are the most common questions — and straight answers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {objections.map((obj) => (
            <div
              key={obj.question}
              className="bg-[#F8F9FA] rounded-xl p-6 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#00C853]/10 rounded-full flex items-center justify-center text-[#00C853] flex-shrink-0">
                  {obj.icon}
                </div>
                <h3 className="font-bold text-[#1A1A2E] text-lg">{obj.question}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pl-[52px]">
                {obj.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm mb-5">
            <ShieldCheck size={18} className="text-[#00C853]" />
            <span>100% free consultation — no obligation, no pressure</span>
          </div>
          <div>
            <button
              onClick={onQuizOpen}
              className="bg-[#00C853] hover:bg-[#00A846] text-white px-10 py-4 rounded-xl font-bold text-lg transition-colors"
            >
              Get My Free Quote — No Strings Attached
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

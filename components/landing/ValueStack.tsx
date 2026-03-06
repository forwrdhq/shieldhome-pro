'use client'

import { CheckCircle, Gift, ArrowRight } from 'lucide-react'

const items = [
  { name: 'Vivint Smart Home System', value: '$599' },
  { name: 'Professional Installation', value: '$199' },
  { name: 'Indoor Camera Pro', value: '$199' },
  { name: 'Smart Doorbell Camera', value: '$249', bonus: true },
  { name: '24/7 Monitoring Setup', value: '$99' },
]

const TOTAL_VALUE = '$1,345'

interface ValueStackProps {
  onQuizOpen: () => void
}

export default function ValueStack({ onQuizOpen }: ValueStackProps) {
  return (
    <section className="py-16 bg-[#F8F9FA]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#00C853]/10 text-[#00C853] px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <Gift size={16} />
            Limited Time Offer
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
            Here&apos;s Everything You Get — Free
          </h2>
          <p className="text-gray-600 text-lg">
            No hidden fees. No catch. Just smart home security done right.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Line items */}
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.name} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-[#00C853] flex-shrink-0" />
                  <span className="font-medium text-gray-900">{item.name}</span>
                  {item.bonus && (
                    <span className="text-xs bg-[#00C853] text-white px-2 py-0.5 rounded-full font-bold">
                      FREE BONUS
                    </span>
                  )}
                </div>
                <span className="text-gray-400 line-through font-medium">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Total + reveal */}
          <div className="bg-[#1A1A2E] px-6 py-8 text-center">
            <div className="mb-4">
              <span className="text-gray-400 text-sm">Total Value:</span>
              <span className="text-white text-3xl font-extrabold line-through ml-3 opacity-60">
                {TOTAL_VALUE}
              </span>
            </div>
            <div className="mb-2">
              <span className="text-gray-300 text-sm">Your Price Today:</span>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-1">
              $0 Down
            </div>
            <div className="text-[#00C853] text-lg font-bold mb-6">
              + Professional monitoring from just $19.95/mo
            </div>
            <div className="inline-flex items-center gap-2 bg-[#00C853]/20 text-[#00C853] px-4 py-2 rounded-full text-sm font-bold mb-6">
              You save {TOTAL_VALUE}+
            </div>
            <div>
              <button
                onClick={onQuizOpen}
                className="bg-[#00C853] hover:bg-[#00A846] text-white px-10 py-4 rounded-xl font-bold text-lg transition-colors inline-flex items-center gap-2"
              >
                Claim My Free System
                <ArrowRight size={20} />
              </button>
              <p className="text-gray-400 text-xs mt-3">
                No credit card needed. Takes 60 seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

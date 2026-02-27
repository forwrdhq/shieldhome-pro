'use client'

import { Phone } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

export default function StickyPhoneCTA() {
  return (
    <>
      {/* Desktop sticky header phone */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-[#1A1A2E] border-t border-gray-700 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6">
          <p className="text-white text-sm">Questions? Our Smart Home Pros are standing by.</p>
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            className="flex items-center gap-2 bg-[#00C853] hover:bg-[#00A846] text-white px-6 py-2 rounded-lg font-bold transition-colors"
          >
            <Phone size={18} />
            {PHONE_NUMBER}
          </a>
        </div>
      </div>

      {/* Mobile floating CTA */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <a
          href={`tel:${PHONE_NUMBER_RAW}`}
          className="flex items-center gap-2 bg-[#00C853] text-white px-5 py-3 rounded-full font-bold shadow-2xl hover:bg-[#00A846] transition-colors"
        >
          <Phone size={20} />
          Call/Text Now
        </a>
      </div>
    </>
  )
}

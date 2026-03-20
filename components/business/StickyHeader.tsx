'use client'

import { Shield, Phone } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

export default function StickyHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 py-3 px-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="text-[#00C853]" size={28} />
          <div>
            <span className="font-bold text-[#1A1A2E] text-lg">ShieldHome Pro</span>
            <span className="hidden sm:block text-xs text-gray-500">Authorized Vivint Commercial Security Dealer</span>
          </div>
        </div>
        <a
          href={`tel:${PHONE_NUMBER_RAW}`}
          className="flex items-center gap-2 bg-[#00C853] hover:bg-[#00A846] text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          <Phone size={16} />
          <span className="hidden sm:inline">{PHONE_NUMBER}</span>
          <span className="sm:hidden">Call Now</span>
        </a>
      </div>
    </header>
  )
}

'use client'

import { Phone } from 'lucide-react'

const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER || '(877) 555-0199'
const PHONE_RAW = process.env.NEXT_PUBLIC_PHONE_NUMBER_RAW || '+18775550199'

export default function StickyHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: '#00C853' }}
            >
              S
            </div>
            <div>
              <span className="font-bold text-[#1A1A2E] text-lg leading-none">ShieldHome</span>
              <span className="font-bold text-[#00C853] text-lg leading-none">.pro</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">Authorized Vivint Commercial Security Dealer</p>
        </div>

        <a
          href={`tel:${PHONE_RAW}`}
          onClick={() => {
            if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
              (window as any).fbq('track', 'Contact', { content_name: 'b2b_phone_header' })
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold text-sm transition-colors"
          style={{ background: '#00C853' }}
        >
          <Phone className="w-4 h-4" />
          <span>{PHONE}</span>
        </a>
      </div>
    </header>
  )
}

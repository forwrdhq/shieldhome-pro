'use client'

import Link from 'next/link'
import { Phone } from 'lucide-react'
import { pushDataLayer } from '@/lib/google-tracking'

export default function BusinessNav() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 py-3 px-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-0.5 font-heading font-bold text-[18px] tracking-[-0.02em]">
          <span className="text-slate-900">Shield</span>
          <span style={{ color: '#00C853' }}>Home</span>
        </Link>

        <a
          href="tel:+18016166301"
          onClick={() => pushDataLayer('phone_call_click', { location: 'business_nav' })}
          className="flex items-center gap-2 font-heading font-bold text-[15px] md:text-[17px]"
          style={{ color: '#00C853' }}
        >
          <Phone className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">(801) 616-6301</span>
          <span className="sm:hidden">Call Now</span>
        </a>
      </div>
    </nav>
  )
}

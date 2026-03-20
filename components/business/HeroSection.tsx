'use client'

import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

export default function HeroSection() {
  return (
    <section className="bg-[#1A1A2E] py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
          Smart Commercial Security<br className="hidden sm:block" /> at Residential Rates
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Most businesses overpay by 30–40% for outdated monitoring. Get a free security assessment and see exactly how much you could save.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="#lead-form"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-[#00C853] hover:bg-[#00A846] text-white font-semibold text-lg px-8 py-4 rounded-lg transition-colors"
          >
            Get Your Free Security Assessment &rarr;
          </a>
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-[#1A1A2E] font-semibold text-lg px-8 py-4 rounded-lg transition-colors"
          >
            Call Now: {PHONE_NUMBER}
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm text-gray-300">
          <span className="flex items-center gap-1.5">
            <span className="text-lg">&#9889;</span> 8-Second Response Time
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-lg">&#127482;&#127480;</span> Nationwide Installation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-lg">&#9989;</span> No Contract Required
          </span>
        </div>
      </div>
    </section>
  )
}

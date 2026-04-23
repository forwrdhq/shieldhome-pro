'use client'

import Image from 'next/image'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface GuaranteeSectionProps {
  onQuizOpen?: () => void
}

export default function GuaranteeSection({ onQuizOpen }: GuaranteeSectionProps) {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section className="py-14 md:py-20 bg-slate-900 relative overflow-hidden">
      {/* Subtle warm radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(180, 130, 60, 0.04)' }} />

      <div ref={ref} className="max-w-5xl mx-auto px-4 md:px-8 relative">
        <div className="text-center mb-8 md:mb-14">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-4" style={{ color: 'var(--color-brass-300)' }}>
            Our Promise
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-white">
            The Protected Home Promise
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/40 hover:border-slate-600/40 transition-all duration-500">
            <h3 className="text-white font-heading font-semibold text-[17px] tracking-[-0.015em] mb-3">
              Price Lock Guarantee
            </h3>
            <p className="text-[15px] font-body text-slate-400 leading-[1.7]">
              Your monthly monitoring rate is locked for the life of your contract. No surprise rate hikes, ever.
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/40 hover:border-slate-600/40 transition-all duration-500">
            <h3 className="text-white font-heading font-semibold text-[17px] tracking-[-0.015em] mb-3">
              Break-In Deductible Coverage
            </h3>
            <p className="text-[15px] font-body text-slate-400 leading-[1.7]">
              If someone breaks in while your system is armed, we cover up to $500 of your insurance deductible.
            </p>
          </div>
        </div>

        {/* Product image row */}
        <div className="flex justify-center gap-6 md:gap-10 mb-12 opacity-60">
          {[
            { src: '/images/products/outdoor-camera-pro.png', alt: 'Outdoor camera', w: 80 },
            { src: '/images/products/doorbell-camera-pro.png', alt: 'Doorbell camera', w: 60 },
            { src: '/images/products/smart-lock.png', alt: 'Smart lock', w: 70 },
            { src: '/images/products/smart-hub.png', alt: 'Smart hub', w: 70 },
          ].map((img) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={img.w}
              height={img.w}
              className="h-16 md:h-20 w-auto object-contain"
            />
          ))}
        </div>

        <div className="text-center">
          {onQuizOpen ? (
            <button
              onClick={onQuizOpen}
              className="inline-flex items-center justify-center text-white px-8 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
              style={{ backgroundColor: 'var(--color-emerald-600)' }}
            >
              Get Protected Today
            </button>
          ) : (
            <a
              href="#quiz"
              className="inline-flex items-center justify-center text-white px-8 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
              style={{ backgroundColor: 'var(--color-emerald-600)' }}
            >
              Get Protected Today
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

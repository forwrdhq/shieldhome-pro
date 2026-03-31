'use client'

import Image from 'next/image'
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal'

const features = [
  {
    image: '/images/google/products/outdoor-camera-pro.png',
    title: 'Most cameras film the crime. This one prevents it.',
    body: "AI Smart Deter identifies a loitering threat and activates a spotlight + 85dB siren before anyone enters the building. Criminals move on. Your business stays intact. Insurance carriers love the documentation.",
  },
  {
    image: '/images/google/products/indoor-camera-pro.png',
    title: 'Police dispatched before your alarm stops ringing.',
    body: "Vivint's in-house monitoring centre responds in 8 seconds — not 60 like the industry average. That 52-second gap is where break-ins are completed. Ours aren't.",
  },
  {
    image: '/images/products/smart-lock.png',
    title: 'Someone quits on Friday. Their access is gone by Friday.',
    body: 'Per-employee smart lock codes you grant or revoke instantly from your phone. Text alert every time any code is used. No locksmith. No waiting. No wondering.',
  },
  {
    image: '/images/products/smart-home-app.png',
    title: 'Other providers need 3 apps. ShieldHome does it in one.',
    body: "Arm, disarm, watch live feeds, lock doors, review footage — one app. No platform-juggling. No gaps. This is the number one complaint from every business customer switching to Vivint.",
  },
]

export default function BusinessFeatures() {
  const headingRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useStaggerReveal<HTMLDivElement>(100)

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-5 md:px-12">
        <div ref={headingRef} className="text-center mb-10 md:mb-14">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
            Why ShieldHome Pro
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900">
            The Security System That Stops Crime — Not Just Records It
          </h2>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 gap-5 md:gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)] transition-all duration-500"
            >
              {/* Product Image */}
              <div className="relative h-44 md:h-52 bg-slate-900 overflow-hidden">
                <Image
                  src={feat.image}
                  alt={feat.title}
                  fill
                  className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="font-heading font-bold text-[15px] md:text-[17px] text-slate-900 mb-2.5 tracking-[-0.01em]">
                  {feat.title}
                </h3>
                <p className="text-[13px] md:text-[14px] font-body text-slate-500 leading-relaxed">
                  {feat.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

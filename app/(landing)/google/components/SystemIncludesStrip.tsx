'use client'

import Image from 'next/image'
import { useScrollReveal } from './useScrollReveal'

const items = [
  { src: '/images/google/system/smart-hub.png', label: 'Smart Hub' },
  { src: '/images/google/system/door-window-sensor.png', label: 'Door & Window Sensor' },
  { src: '/images/google/system/motion-sensor.png', label: 'Motion Sensor' },
  { src: '/images/google/system/vivint-app.png', label: 'Vivint App' },
  { src: '/images/google/system/monitoring.png', label: '24/7 Monitoring' },
  { src: '/images/google/system/installation.png', label: 'Pro Installation' },
]

export default function SystemIncludesStrip() {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <section className="py-10 md:py-14 bg-slate-50 border-y border-slate-100">
      <div ref={ref} className="max-w-5xl mx-auto px-5 md:px-8">
        <p className="text-center font-heading font-semibold text-[13px] md:text-[15px] tracking-[-0.01em] text-slate-700 mb-6 md:mb-8">
          All Systems Include
        </p>

        {/* Desktop: centered row */}
        <div className="hidden md:flex items-center justify-center gap-10">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2.5 group">
              <div className="w-16 h-16 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <Image
                  src={item.src}
                  alt={item.label}
                  width={64}
                  height={64}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <p className="text-[11px] font-body text-slate-500 text-center leading-tight whitespace-nowrap">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: horizontally scrollable */}
        <div className="md:hidden overflow-x-auto -mx-5 px-5 scrollbar-hide">
          <div className="flex items-center gap-6 min-w-max">
            {items.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Image
                    src={item.src}
                    alt={item.label}
                    width={48}
                    height={48}
                    className="w-11 h-11 object-contain"
                  />
                </div>
                <p className="text-[10px] font-body text-slate-500 text-center leading-tight whitespace-nowrap">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

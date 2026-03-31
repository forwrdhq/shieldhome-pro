import Image from 'next/image'
import { Shield, Wifi, Smartphone, Camera } from 'lucide-react'

const features = [
  { icon: Camera, label: '4K HDR Cameras', sub: 'AI Smart Deter' },
  { icon: Shield, label: '8-Second Response', sub: 'In-house monitoring' },
  { icon: Smartphone, label: 'One App', sub: 'Full system control' },
  { icon: Wifi, label: 'Always Connected', sub: 'Cellular + Wi-Fi backup' },
]

export default function ProductShowcase() {
  return (
    <section className="bg-slate-950 py-14 md:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 md:px-12">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] text-emerald-400/70 mb-3">
            Vivint Commercial System
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[36px] tracking-[-0.03em] text-white">
            Enterprise-Grade Hardware. Zero Commercial Markup.
          </h2>
        </div>

        {/* Hero product image */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/[0.06] mb-8 md:mb-10">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/60 z-10" />
          <Image
            src="/images/google/vivint-products-hero-wide.jpg"
            alt="Vivint AI-powered business security system — cameras, smart locks, and monitoring hub"
            width={1200}
            height={500}
            className="w-full h-[220px] md:h-[420px] object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          {/* Overlay label */}
          <div className="absolute bottom-4 left-5 md:bottom-6 md:left-8 z-20">
            <p className="text-[11px] md:text-[12px] font-heading font-semibold uppercase tracking-[0.14em] text-emerald-400 mb-1">
              Vivint AI Security
            </p>
            <p className="text-[18px] md:text-[28px] font-heading font-bold text-white tracking-[-0.02em]">
              The same system. No commercial surcharge.
            </p>
          </div>
        </div>

        {/* Feature strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {features.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-4 md:py-5 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[13px] md:text-[14px] font-heading font-semibold text-white leading-tight">{label}</p>
                <p className="text-[11px] font-body text-slate-500 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

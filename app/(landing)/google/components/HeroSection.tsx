import Image from 'next/image'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import GoogleLeadForm from './GoogleLeadForm'

interface HeroSectionProps {
  headline: string
  preHeadline?: string
  subheadline?: string
}

export default function HeroSection({
  headline,
  preHeadline = "Exclusive Deals From a Top Vivint Authorized Partner",
  subheadline = "Vivint's AI-powered cameras don't just record — they deter intruders with spotlights, sirens, and live 2-way audio. As a top Vivint partner, we get you exclusive deals on the most advanced system available. Free professional installation nationwide.",
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      {/* ── Desktop: Product image — full right side, no obstruction ── */}
      <div className="hidden md:block absolute top-0 right-0 bottom-0 w-[50%] pointer-events-none">
        <Image
          src="/images/google/vivint-products-hero.jpg"
          alt=""
          fill
          priority
          className="object-contain object-right"
          sizes="50vw"
        />
        <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-r from-slate-900 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/60 to-transparent" />
      </div>

      {/* ══════════════════════════════════════════
          MOBILE — world-class, tight, conversion-first
          ══════════════════════════════════════════ */}
      <div className="md:hidden relative">
        {/* Content area */}
        <div className="pt-11 pb-3 px-5">
          {/* Logo */}
          <div className="mb-3">
            <span className="text-white font-heading font-bold text-[15px] tracking-[-0.01em]">
              Shield<span className="text-emerald-400">Home</span>
            </span>
          </div>

          {/* Pre-headline */}
          <p className="text-[9px] font-heading font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--color-brass-300)' }}>
            {preHeadline}
          </p>

          {/* Headline — large, confident */}
          <h1 className="text-white font-heading font-bold text-[24px] leading-[1.15] tracking-[-0.025em] mb-2">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="text-slate-400 text-[13px] leading-[1.5] mb-4 font-body max-w-[300px]">
            Cameras that fight back — with spotlights, sirens, and live audio. Exclusive deals + free installation nationwide.
          </p>

          {/* Form */}
          <GoogleLeadForm />

          {/* Click-to-call */}
          <div className="text-center mt-2">
            <a
              href={`tel:${PHONE_NUMBER_RAW}`}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-[11px] font-body transition-colors duration-300"
            >
              Or call {PHONE_NUMBER}
            </a>
          </div>
        </div>

        {/* Product image — full bleed, seamless transition */}
        <div className="relative mt-3">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-900 to-transparent z-10 pointer-events-none" />
          <Image
            src="/images/google/vivint-products-hero.jpg"
            alt="Vivint smart home security products — cameras, doorbell, smart lock, thermostat, and hub"
            width={800}
            height={500}
            className="w-full h-auto"
            sizes="100vw"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP — text+form left, product image right
          ══════════════════════════════════════════ */}
      <div className="hidden md:block relative">
        <div className="max-w-6xl mx-auto px-8 pt-16 pb-20">
          <div className="max-w-[480px]">
            {/* Logo */}
            <div className="mb-6">
              <span className="text-white font-heading font-bold text-xl tracking-[-0.01em]">
                Shield<span className="text-emerald-400">Home</span>
              </span>
            </div>

            {/* Pre-headline */}
            <p
              className="text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-4"
              style={{ color: 'var(--color-brass-300)' }}
            >
              {preHeadline}
            </p>

            {/* Headline */}
            <h1 className="text-white font-heading font-bold text-[40px] leading-[1.1] tracking-[-0.03em] mb-4">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="text-slate-400 text-[15px] leading-[1.6] mb-6 font-body">
              {subheadline}
            </p>

            {/* Trust strip */}
            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-body tracking-[0.04em] uppercase mb-6">
              <span className="flex items-center gap-1">
                <span className="text-amber-400 text-sm">&#9733;</span>
                58,000+ reviews
              </span>
              <span className="text-slate-700">|</span>
              <span>BBB A+</span>
              <span className="text-slate-700">|</span>
              <span>2M+ Homes</span>
            </div>

            {/* Form */}
            <div className="mb-4">
              <GoogleLeadForm />
            </div>

            <div className="text-center">
              <a
                href={`tel:${PHONE_NUMBER_RAW}`}
                className="text-slate-500 hover:text-slate-300 text-[13px] font-body transition-colors duration-300"
              >
                Or call {PHONE_NUMBER}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

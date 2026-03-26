import Image from 'next/image'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import SwitchForm from './SwitchForm'

interface SwitchHeroProps {
  headline: string
}

export default function SwitchHero({ headline }: SwitchHeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      {/* ── Desktop: Product image — full right side ── */}
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

      {/* ══════════════════════════
          MOBILE
          ══════════════════════════ */}
      <div className="md:hidden relative">
        <div className="pt-11 pb-3 px-5">
          {/* Logo */}
          <div className="mb-3">
            <span className="text-white font-heading font-bold text-[15px] tracking-[-0.01em]">
              Shield<span className="text-emerald-400">Home</span>
            </span>
          </div>

          {/* Eyebrow */}
          <p className="text-[9px] font-heading font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--color-brass-300)' }}>
            Contract Buyout Program
          </p>

          {/* Headline */}
          <h1 className="text-white font-heading font-bold text-[24px] leading-[1.15] tracking-[-0.025em] mb-2">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="text-slate-400 text-[13px] leading-[1.5] mb-4 font-body max-w-[300px]">
            Switch to Vivint&apos;s AI-powered system. We handle cancellation, installation, and cover up to $1,000.
          </p>

          {/* Form */}
          <SwitchForm />

          {/* Phone link */}
          <div className="mt-3 text-center">
            <a
              href={`tel:${PHONE_NUMBER_RAW}`}
              className="text-slate-400 hover:text-white transition-colors text-[13px] font-body"
            >
              Or call <span className="underline">{PHONE_NUMBER}</span>
            </a>
          </div>
        </div>

        {/* Mobile product image — below form */}
        <div className="relative w-full h-[220px] mt-2">
          <Image
            src="/images/google/vivint-products-hero.jpg"
            alt="Vivint smart home products"
            fill
            priority
            className="object-contain object-center"
            sizes="100vw"
          />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-slate-900 to-transparent" />
        </div>
      </div>

      {/* ══════════════════════════
          DESKTOP
          ══════════════════════════ */}
      <div className="hidden md:block relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12 lg:py-16">
          <div className="max-w-[480px]">
            {/* Logo */}
            <div className="mb-5">
              <span className="text-white font-heading font-bold text-[18px] tracking-[-0.01em]">
                Shield<span className="text-emerald-400">Home</span>
              </span>
            </div>

            {/* Eyebrow */}
            <p className="text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-3" style={{ color: 'var(--color-brass-300)' }}>
              Contract Buyout Program
            </p>

            {/* Headline */}
            <h1 className="text-white font-heading font-bold text-[36px] lg:text-[40px] leading-[1.1] tracking-[-0.03em] mb-4">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="text-slate-400 text-[15px] leading-[1.65] font-body mb-5 max-w-[420px]">
              Switch to Vivint&apos;s #1-rated smart home system with AI-powered cameras and professional installation. <strong className="text-white">We handle your cancellation and cover up to $1,000 in fees.</strong>
            </p>

            {/* Trust strip */}
            <div className="flex items-center gap-4 mb-6 text-[11px] font-body text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B"><path d="M6 0.5L7.38 4.02L11 4.4L8.24 6.86L9.06 10.5L6 8.62L2.94 10.5L3.76 6.86L1 4.4L4.62 4.02L6 0.5Z"/></svg>
                <span className="text-white font-semibold">4.8/5</span> from 58,000+ reviews
              </span>
              <span className="text-slate-600">|</span>
              <span>BBB A+ Rated</span>
              <span className="text-slate-600">|</span>
              <span>2M+ homes</span>
            </div>

            {/* Form */}
            <SwitchForm />

            {/* Phone */}
            <div className="mt-4">
              <a
                href={`tel:${PHONE_NUMBER_RAW}`}
                className="text-slate-400 hover:text-white transition-colors text-[14px] font-body"
              >
                Or call <span className="underline">{PHONE_NUMBER}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

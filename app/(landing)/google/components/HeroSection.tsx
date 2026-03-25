import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import GoogleLeadForm from './GoogleLeadForm'

interface HeroSectionProps {
  headline: string
  preHeadline?: string
  subheadline?: string
}

/* Custom check SVG — consistent 1.5px stroke, squared caps, matches heading weight */
function CheckMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-px">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  )
}

export default function HeroSection({
  headline,
  preHeadline = "Utah's #1 Rated Smart Home Security Dealer",
  subheadline = 'Custom-designed Vivint smart home systems with free professional installation. See your personalized quote in 30 seconds.',
}: HeroSectionProps) {
  return (
    <section className="bg-slate-900 pt-12 pb-4 md:pt-20 md:pb-20 relative overflow-hidden">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative">
        {/* Mobile Layout: stacked */}
        <div className="md:hidden">
          {/* Logo */}
          <div className="mb-1.5">
            <span className="text-white font-heading font-bold text-base tracking-[-0.01em]">
              Shield<span className="text-emerald-400">Home</span>
            </span>
          </div>

          {/* Pre-headline */}
          <p className="text-emerald-400 text-[10px] font-heading font-semibold uppercase tracking-[0.12em] mb-0.5">
            {preHeadline}
          </p>

          {/* Headline */}
          <h1 className="text-white font-heading font-bold text-[20px] leading-[25px] tracking-[-0.02em] mb-1">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="text-slate-400 text-xs leading-snug mb-2.5">
            See your personalized quote in 30 seconds.
          </p>

          {/* Form */}
          <GoogleLeadForm />

          {/* Click-to-call */}
          <div className="text-center mt-2">
            <a
              href={`tel:${PHONE_NUMBER_RAW}`}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs font-body transition-colors duration-300"
            >
              Or call {PHONE_NUMBER}
            </a>
          </div>
        </div>

        {/* Desktop Layout: split */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-12 md:items-start">
          {/* Left side */}
          <div className="col-span-7 pt-2">
            {/* Logo */}
            <div className="mb-8">
              <span className="text-white font-heading font-bold text-xl tracking-[-0.01em]">
                Shield<span className="text-emerald-400">Home</span>
              </span>
            </div>

            {/* Pre-headline */}
            <p className="text-emerald-400 text-[11px] font-heading font-semibold uppercase tracking-[0.14em] mb-4">
              {preHeadline}
            </p>

            {/* Headline — art-directed type */}
            <h1 className="text-white font-heading font-bold text-[42px] leading-[1.1] tracking-[-0.025em] mb-5 max-w-[540px]">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="text-slate-400 text-[17px] leading-[1.6] mb-10 max-w-md font-body">
              {subheadline}
            </p>

            {/* Bullet points — no icons, use custom check + refined type */}
            <div className="space-y-3.5 mb-10">
              {[
                'Same-day or next-day professional installation',
                '$0 down — financing available at 0% APR',
                '60-day money-back guarantee',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-emerald-400">
                  <CheckMark />
                  <span className="text-slate-300 text-[14px] font-body leading-snug">{item}</span>
                </div>
              ))}
            </div>

            {/* Trust badges — understated, typographic */}
            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-body tracking-wide uppercase">
              <span>Vivint Authorized Dealer</span>
              <span className="text-slate-700">—</span>
              <span>BBB A+ Rated</span>
              <span className="text-slate-700">—</span>
              <span>4.8/5 from 58,000+ reviews</span>
            </div>
          </div>

          {/* Right side — Form Card */}
          <div className="col-span-5">
            <div className="mb-4">
              <h2 className="text-white font-heading font-semibold text-[17px] text-center tracking-[-0.01em]">
                Get Your Free Security Assessment
              </h2>
            </div>
            <GoogleLeadForm />
            <div className="text-center mt-4">
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

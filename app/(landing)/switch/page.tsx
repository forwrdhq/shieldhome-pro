'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import { pushDataLayer } from '@/lib/google-tracking'
import { trackPhoneClick } from '@/lib/google-tracking'

// ── Premium components from /google ──
import TrustBar from '../google/components/TrustBar'
import SwitchHero from './components/SwitchHero'
import SwitchForm from './components/SwitchForm'
import { useScrollReveal, useStaggerReveal } from '../google/components/useScrollReveal'

const PromoBanner = dynamic(() => import('../google/components/PromoBanner'))
const SystemIncludesStrip = dynamic(() => import('../google/components/SystemIncludesStrip'))
const ProductShowcase = dynamic(() => import('../google/components/ProductShowcase'))
const WhyVivintSection = dynamic(() => import('../google/components/WhyVivintSection'))
const AwardsMarquee = dynamic(() => import('../google/components/AwardsMarquee'))
const GoogleStickyBar = dynamic(() => import('../google/components/GoogleStickyBar'))
const ExitIntentPopup = dynamic(() => import('../google/components/ExitIntentPopup'))

// ── Headlines ──

const HEADLINES: Record<string, string> = {
  'cancel-adt': "Switching from ADT? We'll Pay Up to $1,000 to Buy Out Your Contract",
  'adt-alternative': "The Best ADT Alternative — Plus We'll Buy Out Your Contract",
  'no-contract': 'Home Security With No Long-Term Contract — Plus Up to $1,000 Buyout',
  'switch-security': 'Switch Providers — We Cover Up to $1,000 in Cancellation Fees',
}
const DEFAULT_HEADLINE = "We'll Pay Up to $1,000 to Buy Out Your Security Contract"

// ── Testimonials ──

const testimonials = [
  {
    text: "I was paying $58/month with ADT and had 14 months left on my contract. ShieldHome covered my $650 cancellation fee, installed a full Vivint system the next day, and now I'm saving $15/month with way better equipment.",
    name: 'Sarah M.',
    location: 'Provo, UT',
    date: 'February 2026',
    initials: 'SM',
    color: '#7C3AED',
    rating: 5,
  },
  {
    text: "I called ADT to cancel and they quoted me $1,100 in fees. ShieldHome covered it. The Vivint cameras are leagues ahead — actual AI person detection, color night vision, and the doorbell camera records 24/7 even without Wi-Fi. Wish I'd switched years ago.",
    name: 'Marcus T.',
    location: 'Gilbert, AZ',
    date: 'January 2026',
    initials: 'MT',
    color: '#0F172A',
    rating: 5,
  },
  {
    text: "I was stuck in a Brinks contract with a system from 2019. The technician arrived at 9am, had everything installed by 10:30, and walked me through the app. My old system couldn't even connect to my phone. Night and day difference.",
    name: 'Jennifer K.',
    location: 'Frisco, TX',
    date: 'March 2026',
    initials: 'JK',
    color: '#059669',
    rating: 5,
  },
]

// ── FAQs ──

const faqs = [
  {
    q: 'How does the contract buyout work?',
    a: "When you switch to Vivint through ShieldHome, we cover up to $1,000 of your existing contract's early termination fee. You don't pay your old provider's cancellation fee out of pocket — we handle it. The buyout is applied as a credit toward your new system. Over 2,400 homeowners have used this program in the last 12 months.",
  },
  {
    q: "Is this really free? What's the catch?",
    a: "No catch. Vivint invests in earning your business because their technology and service keeps customers for an average of 7+ years. Here's exactly what you'll pay: your monthly monitoring rate (starting at $33/mo) and any equipment upgrades beyond what's included. The buyout, installation, system design consultation, and doorbell camera are all free.",
  },
  {
    q: 'What if I still have equipment from my old provider?',
    a: "In most cases, your existing wiring and sensors can be reused with your new Vivint system — this saves time and keeps installation clean. Our technician assesses everything during installation. You're never locked in: if for any reason the installation can't proceed, there's zero charge.",
  },
  {
    q: 'How long does the whole process take?',
    a: 'From your first call to a fully installed system: typically 24–48 hours. The installation itself takes about 2 hours. We coordinate timing so your new system is live before your old service disconnects — zero gap in protection, guaranteed.',
  },
  {
    q: 'Will I lose protection during the switch?',
    a: 'Never. We guarantee continuous coverage. Your new Vivint system is installed and fully operational before we disconnect your previous service. There is no gap — not even for a minute.',
  },
  {
    q: "What if I'm not happy with Vivint?",
    a: "Vivint includes a satisfaction guarantee during your initial service period. If the system or service isn't what you expected, we'll make it right. With a 4.8/5 rating from 58,000+ reviews, the vast majority of switchers wish they'd done it sooner.",
  },
]

// ── Comparison rows ──

const comparisonRows = [
  { feature: 'Monthly cost', current: '$45–$65/mo', vivint: 'Starting at $33/mo' },
  { feature: 'Contract', current: '36–60 months locked in', vivint: 'Flexible — cancel anytime' },
  { feature: 'Equipment', current: '3–10+ years old', vivint: 'Brand new, AI-powered' },
  { feature: 'Cameras', current: 'Low-res, no AI detection', vivint: '4K HDR, AI person/vehicle detection' },
  { feature: 'Smart home', current: null, vivint: 'Full Google/Alexa ecosystem' },
  { feature: 'Mobile app', current: 'Basic or outdated', vivint: 'Live HD feeds + smart controls' },
  { feature: 'Cancellation fee', current: '$800–$1,400', vivint: 'We cover up to $1,000', highlight: true },
]

// ── Equipment ──

const equipment = [
  { name: 'Outdoor Camera Pro', desc: 'AI person/vehicle detection, full color night vision, 2-way audio with siren', image: '/images/google/products/outdoor-camera-pro.png', badge: 'Most Popular' },
  { name: 'Doorbell Camera Pro', desc: '24/7 recording even without Wi-Fi, package detection, 180° HDR video', image: '/images/google/products/doorbell-camera-pro.png', badge: 'Free with Switch' },
  { name: 'Smart Hub', desc: '7" touchscreen, full system control, Google/Alexa built in', image: '/images/google/products/indoor-camera-pro.png', badge: null },
  { name: 'Smart Lock Pro', desc: 'Keyless entry, guest codes, auto-lock, remote access + activity log', image: '/images/google/products/spotlight-pro.png', badge: null },
]

// ── Star SVG ──

function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
      <path d="M7 0.5L8.76 5.04L13.5 5.5L9.98 8.66L10.98 13.5L7 11.04L3.02 13.5L4.02 8.66L0.5 5.5L5.24 5.04L7 0.5Z" />
    </svg>
  )
}

// ── Custom check/x SVGs ──

function CheckSVG() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="inline mr-1 flex-shrink-0">
      <path d="M3.5 7.5L6.5 10.5L11.5 4.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XSvg() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="inline mr-1 flex-shrink-0">
      <path d="M4 4L11 11M11 4L4 11" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ── FAQ Toggle Icon ──

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20" height="20" viewBox="0 0 20 20" fill="none"
      className={cn('flex-shrink-0 transition-transform duration-300', open && 'rotate-45')}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ═══════════════════════════════════════
// MAIN CONTENT
// ═══════════════════════════════════════

function SwitchContent() {
  const searchParams = useSearchParams()
  const kw = searchParams.get('kw') || ''
  const headline = HEADLINES[kw] || DEFAULT_HEADLINE

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Scroll reveal refs
  const howRef = useScrollReveal<HTMLDivElement>()
  const howStepsRef = useStaggerReveal<HTMLDivElement>(120)
  const compRef = useScrollReveal<HTMLDivElement>()
  const compTableRef = useScrollReveal<HTMLDivElement>()
  const testimonialHeadRef = useScrollReveal<HTMLDivElement>()
  const testimonialGridRef = useStaggerReveal<HTMLDivElement>(100)
  const equipRef = useScrollReveal<HTMLDivElement>()
  const equipGridRef = useStaggerReveal<HTMLDivElement>(80)
  const guaranteeRef = useScrollReveal<HTMLDivElement>()
  const ctaRef = useScrollReveal<HTMLDivElement>()

  // Tracking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.fbq?.('track', 'ViewContent', { content_name: 'switch_page' })
      window.dataLayer?.push({ event: 'page_view', page_type: 'switch' })
    }
  }, [])

  return (
    <div className="min-h-screen bg-white" id="hero-form">
      <TrustBar />
      <PromoBanner />
      <SwitchHero headline={headline} />
      <SystemIncludesStrip />

      {/* ═══ How Switching Works ═══ */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div ref={howRef} className="text-center mb-8 md:mb-14">
            <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-4" style={{ color: 'var(--color-brass-400)' }}>
              Simple 3-Step Process
            </p>
            <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900">
              How Switching Works
            </h2>
            <p className="text-[14px] md:text-[15px] font-body text-slate-400 mt-2">
              Three steps. We handle the hard part.
            </p>
          </div>

          <div ref={howStepsRef} className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { num: '01', title: 'Tell Us About Your System', desc: 'Takes 60 seconds. We assess your current provider, contract, and design your upgrade path.' },
              { num: '02', title: 'Get Your Buyout Offer', desc: 'A dedicated advisor calls within 10 minutes with your exact buyout amount and new system design — zero obligation.' },
              { num: '03', title: 'We Handle Everything', desc: 'We cancel your old service, install your new Vivint system (under 2 hours), and cover your cancellation fee. Zero gap in protection.' },
            ].map((step) => (
              <div key={step.num} className="text-center md:text-left">
                <span className="inline-block font-heading font-bold text-[32px] md:text-[40px] tracking-[-0.03em] mb-3" style={{ color: 'var(--color-brass-300)' }}>
                  {step.num}
                </span>
                <h3 className="font-heading font-semibold text-[16px] md:text-[17px] text-slate-900 tracking-[-0.015em] mb-2">
                  {step.title}
                </h3>
                <p className="text-[14px] font-body text-slate-400 leading-[1.65]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-[13px] font-body text-slate-400">
            Most homeowners go from first call to fully installed in 24–48 hours
          </p>
        </div>
      </section>

      {/* ═══ Savings Comparison ═══ */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div ref={compRef} className="text-center mb-8 md:mb-12">
            <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
              Side-by-Side Comparison
            </p>
            <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900">
              Your Current Provider vs. Vivint
            </h2>
            <p className="text-[14px] md:text-[15px] font-body text-slate-400 mt-2">
              See exactly what you&apos;re missing — and what you&apos;ll gain
            </p>
          </div>

          {/* Desktop table */}
          <div ref={compTableRef} className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-4 bg-slate-50 text-left text-[12px] font-heading font-semibold text-slate-400 uppercase tracking-[0.06em] w-[28%]" />
                  <th className="px-6 py-4 bg-red-50/40 text-center w-[36%]">
                    <span className="text-red-400 text-[13px] font-heading font-semibold">Your Current Provider</span>
                  </th>
                  <th className="px-6 py-4 bg-emerald-50/40 text-center w-[36%]">
                    <span className="text-emerald-600 text-[13px] font-heading font-bold">ShieldHome + Vivint</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className={cn(row.highlight ? 'bg-emerald-50/30' : 'hover:bg-slate-50/50')}>
                    <td className="px-6 py-4 font-heading font-semibold text-slate-900 text-[14px] border-t border-slate-100">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center border-t border-slate-100">
                      {row.current === null ? (
                        <span className="inline-flex items-center gap-1 text-red-400 text-[13px] font-body">
                          <XSvg /> Limited or none
                        </span>
                      ) : (
                        <span className={cn('text-[13px] font-body', row.highlight ? 'text-red-500 font-semibold' : 'text-slate-500')}>
                          {row.highlight && <XSvg />}{row.current}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center border-t border-slate-100">
                      <span className={cn('text-[13px] font-body', row.highlight ? 'text-emerald-600 font-bold text-[14px]' : 'text-slate-900 font-semibold')}>
                        <CheckSVG />{row.vivint}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-heading font-semibold text-[15px]">Average annual savings after switching</p>
                <p className="text-slate-400 text-[12px] font-body">Based on 2,400+ switches in the last 12 months</p>
              </div>
              <p className="text-emerald-400 font-heading font-bold text-[24px] tracking-[-0.02em]">$264/year</p>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {comparisonRows.map((row) => (
              <div key={row.feature} className={cn('rounded-xl border p-4 bg-white', row.highlight ? 'border-emerald-500/40' : 'border-slate-200')}>
                <p className="font-heading font-semibold text-slate-900 text-[13px] mb-3">{row.feature}</p>
                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                  <div>
                    <p className="text-[10px] text-red-400 font-heading font-semibold uppercase mb-1">Current</p>
                    <p className={cn('text-[12px] font-body', row.highlight ? 'text-red-500 font-semibold' : 'text-slate-500')}>
                      {row.current || 'None'}
                    </p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <div>
                    <p className="text-[10px] text-emerald-500 font-heading font-semibold uppercase mb-1">Vivint</p>
                    <p className={cn('text-[12px] font-body', row.highlight ? 'text-emerald-600 font-bold' : 'text-slate-900 font-semibold')}>
                      {row.vivint}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-slate-900 rounded-xl p-4 text-center">
              <p className="text-slate-400 text-[11px] font-body mb-1">Average annual savings</p>
              <p className="text-emerald-400 font-heading font-bold text-[24px]">$264/year</p>
              <p className="text-slate-500 text-[11px] font-body">Based on 2,400+ switches</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="#hero-form"
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
            >
              Get My Buyout Quote
            </a>
          </div>
        </div>
      </section>

      <ProductShowcase />

      {/* ═══ Testimonials ═══ */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div ref={testimonialHeadRef} className="text-center mb-8 md:mb-12">
            <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
              Real Switches, Real Savings
            </p>
            <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900">
              What Switchers Say
            </h2>
          </div>

          {/* Video */}
          <div className="mb-8 md:mb-10">
            <div className="relative rounded-2xl overflow-hidden aspect-video max-w-3xl mx-auto border border-slate-100 shadow-sm">
              <iframe
                src="https://www.youtube.com/embed/mgHIEsr_XH0?rel=0"
                title="Vivint customer video testimonial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          <div ref={testimonialGridRef} className="grid md:grid-cols-3 gap-4 md:gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="group bg-white rounded-2xl p-5 md:p-6 border border-slate-100 hover:border-slate-200 transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-heading font-bold tracking-wide flex-shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-heading font-semibold text-slate-900 tracking-[-0.01em] truncate">{t.name}</p>
                    <p className="text-[10px] font-body text-slate-400 truncate">{t.location} &middot; {t.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (<Star key={i} />))}
                </div>
                <p className="text-[12px] md:text-[13px] font-body text-slate-600 leading-[1.6]" style={{ textIndent: '-0.35em' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-[13px] font-body text-slate-400">
            Based on 58,000+ verified customer reviews
          </p>
        </div>
      </section>

      {/* ═══ Guarantee ═══ */}
      <section className="py-14 md:py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(180, 130, 60, 0.04)' }} />

        <div ref={guaranteeRef} className="max-w-5xl mx-auto px-4 md:px-8 relative">
          <div className="text-center mb-8 md:mb-14">
            <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-4" style={{ color: 'var(--color-brass-300)' }}>
              Risk-Free Switch
            </p>
            <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-white">
              The ShieldHome Switch Guarantee
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/40">
              <h3 className="text-white font-heading font-semibold text-[17px] tracking-[-0.015em] mb-3">
                We&apos;ll Beat Your Current Deal
              </h3>
              <p className="text-[15px] font-body text-slate-400 leading-[1.7]">
                If we can&apos;t beat your current provider on price, features, <em>and</em> service quality — we&apos;ll tell you. No pressure, no obligation. Over 98% of homeowners who get a quote decide to switch.
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/40">
              <h3 className="text-white font-heading font-semibold text-[17px] tracking-[-0.015em] mb-3">
                Price Lock Guarantee
              </h3>
              <p className="text-[15px] font-body text-slate-400 leading-[1.7]">
                Your monthly monitoring rate is locked for the life of your contract. No surprise rate hikes, ever.
              </p>
            </div>
          </div>

          <div className="text-center">
            <a
              href="#hero-form"
              className="inline-flex items-center justify-center text-white px-8 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)]"
              style={{ backgroundColor: 'var(--color-emerald-600)' }}
            >
              Get My Buyout Quote
            </a>
          </div>
        </div>
      </section>

      <WhyVivintSection />
      <AwardsMarquee />

      {/* ═══ Equipment Showcase ═══ */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div ref={equipRef} className="text-center mb-8 md:mb-12">
            <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
              What You&apos;re Switching To
            </p>
            <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900">
              The Latest Vivint Technology
            </h2>
            <p className="text-[14px] md:text-[15px] font-body text-slate-400 mt-2">
              Every system includes professional installation and 24/7 monitoring
            </p>
          </div>

          <div ref={equipGridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {equipment.map((item) => (
              <div
                key={item.name}
                className="bg-white rounded-xl border border-slate-100 p-5 text-center relative group hover:border-slate-200 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)] transition-all duration-500"
              >
                {item.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-heading font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    {item.badge}
                  </span>
                )}
                <div className="w-16 h-16 mx-auto mb-3 relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                    sizes="64px"
                  />
                </div>
                <h3 className="font-heading font-semibold text-slate-900 mb-1.5 text-[13px] md:text-[14px]">{item.name}</h3>
                <p className="text-slate-400 text-[11px] md:text-[12px] font-body leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div className="text-center mb-8 md:mb-14">
            <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-4" style={{ color: 'var(--color-brass-400)' }}>
              Contract Buyout FAQ
            </p>
            <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-200 last:border-b-0">
                <button
                  onClick={() => {
                    const isOpening = openFaq !== i
                    setOpenFaq(isOpening ? i : null)
                    if (isOpening) pushDataLayer('faq_open', { question: faq.q })
                  }}
                  className="w-full flex items-center justify-between py-6 text-left group"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-heading font-semibold text-[15px] md:text-[17px] tracking-[-0.01em] text-slate-900 pr-4 group-hover:text-slate-700 transition-colors duration-300">
                    {faq.q}
                  </span>
                  <span className={cn('transition-colors duration-300', openFaq === i ? 'text-slate-900' : 'text-slate-300 group-hover:text-slate-500')}>
                    <ToggleIcon open={openFaq === i} />
                  </span>
                </button>
                <div
                  className={cn('overflow-hidden transition-all duration-400', openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <div className="pb-7 text-[15px] font-body text-slate-500 leading-[1.7] max-w-[90%]">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Final CTA ═══ */}
      <section className="py-14 md:py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(180, 130, 60, 0.03)' }} />

        <div ref={ctaRef} className="max-w-2xl mx-auto px-5 md:px-8 text-center relative">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-4" style={{ color: 'var(--color-brass-300)' }}>
            Ready to Switch?
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-white mb-3">
            Stop Paying for a System That Doesn&apos;t Protect You
          </h2>
          <p className="text-[14px] md:text-[15px] font-body text-slate-400 mb-8 max-w-lg mx-auto leading-[1.65]">
            Your old provider is charging you more for less. Get your free buyout quote — most homeowners save $200+/year after switching.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#hero-form"
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-lg font-heading font-semibold text-[15px] tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.3)] w-full sm:w-auto"
            >
              Get My Buyout Quote
            </a>
            <a
              href={`tel:${PHONE_NUMBER_RAW}`}
              onClick={() => trackPhoneClick('final_cta')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-[14px] font-body"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3.5C2 2.67 2.67 2 3.5 2h2.09a.5.5 0 01.49.39l.69 3.08a.5.5 0 01-.14.47l-1.37 1.37a8 8 0 003.5 3.5l1.37-1.37a.5.5 0 01.47-.14l3.08.69a.5.5 0 01.39.49v2.09c0 .83-.67 1.5-1.5 1.5A11.5 11.5 0 012 3.5z" />
              </svg>
              Or call: {PHONE_NUMBER}
            </a>
          </div>
          <p className="mt-6 text-[12px] font-body text-slate-500">
            No credit check. No commitment. Free consultation.
          </p>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="py-6 bg-slate-950">
        <div className="max-w-5xl mx-auto px-5 md:px-8 text-center">
          <p className="text-[11px] font-body text-slate-500">
            &copy; 2026 ShieldHome.pro &middot; Vivint Smart Home Partner &middot; Serving All 50 States &middot;{' '}
            <a href="/privacy" className="underline hover:text-slate-400 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </footer>

      <GoogleStickyBar />
      <ExitIntentPopup />
    </div>
  )
}

export default function SwitchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SwitchContent />
    </Suspense>
  )
}

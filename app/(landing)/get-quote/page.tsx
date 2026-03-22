'use client'

import { Suspense, useEffect, useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import GetQuoteForm from '@/components/landing/GetQuoteForm'
import FAQSection from '@/components/landing/FAQSection'
import StickyPhoneCTA from '@/components/landing/StickyPhoneCTA'
import {
  Shield, Phone, CheckCircle, Star, ShieldCheck, Users, Zap,
  Camera, DoorOpen, Lock, Monitor, ArrowRight, Clock, Award,
  ChevronRight,
} from 'lucide-react'

const PHONE = '(801) 616-6301'
const PHONE_RAW = '+18016166301'

// ─── DTR Headlines ───
const HEADLINES: Record<string, string> = {
  'home-security': 'Professional Home Security — $0 Down, Free Setup',
  'installation': 'Professional Home Security Installation — Free Setup',
  'smart-home': 'Smart Home Security Systems — $0 Down, Free Camera',
  'near-me': 'Home Security Installation Near You — $0 Down',
  'cost': 'Home Security Starting at $0 Down — Get Your Custom Quote',
  'quote': 'Get Your Free Home Security Quote — $0 Down, Free Setup',
}
const DEFAULT_HEADLINE = 'Professional Home Security — $0 Down, Free Doorbell Camera'

// ─── Testimonials ───
const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Draper, UT',
    rating: 5,
    text: "We finally feel safe when we travel. Setup took less than 2 hours and the app lets me check cameras from anywhere.",
    avatar: 'SM',
    color: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Jason R.',
    location: 'Sandy, UT',
    rating: 5,
    text: "The AI cameras actually detect people vs animals. Way better than our old Ring setup — no more false alerts at 3am.",
    avatar: 'JR',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    name: 'Maria L.',
    location: 'Provo, UT',
    rating: 5,
    text: "As a single mom, knowing my kids are safe after school gives me so much peace of mind. Vivint was the best decision.",
    avatar: 'ML',
    color: 'from-rose-500 to-pink-600',
  },
]

// ─── FAQs ───
const faqs = [
  {
    q: 'Is installation really free?',
    a: 'Yes. Professional installation by a certified Vivint technician is included at no cost. Most installations are completed in under 2 hours. Your technician handles all wiring, mounting, configuration, and walks you through the app before they leave.',
  },
  {
    q: 'Do I need a long-term contract?',
    a: 'No. Vivint offers flexible month-to-month monitoring plans. No multi-year commitment required. You can cancel anytime — though with a 4.8/5 rating from 58,000+ reviews, most customers stay for years.',
  },
  {
    q: 'How fast can I get protected?',
    a: 'Most homes are fully installed within 24–48 hours of your consultation. We schedule at your convenience — mornings, evenings, and weekends available.',
  },
  {
    q: 'Can I control everything from my phone?',
    a: 'Yes. The Vivint Smart Home app gives you full control of cameras, locks, sensors, thermostat, and garage from anywhere. Live HD camera feeds, instant alerts, and one-tap arming/disarming.',
  },
  {
    q: 'What equipment do I get?',
    a: "Your custom system can include indoor/outdoor AI cameras, a video doorbell (free with qualifying systems), smart locks, door/window sensors, motion detectors, and a 7\" touchscreen control panel. Your advisor designs the system around your home's specific layout.",
  },
]

// ─── Equipment ───
const equipment = [
  {
    name: 'Doorbell Camera Pro',
    desc: '180° HDR video with 24/7 recording and package detection',
    icon: DoorOpen,
    badge: 'Free',
    features: ['24/7 recording', 'Package alerts', '2-way talk'],
  },
  {
    name: 'Outdoor Camera Pro',
    desc: 'AI-powered person and vehicle detection with color night vision',
    icon: Camera,
    badge: null,
    features: ['AI detection', 'Color night vision', '140° FOV'],
  },
  {
    name: 'Smart Lock Pro',
    desc: 'Keyless entry with guest codes, auto-lock, and remote access',
    icon: Lock,
    badge: null,
    features: ['Guest codes', 'Auto-lock', 'Activity log'],
  },
  {
    name: 'Smart Hub Panel',
    desc: '7" touchscreen with Google and Alexa voice control built in',
    icon: Monitor,
    badge: null,
    features: ['Voice control', 'One-tap arm', 'Live feeds'],
  },
]

function scrollToForm() {
  document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })
}

// ─── Live Counter ───
function LiveCounter() {
  const [count, setCount] = useState(89)
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + (Math.random() > 0.6 ? 1 : 0))
    }, 25000)
    return () => clearInterval(interval)
  }, [])
  return <span className="tabular-nums">{count}</span>
}

function GetQuoteContent() {
  const searchParams = useSearchParams()
  const kw = searchParams.get('kw') || ''
  const headline = HEADLINES[kw] || DEFAULT_HEADLINE

  const onCTAClick = useCallback(() => scrollToForm(), [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const w = window as any
      if (w.fbq) w.fbq('track', 'ViewContent', { content_name: 'get_quote_page' })
      if (w.dataLayer) w.dataLayer.push({ event: 'page_view', page_type: 'get-quote' })
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* ═══ Sticky Header ═══ */}
      <header className="sticky top-0 z-50 bg-[#0a1628]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#00C853] rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={18} />
              </div>
              <div>
                <div className="font-bold text-white text-[13px] leading-none">ShieldHome Pro</div>
                <div className="text-[10px] text-white/35 mt-0.5">Vivint Authorized Dealer</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 text-[11px] text-white/40">
                <div className="w-1.5 h-1.5 bg-[#00C853] rounded-full animate-pulse" />
                <LiveCounter /> quotes today
              </div>
              <a
                href={`tel:${PHONE_RAW}`}
                className="flex items-center gap-1.5 bg-[#00C853] hover:bg-[#00A846] text-white px-3.5 py-2 rounded-lg font-semibold text-[13px] transition-colors"
              >
                <Phone size={13} />
                <span className="hidden sm:inline">{PHONE}</span>
                <span className="sm:hidden">Call</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ Hero + Form ═══ */}
      <section id="quote-form" className="relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0">
          <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-[#00C853]/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-100px] left-[-200px] w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-10 md:pt-14 md:pb-16 relative">
          <div className="grid md:grid-cols-[1fr,400px] gap-8 md:gap-12 items-start">
            {/* Left: Copy */}
            <div className="text-center md:text-left order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-[#00C853]/10 border border-[#00C853]/20 rounded-full px-3 py-1 mb-5">
                <div className="w-1.5 h-1.5 bg-[#00C853] rounded-full" />
                <span className="text-[#00C853] text-[11px] font-semibold uppercase tracking-wider">
                  Vivint Authorized Dealer
                </span>
              </div>

              <h1 className="text-[26px] sm:text-[32px] md:text-[40px] font-extrabold text-white mb-4 leading-[1.15] tracking-tight">
                {headline}
              </h1>

              <p className="text-white/55 text-[15px] md:text-[17px] leading-relaxed mb-8 max-w-[480px] mx-auto md:mx-0">
                Free expert installation + 24/7 professional monitoring. Most homes fully protected within 48 hours.
              </p>

              {/* Value props */}
              <div className="hidden md:grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: <Zap size={15} />, text: 'Installed in 24–48 hours' },
                  { icon: <ShieldCheck size={15} />, text: '24/7 professional monitoring' },
                  { icon: <Camera size={15} />, text: 'Free doorbell camera included' },
                  { icon: <Lock size={15} />, text: 'No long-term commitment' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 text-white/50 text-[13px]">
                    <div className="text-[#00C853] flex-shrink-0">{item.icon}</div>
                    {item.text}
                  </div>
                ))}
              </div>

              {/* Credibility row */}
              <div className="hidden md:flex flex-wrap items-center gap-5 text-[12px] text-white/35 pt-6 border-t border-white/[0.06]">
                <span className="flex items-center gap-1.5">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-white/70 font-medium">4.8</span>/5 from 58K reviews
                </span>
                <span className="flex items-center gap-1.5">
                  <Award size={12} className="text-[#00C853]" /> BBB A+ Rated
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={12} className="text-[#00C853]" /> 2M+ homes
                </span>
              </div>
            </div>

            {/* Right: Form */}
            <div className="order-1 md:order-2">
              <GetQuoteForm />
            </div>
          </div>

          {/* Mobile trust bar */}
          <div className="md:hidden mt-6">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] text-white/40">
              <span className="flex items-center gap-1">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-white/60 font-medium">4.8/5</span> 58K reviews
              </span>
              <span className="flex items-center gap-1">
                <Award size={10} className="text-[#00C853]" /> BBB A+
              </span>
              <span className="flex items-center gap-1">
                <Users size={10} className="text-[#00C853]" /> 2M+ homes
              </span>
            </div>
            <div className="text-center mt-3">
              <a
                href={`tel:${PHONE_RAW}`}
                className="text-white/30 hover:text-white/50 transition-colors text-[11px]"
              >
                Prefer to talk? Call {PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Equipment Grid ═══ */}
      <section className="py-14 bg-[#0d1b30]/80 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-[#00C853] font-semibold text-[11px] uppercase tracking-[0.15em] mb-2">
              WHAT&apos;S INCLUDED
            </p>
            <h2 className="text-[22px] md:text-[28px] font-extrabold text-white tracking-tight">
              Your Custom Security System
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {equipment.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.name}
                  className="group relative bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 md:p-6 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
                >
                  {item.badge && (
                    <span className="absolute -top-2 right-3 bg-[#00C853] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                  <div className="w-11 h-11 bg-[#00C853]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00C853]/15 transition-colors">
                    <Icon size={20} className="text-[#00C853]" />
                  </div>
                  <h3 className="font-bold text-white text-[13px] mb-1.5">{item.name}</h3>
                  <p className="text-white/35 text-[11px] leading-relaxed mb-3">{item.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.features.map((f) => (
                      <span key={f} className="text-[9px] text-white/25 bg-white/[0.04] px-1.5 py-0.5 rounded font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ Offer Banner ═══ */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-[#00C853] to-[#00A846] py-5 md:py-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-white font-bold text-[14px] md:text-[15px]">
                March Special: Free Doorbell Camera + Free Installation + $0 Down
              </p>
              <p className="text-white/75 text-[12px] mt-0.5">Limited installation slots this month</p>
            </div>
            <button
              onClick={onCTAClick}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2.5 rounded-lg font-bold text-[13px] transition-all whitespace-nowrap flex-shrink-0 border border-white/20"
            >
              Check Availability <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ Testimonials (custom inline — not the carousel) ═══ */}
      <section className="py-14 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-[#00C853] font-semibold text-[11px] uppercase tracking-[0.15em] mb-2">
              TRUSTED BY HOMEOWNERS
            </p>
            <h2 className="text-[22px] md:text-[28px] font-extrabold text-white tracking-tight">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 md:p-6"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-white/60 text-[13px] leading-relaxed mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-white text-[10px] font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white/80 text-[12px] font-semibold">{t.name}</p>
                    <p className="text-white/30 text-[11px]">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Pricing ═══ */}
      <section className="py-10 bg-[#0d1b30]/80 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6 md:p-8">
            <h2 className="text-center text-[18px] md:text-[22px] font-bold text-white mb-5">
              Simple, Transparent Pricing
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Down payment', value: '$0', sub: 'Nothing upfront' },
                { label: 'Monitoring', value: '$19.95', sub: 'per month' },
                { label: 'Installation', value: 'Free', sub: 'Professional setup' },
                { label: 'Commitment', value: 'None', sub: 'Cancel anytime' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-white/30 text-[10px] uppercase tracking-wider font-medium mb-1">{item.label}</p>
                  <p className="text-white font-extrabold text-[20px] md:text-[24px]">{item.value}</p>
                  <p className="text-white/30 text-[11px]">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <div className="border-t border-white/[0.04]">
        <FAQSection
          faqs={faqs}
          title="Frequently Asked Questions"
          subtitle="Everything you need to know"
        />
      </div>

      {/* ═══ Final CTA ═══ */}
      <section className="py-14 bg-[#0d1b30]/80 border-t border-white/[0.04] text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00C853]/[0.04] rounded-full blur-[100px]" />
        <div className="max-w-md mx-auto px-4 relative">
          <p className="text-[#00C853] font-semibold text-[11px] uppercase tracking-[0.15em] mb-3">
            LIMITED SLOTS THIS WEEK
          </p>
          <h2 className="text-[20px] md:text-[26px] font-extrabold text-white mb-3 tracking-tight">
            Get Your Free Quote Now
          </h2>
          <p className="text-white/40 text-[13px] mb-7">
            $0 down. Free doorbell camera. Professional installation in 24–48 hours.
          </p>
          <button
            onClick={onCTAClick}
            className="bg-[#00C853] hover:bg-[#00A846] text-white px-8 py-4 rounded-xl font-bold text-[14px] transition-all hover:-translate-y-0.5 shadow-lg shadow-[#00C853]/20 w-full sm:w-auto"
          >
            Check Availability <ChevronRight size={16} className="inline ml-1" />
          </button>
          <div className="mt-4">
            <a
              href={`tel:${PHONE_RAW}`}
              className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/50 transition-colors text-[12px]"
            >
              <Phone size={12} />
              Or call {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="bg-[#060d18] py-5 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white/20 text-[11px]">
            © {new Date().getFullYear()} ShieldHome Pro — Authorized Vivint Smart Home Dealer | {PHONE}
          </p>
          <p className="text-white/[0.12] text-[10px] mt-1 max-w-md mx-auto">
            ShieldHome Pro is an independently operated authorized dealer. Vivint® is a registered trademark of Vivint Smart Home, Inc.
          </p>
        </div>
      </footer>

      {/* ═══ Sticky CTA ═══ */}
      <StickyPhoneCTA onQuizOpen={onCTAClick} />
    </div>
  )
}

export default function GetQuotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a1628]" />}>
      <GetQuoteContent />
    </Suspense>
  )
}

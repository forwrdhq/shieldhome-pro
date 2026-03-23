'use client'

import { Suspense, useEffect, useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import GetQuoteForm from '@/components/landing/GetQuoteForm'
import FAQSection from '@/components/landing/FAQSection'
import StickyPhoneCTA from '@/components/landing/StickyPhoneCTA'
import {
  Shield, Phone, Star, ShieldCheck, Users, Zap,
  Camera, DoorOpen, Lock, Monitor, ArrowRight, Award,
  ChevronRight,
} from 'lucide-react'

import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

const PHONE = PHONE_NUMBER
const PHONE_RAW = PHONE_NUMBER_RAW

// ─── DTR Headlines (keyword → headline for Google Ads message match) ───
const HEADLINES: Record<string, string> = {
  'install': 'Expert Home Security Installation — $0 Down, Free Camera',
  'installation': 'Expert Home Security Installation — $0 Down, Free Camera',
  'smart': 'Smart Home Security System — Free Setup, $0 Down',
  'smart-home': 'Smart Home Security System — Free Setup, $0 Down',
  'near-me': 'Home Security Installation Near You — Free Setup, $0 Down',
  'local': 'Home Security Installation in Your Area — Free Setup',
  'cameras': 'AI Security Cameras + 24/7 Monitoring — Free Installation',
  'cost': 'Home Security System — See Your Custom Price ($0 Down)',
  'price': 'Home Security System — See Your Custom Price ($0 Down)',
  'quote': 'Get Your Free Home Security Quote — $0 Down, Free Setup',
  'system': 'Complete Home Security System — $0 Down, Free Doorbell Camera',
  'home-security': 'Professional Home Security — $0 Down, Free Setup',
  'best': 'Best-Rated Home Security System — $0 Down, Free Camera',
  'top': 'Top-Rated Home Security — Free Installation, $0 Down',
  'reviews': '#1-Rated Home Security (4.8/5 Stars) — Free Setup',
  'vivint': 'Vivint Smart Home — Authorized Dealer, Free Installation',
}
const DEFAULT_HEADLINE = 'Home Security — Installed Tomorrow, $0 Down'

// ─── Testimonials ───
const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Draper, UT',
    rating: 5,
    text: "We finally feel safe when we travel. Setup took less than 2 hours and the app lets me check cameras from anywhere. The technician was fantastic.",
    avatar: 'SM',
    color: 'from-violet-500 to-purple-600',
    source: 'Google Review',
    timeAgo: '3 weeks ago',
  },
  {
    name: 'Jason R.',
    location: 'Plano, TX',
    rating: 5,
    text: "The AI cameras actually detect people vs animals. Way better than our old Ring setup — no more false alerts at 3am. Worth every penny.",
    avatar: 'JR',
    color: 'from-blue-500 to-cyan-600',
    source: 'Google Review',
    timeAgo: '1 month ago',
  },
  {
    name: 'Maria L.',
    location: 'Orlando, FL',
    rating: 4,
    text: "As a single mom, knowing my kids are safe after school gives me peace of mind. Installation was quick and the monthly cost is reasonable.",
    avatar: 'ML',
    color: 'from-rose-500 to-pink-600',
    source: 'BBB Review',
    timeAgo: '2 months ago',
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
  {
    q: 'What does monitoring cost?',
    a: 'Plans start at $19.95/month for basic monitoring. Most homeowners choose a package in the $29–$45/month range depending on how many cameras and smart devices they want. Your advisor will build a custom quote — you only pay for what you actually need.',
  },
]

const CURRENT_MONTH = new Date().toLocaleString('en-US', { month: 'long' })

function scrollToForm() {
  document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })
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
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={18} />
              </div>
              <div>
                <div className="font-bold text-white text-[13px] leading-none">ShieldHome Pro</div>
                <div className="text-[10px] text-white/50 mt-0.5">Vivint Authorized Dealer</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 text-[11px] text-white/55">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                4.8/5 · 58K reviews
              </div>
              <a
                href={`tel:${PHONE_RAW}`}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg font-semibold text-[13px] transition-colors"
                aria-label={`Call us at ${PHONE}`}
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
          <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-emerald-600/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-100px] left-[-200px] w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-10 md:pt-14 md:pb-16 relative">
          {/* Mobile-only: headline above form so users have context */}
          <div className="md:hidden text-center mb-5">
            <h1 className="text-[22px] sm:text-[26px] font-extrabold text-white leading-[1.15] tracking-tight mb-2">
              {headline}
            </h1>
            <p className="text-white/60 text-[14px]">
              Free install. Free doorbell camera. 24/7 monitoring.
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr,400px] gap-8 md:gap-12 items-start">
            {/* Left: Copy */}
            <div className="text-center md:text-left order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-emerald-600/10 border border-emerald-600/20 rounded-full px-3 py-1 mb-5">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                <span className="text-emerald-500 text-[11px] font-semibold uppercase tracking-wider">
                  Vivint Authorized Dealer
                </span>
              </div>

              {/* Desktop headline (hidden on mobile since we show it above) */}
              <h1 className="hidden md:block text-[40px] font-extrabold text-white mb-4 leading-[1.15] tracking-tight">
                {headline}
              </h1>

              <p className="text-white/65 text-[15px] md:text-[17px] leading-relaxed mb-8 max-w-[480px] mx-auto md:mx-0">
                Join 2M+ homeowners with 24/7 professional monitoring, AI cameras, and smart locks — installed free by a certified tech in under 2 hours.
              </p>

              {/* Value props */}
              <div className="hidden md:grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: <Zap size={15} />, text: 'Installed in 24–48 hours' },
                  { icon: <ShieldCheck size={15} />, text: '24/7 monitoring (avg. 14-sec response)' },
                  { icon: <Camera size={15} />, text: 'Free doorbell camera included' },
                  { icon: <Lock size={15} />, text: '$0 down — no upfront equipment cost' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 text-white/70 text-[13px]">
                    <div className="text-emerald-500 flex-shrink-0">{item.icon}</div>
                    {item.text}
                  </div>
                ))}
              </div>

              {/* Credibility row */}
              <div className="hidden md:flex flex-wrap items-center gap-5 text-[12px] text-white/55 pt-6 border-t border-white/[0.06]">
                <span className="flex items-center gap-1.5">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-white/80 font-semibold">4.8</span>/5 from 58K Google reviews
                </span>
                <span className="flex items-center gap-1.5">
                  <Award size={12} className="text-emerald-500" /> BBB A+ Rated
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={12} className="text-emerald-500" /> 2M+ homes protected
                </span>
              </div>
            </div>

            {/* Right: Form */}
            <div className="order-1 md:order-2">
              {/* Urgency badge */}
              <div className="flex justify-center md:justify-start mb-3">
                <div className="inline-flex items-center gap-1.5 bg-emerald-600/15 border border-emerald-600/20 rounded-full px-3 py-1">
                  <Lock size={11} className="text-emerald-500" />
                  <span className="text-emerald-500 text-[11px] font-semibold">{CURRENT_MONTH} Special: Free Doorbell Camera + $0 Installation</span>
                </div>
              </div>
              <GetQuoteForm />
            </div>
          </div>

          {/* Mobile trust bar */}
          <div className="md:hidden mt-6">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] text-white/60">
              <span className="flex items-center gap-1">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-white/80 font-semibold">4.8/5</span> 58K Google reviews
              </span>
              <span className="flex items-center gap-1">
                <Award size={10} className="text-emerald-500" /> BBB A+
              </span>
              <span className="flex items-center gap-1">
                <Users size={10} className="text-emerald-500" /> 2M+ homes
              </span>
            </div>
            {/* Mobile click-to-call */}
            <div className="text-center mt-3">
              <a
                href={`tel:${PHONE_RAW}`}
                className="inline-flex items-center gap-1.5 text-white/55 hover:text-white/75 transition-colors text-[13px] py-2"
              >
                <Phone size={13} />
                Prefer to talk? Call {PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="py-12 md:py-16 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-center text-[20px] md:text-[26px] font-extrabold text-white tracking-tight mb-3">
            Most homes are fully protected within 48 hours
          </h2>
          <p className="text-center text-white/55 text-[13px] mb-10 max-w-lg mx-auto">
            From your first click to a fully armed system — here&apos;s what happens:
          </p>

          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
            <div className="flex md:flex-col items-start gap-4 md:text-left">
              <span className="text-[32px] md:text-[40px] font-black text-emerald-500/20 leading-none flex-shrink-0">01</span>
              <div>
                <h3 className="font-bold text-white text-[15px] mb-1.5">Tell us about your home</h3>
                <p className="text-white/55 text-[13px] leading-relaxed">ZIP code + a few details. Takes 30 seconds — no credit card, no strings.</p>
              </div>
            </div>

            <div className="flex md:flex-col items-start gap-4 md:text-left">
              <span className="text-[32px] md:text-[40px] font-black text-emerald-500/20 leading-none flex-shrink-0">02</span>
              <div>
                <h3 className="font-bold text-white text-[15px] mb-1.5">Your advisor builds a custom plan</h3>
                <p className="text-white/55 text-[13px] leading-relaxed">A Vivint Smart Home Pro calls with a package designed for your home&apos;s layout and budget. No generic upsells.</p>
              </div>
            </div>

            <div className="flex md:flex-col items-start gap-4 md:text-left">
              <span className="text-[32px] md:text-[40px] font-black text-emerald-500/20 leading-none flex-shrink-0">03</span>
              <div>
                <h3 className="font-bold text-white text-[15px] mb-1.5">A certified tech installs everything</h3>
                <p className="text-white/55 text-[13px] leading-relaxed">Mounts cameras, connects locks, sets up the app, and walks you through it all. Under 2 hours. $0.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Equipment ═══ */}
      <section className="py-12 md:py-14 bg-[#0d1b30]/80 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-[20px] md:text-[26px] font-extrabold text-white tracking-tight mb-2">
            Your system, designed for your home
          </h2>
          <p className="text-white/55 text-[13px] mb-8 max-w-lg">
            Your advisor picks the right hardware for your layout. Here&apos;s what most packages include:
          </p>

          {/* Featured item — doorbell camera (the free one) */}
          <div className="bg-white/[0.04] rounded-2xl border border-emerald-600/20 p-5 md:p-7 mb-4 flex flex-col sm:flex-row items-start gap-5">
            <div className="w-14 h-14 bg-emerald-600/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <DoorOpen size={26} className="text-emerald-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-[15px]">Doorbell Camera Pro</h3>
                <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Free
                </span>
              </div>
              <p className="text-white/60 text-[13px] leading-relaxed mb-3">
                180° HDR video, 24/7 recording, package detection, and 2-way talk. See who&apos;s at the door from anywhere.
              </p>
              <div className="flex flex-wrap gap-2">
                {['24/7 recording', 'Package alerts', '2-way talk', 'HDR night vision'].map((f) => (
                  <span key={f} className="text-[10px] text-white/55 bg-white/[0.05] px-2 py-0.5 rounded font-medium">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                name: 'Outdoor Camera Pro',
                desc: 'AI person & vehicle detection, color night vision, 140° field of view',
                icon: Camera,
              },
              {
                name: 'Smart Lock Pro',
                desc: 'Keyless entry, guest codes, auto-lock, full activity log',
                icon: Lock,
              },
              {
                name: '7" Smart Hub Panel',
                desc: 'Google + Alexa voice control, one-tap arm, live camera feeds',
                icon: Monitor,
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.name}
                  className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4 md:p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={18} className="text-emerald-500 flex-shrink-0" />
                    <h3 className="font-bold text-white text-[13px]">{item.name}</h3>
                  </div>
                  <p className="text-white/50 text-[12px] leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ Offer Banner ═══ */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-5 md:py-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-white font-bold text-[14px] md:text-[15px]">
                {CURRENT_MONTH} offer: Free Doorbell Camera + Free Installation + $0 Down
              </p>
              <p className="text-white/80 text-[12px] mt-0.5">Limited installation slots available this month</p>
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

      {/* ═══ Testimonials ═══ */}
      <section className="py-12 md:py-14 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-[20px] md:text-[26px] font-extrabold text-white tracking-tight mb-2">
            58,000+ homeowners gave Vivint 4.8 out of 5 stars
          </h2>
          <p className="text-white/50 text-[13px] mb-8">Here&apos;s what a few of them said:</p>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 md:p-6"
              >
                {/* Stars — varies by rating */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-white/15'}
                    />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-white/65 text-[13px] leading-relaxed mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                {/* Author + source */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-white text-[10px] font-bold`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white/80 text-[12px] font-semibold">{t.name}</p>
                      <p className="text-white/45 text-[11px]">{t.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-[10px]">{t.source}</p>
                    <p className="text-white/30 text-[9px]">{t.timeAgo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Why Vivint vs. Others ═══ */}
      <section className="py-10 bg-[#0d1b30]/80 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-[18px] md:text-[22px] font-bold text-white mb-6 text-center">
            Why homeowners switch to Vivint
          </h2>
          <div className="space-y-3">
            {[
              { vs: 'vs. ADT', point: 'No $99–$199 installation fee. No 36-month contract lock-in.' },
              { vs: 'vs. SimpliSafe', point: 'Professional installation included. AI cameras with person detection, not just motion triggers.' },
              { vs: 'vs. Ring', point: 'Full 24/7 professional monitoring with 14-second average response. Not just cameras — a complete security system.' },
            ].map((row) => (
              <div key={row.vs} className="flex items-start gap-3 bg-white/[0.03] rounded-lg border border-white/[0.06] p-4">
                <span className="text-emerald-500 text-[11px] font-bold uppercase tracking-wide bg-emerald-600/10 px-2 py-0.5 rounded flex-shrink-0 mt-0.5">
                  {row.vs}
                </span>
                <p className="text-white/60 text-[13px]">{row.point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Pricing ═══ */}
      <section className="py-10 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6 md:p-8">
            <h2 className="text-center text-[18px] md:text-[22px] font-bold text-white mb-5">
              No surprises. Here&apos;s what it costs.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Down payment', value: '$0', sub: 'Nothing upfront' },
                { label: 'Monitoring', value: '$19.95', sub: 'per month*' },
                { label: 'Installation', value: 'Free', sub: 'Professional setup' },
                { label: 'Commitment', value: 'None', sub: 'Cancel anytime' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-white/50 text-[10px] uppercase tracking-wider font-medium mb-1">{item.label}</p>
                  <p className="text-white font-extrabold text-[20px] md:text-[24px]">{item.value}</p>
                  <p className="text-white/45 text-[11px]">{item.sub}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-white/40 text-[11px] mt-5">
              *Starting price with qualifying system. Most homeowners pay $29–$45/month depending on package. Your advisor builds a quote for your home.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <div className="border-t border-white/[0.04]">
        <FAQSection
          faqs={faqs}
          title="Before you decide"
          darkMode
        />
      </div>

      {/* ═══ Final CTA ═══ */}
      <section className="py-14 bg-[#0d1b30]/80 border-t border-white/[0.04] text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-600/[0.04] rounded-full blur-[100px]" />
        <div className="max-w-md mx-auto px-4 relative">
          <h2 className="text-[20px] md:text-[26px] font-extrabold text-white mb-3 tracking-tight">
            Your free quote takes 30 seconds
          </h2>
          <p className="text-white/55 text-[13px] mb-7">
            $0 down. Free doorbell camera. Installed by a certified tech in under 2 hours.
          </p>
          <button
            onClick={onCTAClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-[14px] transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-600/20 w-full sm:w-auto"
          >
            Get My Free Quote <ChevronRight size={16} className="inline ml-1" />
          </button>
          <div className="mt-4">
            <a
              href={`tel:${PHONE_RAW}`}
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/65 transition-colors text-[12px]"
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
          <p className="text-white/40 text-[11px]">
            © {new Date().getFullYear()} ShieldHome Pro — Authorized Vivint Smart Home Dealer | {PHONE}
          </p>
          <p className="text-white/30 text-[10px] mt-1 max-w-md mx-auto">
            ShieldHome Pro is an independently operated authorized dealer. Vivint® is a registered trademark of Vivint Smart Home, Inc.
          </p>
        </div>
      </footer>

      {/* Spacer for sticky CTA on mobile */}
      <div className="h-16 md:h-12" />

      {/* ═══ Sticky CTA ═══ */}
      <StickyPhoneCTA onQuizOpen={onCTAClick} darkMode />
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

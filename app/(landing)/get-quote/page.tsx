'use client'

import { Suspense, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import GetQuoteForm from '@/components/landing/GetQuoteForm'
import TestimonialCarousel from '@/components/landing/TestimonialCarousel'
import FAQSection from '@/components/landing/FAQSection'
import StickyPhoneCTA from '@/components/landing/StickyPhoneCTA'
import {
  Shield, Phone, CheckCircle, Star, ShieldCheck, Users, Zap,
  Camera, DoorOpen, Lock, Monitor,
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
    date: 'Mar 2026',
    rating: 5,
    text: "We finally feel safe when we travel. Setup took less than 2 hours and the app lets me check cameras from anywhere. The peace of mind is worth every penny.",
    initials: 'SM',
    color: 'bg-purple-500',
    source: 'Google',
  },
  {
    name: 'Jason R.',
    location: 'Sandy, UT',
    date: 'Feb 2026',
    rating: 5,
    text: "The AI cameras actually detect people vs animals. Way better than our old Ring setup — no more false alerts at 3am. Professional installation was seamless.",
    initials: 'JR',
    color: 'bg-blue-500',
    source: 'Google',
  },
  {
    name: 'Maria L.',
    location: 'Provo, UT',
    date: 'Jan 2026',
    rating: 5,
    text: "As a single mom, knowing my kids are safe after school gives me so much peace of mind. I can see them walk in the door from my phone at work. Vivint was the best decision.",
    initials: 'ML',
    color: 'bg-pink-500',
    source: 'Google',
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
  { name: 'Free Doorbell Camera', desc: '180° HDR video, 24/7 recording, package detection', icon: DoorOpen },
  { name: 'AI Outdoor Camera', desc: 'Person/vehicle detection, color night vision, 2-way audio', icon: Camera },
  { name: 'Smart Lock + Keypad', desc: 'Keyless entry, guest codes, auto-lock, activity log', icon: Lock },
  { name: '24/7 Monitoring Panel', desc: '7" touchscreen, Google/Alexa built-in, full control', icon: Monitor },
]

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
      <header className="sticky top-0 z-50 bg-[#0a1628]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <Shield className="text-[#00C853]" size={22} />
              <div>
                <div className="font-bold text-white text-sm leading-none">ShieldHome Pro</div>
                <div className="text-[10px] text-white/40">Authorized Vivint Dealer</div>
              </div>
            </div>
            <a
              href={`tel:${PHONE_RAW}`}
              className="flex items-center gap-1.5 bg-[#00C853] hover:bg-[#00A846] text-white px-3 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              <Phone size={14} />
              <span className="hidden sm:inline">{PHONE}</span>
              <span className="sm:hidden">Call Now</span>
            </a>
          </div>
        </div>
      </header>

      {/* ═══ Hero + Form (Above the Fold) ═══ */}
      <section id="quote-form" className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#00C853]/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 pt-8 pb-12 md:pt-12 md:pb-16 relative">
          <div className="grid md:grid-cols-[1fr,380px] gap-8 md:gap-10 items-start">
            {/* Left: Copy */}
            <div className="text-center md:text-left">
              <p className="text-[#00C853] font-bold text-xs uppercase tracking-widest mb-3">
                VIVINT AUTHORIZED SMART HOME DEALER
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                {headline}
              </h1>
              <p className="text-white/60 text-base md:text-lg mb-6 max-w-lg">
                Free expert installation + 24/7 professional monitoring. Most homes fully protected within 48 hours. <strong className="text-white">See your custom quote in 60 seconds.</strong>
              </p>

              {/* Trust bar — desktop only (below form on mobile) */}
              <div className="hidden md:flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50 mb-6">
                <span className="flex items-center gap-1.5">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-semibold">4.8/5</span> from 58,000+ reviews
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[#00C853]" /> BBB A+ Rated
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={13} className="text-[#00C853]" /> 2M+ homes protected
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap size={13} className="text-[#00C853]" /> Installed in 24–48 hrs
                </span>
              </div>

              {/* Secondary CTA — desktop */}
              <div className="hidden md:block">
                <a
                  href={`tel:${PHONE_RAW}`}
                  className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
                >
                  <Phone size={14} />
                  Or call now: {PHONE} — Free consultation, no obligation
                </a>
              </div>
            </div>

            {/* Right: Form */}
            <GetQuoteForm />
          </div>

          {/* Trust bar — mobile only */}
          <div className="md:hidden flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] text-white/50 mt-6">
            <span className="flex items-center gap-1">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white font-medium">4.8/5</span> 58K+ reviews
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={11} className="text-[#00C853]" /> BBB A+
            </span>
            <span className="flex items-center gap-1">
              <Users size={11} className="text-[#00C853]" /> 2M+ homes
            </span>
            <span className="flex items-center gap-1">
              <Zap size={11} className="text-[#00C853]" /> 24–48hr install
            </span>
          </div>

          {/* Secondary CTA — mobile */}
          <div className="md:hidden text-center mt-4">
            <a
              href={`tel:${PHONE_RAW}`}
              className="text-white/40 hover:text-white/60 transition-colors text-xs"
            >
              Or call: {PHONE} — No obligation
            </a>
          </div>
        </div>
      </section>

      {/* ═══ What's Included — Equipment Grid ═══ */}
      <section className="py-12 bg-[#0d1b30] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-[#00C853] font-bold text-xs uppercase tracking-widest mb-2">WHAT&apos;S INCLUDED</p>
          <h2 className="text-center text-xl md:text-2xl font-extrabold text-white mb-8">
            Your Custom Security System
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {equipment.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.name}
                  className="bg-white/5 rounded-xl border border-white/5 p-4 text-center hover:border-[#00C853]/20 transition-colors"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mx-auto mb-3 text-[#00C853]">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-white text-xs mb-1">{item.name}</h3>
                  <p className="text-white/40 text-[11px] leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ March Special Offer Banner ═══ */}
      <section className="bg-[#00C853] py-5">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-sm md:text-base">
              March Special: Free Doorbell Camera + Free Installation + $0 Down
            </p>
            <p className="text-white/80 text-xs">Limited installation slots available this month</p>
          </div>
          <button
            onClick={onCTAClick}
            className="bg-white text-[#00C853] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors whitespace-nowrap flex-shrink-0"
          >
            Check Availability
          </button>
        </div>
      </section>

      {/* ═══ Testimonials ═══ */}
      <div className="bg-[#0a1628]">
        <TestimonialCarousel testimonials={testimonials} />
      </div>

      {/* ═══ Pricing Transparency ═══ */}
      <section className="py-10 bg-[#0d1b30] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-white mb-3">Simple, Transparent Pricing</h2>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-[#00C853]" /> $0 down
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-[#00C853]" /> Monitoring from $19.95/mo
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-[#00C853]" /> Free professional installation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-[#00C853]" /> No long-term commitment
            </span>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <div className="bg-[#0a1628]">
        <FAQSection
          faqs={faqs}
          title="Frequently Asked Questions"
          subtitle="Everything you need to know"
        />
      </div>

      {/* ═══ Final CTA ═══ */}
      <section className="py-12 bg-[#0d1b30] border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-[#00C853] font-bold text-xs uppercase tracking-widest mb-3">
            LIMITED INSTALLATION SLOTS THIS WEEK
          </p>
          <h2 className="text-xl md:text-2xl font-extrabold text-white mb-3">
            Get Your Free Quote Now
          </h2>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            $0 down. Free doorbell camera. Professional installation in 24–48 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onCTAClick}
              className="bg-[#00C853] hover:bg-[#00A846] text-white px-8 py-4 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Check Availability →
            </button>
            <a
              href={`tel:${PHONE_RAW}`}
              className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors text-sm"
            >
              <Phone size={14} />
              Or call: {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* ═══ Footer (minimal) ═══ */}
      <footer className="bg-[#070e1a] py-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} ShieldHome Pro — Authorized Vivint Smart Home Dealer | {PHONE}
          </p>
          <p className="text-white/20 text-[10px] mt-1 max-w-lg mx-auto">
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

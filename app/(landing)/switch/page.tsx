'use client'

import { Suspense, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import SwitchForm from '@/components/landing/SwitchForm'
import SavingsComparison from '@/components/landing/SavingsComparison'
import HowItWorks from '@/components/landing/HowItWorks'
import TestimonialCarousel from '@/components/landing/TestimonialCarousel'
import FAQSection from '@/components/landing/FAQSection'
import StickyPhoneCTA from '@/components/landing/StickyPhoneCTA'
import ExitIntentPopup from '@/components/landing/ExitIntentPopup'
import { Shield, Phone, CheckCircle, ClipboardList, Wrench, Camera, Smartphone, Lock, DoorOpen } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

// DTR Headlines for Google Ads keyword matching
const HEADLINES: Record<string, string> = {
  'cancel-adt': "Switching from ADT? We'll Pay Up to $1,000 to Buy Out Your Contract",
  'adt-alternative': "The Best ADT Alternative — Plus We'll Buy Out Your Contract",
  'no-contract': 'Home Security With No Long-Term Contract — Plus Up to $1,000 Buyout',
  'switch-security': 'Switch Home Security Providers — We Cover Up to $1,000 in Cancellation Fees',
}
const DEFAULT_HEADLINE = "We'll Pay Up to $1,000 to Buy Out Your Security Contract"

// Custom HowItWorks steps for the switch page
const switchSteps = [
  {
    icon: <ClipboardList size={28} />,
    title: 'Tell Us About Your System',
    description: 'Takes 60 seconds. We\'ll assess your current setup and design your upgrade.',
  },
  {
    icon: <Phone size={28} />,
    title: 'We Design Your New System',
    description: 'Free, no-obligation security assessment. We calculate your buyout amount and design a custom Vivint system.',
  },
  {
    icon: <Wrench size={28} />,
    title: 'We Install & Pay Your Cancellation Fee',
    description: 'Professional installation, usually under 2 hours. We handle your contract cancellation and cover up to $1,000.',
  },
]

// Custom testimonials for switch leads
const switchTestimonials = [
  {
    name: 'Sarah M.',
    location: 'Provo, UT',
    date: 'Feb 2026',
    rating: 5,
    text: "I was paying $58/month with ADT and had 14 months left. ShieldHome covered my $650 cancellation fee, installed a full Vivint system the next day, and I'm saving $15/month.",
    initials: 'SM',
    color: 'bg-purple-500',
    source: 'Google',
  },
  {
    name: 'Marcus T.',
    location: 'Gilbert, AZ',
    date: 'Jan 2026',
    rating: 5,
    text: "Switching from SimpliSafe was the best decision. The Vivint cameras are miles ahead — actual AI detection instead of constant false alerts. And they covered my remaining contract.",
    initials: 'MT',
    color: 'bg-blue-500',
    source: 'Google',
  },
  {
    name: 'Jennifer K.',
    location: 'Frisco, TX',
    date: 'Mar 2026',
    rating: 5,
    text: "I was stuck in a Brinks contract with outdated equipment. ShieldHome handled everything — cancellation, installation, the whole switch. Took about 2 hours and my system is incredible now.",
    initials: 'JK',
    color: 'bg-pink-500',
    source: 'Google',
  },
]

// Custom FAQs for the switch page
const switchFaqs = [
  {
    q: 'How does the contract buyout work?',
    a: "When you switch to Vivint through ShieldHome.pro, Vivint covers up to $1,000 of your existing contract's early termination fee. We handle the paperwork — you don't pay your old provider's cancellation fee out of pocket. The buyout amount is applied as a credit toward your new system.",
  },
  {
    q: "Is this really free? What's the catch?",
    a: "No catch. Vivint invests in earning your business because their technology keeps customers for years. Here's exactly what you'll pay: your monthly monitoring rate (starting at $33/mo) and any equipment costs above what's included in your package. The buyout, installation, and system design consultation are all free.",
  },
  {
    q: 'What if I still have equipment from my old provider?',
    a: "In most cases, your existing wiring and sensors can be reused with your new Vivint system, which saves time and keeps installation clean. We assess everything during your free consultation before you commit to anything.",
  },
  {
    q: 'How long does switching take?',
    a: 'Most switches are completed in a single visit, typically under 2 hours. We schedule installation at your convenience and your new system is live before your old service ends — zero gap in protection.',
  },
  {
    q: 'Will I lose protection during the switch?',
    a: 'Never. We coordinate the timing so your new Vivint system is installed and active before your previous service is disconnected. There\'s no gap in coverage.',
  },
  {
    q: "What if I'm not happy with Vivint?",
    a: "Vivint offers a satisfaction guarantee during your initial service period. If the system isn't what you expected, we'll work with you to make it right or help you explore other options.",
  },
]

// Equipment items
const equipment = [
  { name: 'Outdoor Camera Pro', desc: 'AI-powered detection, full color night vision', icon: <Camera size={32} /> },
  { name: 'Doorbell Camera Pro', desc: '24/7 recording, no Wi-Fi required for storage', icon: <DoorOpen size={32} /> },
  { name: 'Smart Hub', desc: '7-inch touchscreen, full system control', icon: <Smartphone size={32} /> },
  { name: 'Smart Lock', desc: 'Keyless entry, auto-lock, remote access', icon: <Lock size={32} /> },
]

function scrollToForm() {
  document.getElementById('switch-form')?.scrollIntoView({ behavior: 'smooth' })
}

function SwitchContent() {
  const searchParams = useSearchParams()
  const kw = searchParams.get('kw') || ''
  const headline = HEADLINES[kw] || DEFAULT_HEADLINE

  const onCTAClick = useCallback(() => scrollToForm(), [])

  // Fire ViewContent on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ((window as any).fbq) {
        (window as any).fbq('track', 'ViewContent', { content_name: 'switch_page' })
      }
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({ event: 'page_view', page_type: 'switch' })
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="text-[#00C853]" size={28} />
              <div>
                <div className="font-bold text-[#1A1A2E] text-lg leading-none">ShieldHome Pro</div>
                <div className="text-xs text-gray-500">Authorized Vivint Smart Home Dealer</div>
              </div>
            </div>
            <a
              href={`tel:${PHONE_NUMBER_RAW}`}
              className="flex items-center gap-2 bg-[#00C853] hover:bg-[#00A846] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              <Phone size={16} />
              <span className="hidden sm:inline">{PHONE_NUMBER}</span>
              <span className="sm:hidden">Call Now</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#1A1A2E] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#00C853] font-bold text-sm uppercase tracking-widest mb-4">
            STUCK IN A SECURITY CONTRACT?
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            {headline}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Switch to a Vivint smart home system with professional installation, better equipment, and no long-term commitment. We handle everything.
          </p>

          <button
            onClick={onCTAClick}
            className="bg-[#00C853] hover:bg-[#00A846] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-green-900/30 mb-8"
          >
            See If You Qualify →
          </button>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-300">
            {[
              'Up to $1,000 Buyout',
              'Free Installation',
              'No Long-Term Contract',
              'Average Switch Time: Under 2 Hours',
            ].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-[#00C853]" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Switch Form */}
      <section id="switch-form" className="py-16 bg-[#F8F9FA]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A2E] mb-2">
              Check Your Buyout Eligibility
            </h2>
            <p className="text-gray-600">Takes 60 seconds. No pressure, no obligation.</p>
          </div>
          <SwitchForm />
        </div>
      </section>

      {/* How Switching Works */}
      <HowItWorks
        title="How Switching Works"
        subtitle="We make it simple — here's how it works"
        steps={switchSteps}
        footer="Most switches are completed in a single visit, usually under 2 hours"
      />

      {/* Savings Comparison */}
      <SavingsComparison />

      {/* Testimonials */}
      <TestimonialCarousel testimonials={switchTestimonials} />

      {/* Equipment Showcase */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
              Your New Equipment
            </h2>
            <p className="text-gray-600">Latest-generation Vivint smart home technology</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {equipment.map((item) => (
              <div
                key={item.name}
                className="bg-white rounded-xl border border-gray-200 p-6 text-center"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#1A1A2E]">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#1A1A2E] mb-1 text-sm md:text-base">{item.name}</h3>
                <p className="text-gray-500 text-xs md:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        faqs={switchFaqs}
        title="Contract Buyout FAQ"
        subtitle="Everything you need to know about switching"
      />

      {/* Final CTA */}
      <section className="bg-[#1A1A2E] py-12 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Stop Overpaying for Outdated Security
          </h2>
          <p className="text-gray-400 mb-6">
            Limited buyout slots available this month. Check your eligibility in 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onCTAClick}
              className="bg-[#00C853] hover:bg-[#00A846] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors w-full sm:w-auto"
            >
              See If You Qualify →
            </button>
            <a
              href={`tel:${PHONE_NUMBER_RAW}`}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <Phone size={16} />
              <span>Or call now: {PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 pb-24 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <p className="font-semibold text-white">ShieldHome Pro — Authorized Vivint Smart Home Dealer</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms" className="hover:text-white">Terms of Service</a>
          </div>
          <p className="text-xs max-w-2xl mx-auto">
            ShieldHome Pro is an independently operated authorized dealer of Vivint Smart Home products and services.
            Vivint® is a registered trademark of Vivint Smart Home, Inc.
          </p>
          <p className="text-xs">© {new Date().getFullYear()} ShieldHome Pro. All rights reserved.</p>
        </div>
      </footer>

      {/* Sticky CTAs */}
      <StickyPhoneCTA onQuizOpen={onCTAClick} />
      <ExitIntentPopup onQuizOpen={onCTAClick} />
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

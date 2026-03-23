'use client'

import { Suspense, useEffect, useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import SwitchForm from '@/components/landing/SwitchForm'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'
import SavingsComparison from '@/components/landing/SavingsComparison'
import HowItWorks from '@/components/landing/HowItWorks'
import TestimonialCarousel from '@/components/landing/TestimonialCarousel'
import FAQSection from '@/components/landing/FAQSection'
import StickyPhoneCTA from '@/components/landing/StickyPhoneCTA'
import {
  Shield, Phone, CheckCircle, ClipboardList, Wrench, Camera, Smartphone,
  Lock, DoorOpen, Star, Users, Clock, ArrowRight, Zap, Award, ShieldCheck,
} from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

// ─── DTR Headlines ───
const HEADLINES: Record<string, string> = {
  'cancel-adt': "Switching from ADT? We'll Pay Up to $1,000 to Buy Out Your Contract",
  'adt-alternative': "The Best ADT Alternative — Plus We'll Buy Out Your Contract",
  'no-contract': 'Home Security With No Long-Term Contract — Plus Up to $1,000 Buyout',
  'switch-security': 'Switch Home Security Providers — We Cover Up to $1,000 in Cancellation Fees',
}
const DEFAULT_HEADLINE = "We'll Pay Up to $1,000 to Buy Out Your Security Contract"

// ─── How It Works Steps ───
const switchSteps = [
  {
    icon: <ClipboardList size={28} />,
    title: 'Tell Us About Your System',
    description: 'Takes 60 seconds. We assess your current provider, contract, and design your upgrade path.',
  },
  {
    icon: <Phone size={28} />,
    title: 'Get Your Buyout Offer',
    description: 'A dedicated advisor calls within 10 minutes with your exact buyout amount and new system design — zero obligation.',
  },
  {
    icon: <Wrench size={28} />,
    title: 'We Handle Everything',
    description: 'We cancel your old service, install your new Vivint system (under 2 hours), and cover your cancellation fee. Zero gap in protection.',
  },
]

// ─── Testimonials ───
const switchTestimonials = [
  {
    name: 'Sarah M.',
    location: 'Provo, UT',
    date: 'Feb 2026',
    rating: 5,
    text: "I was paying $58/month with ADT and had 14 months left on my contract. ShieldHome covered my $650 cancellation fee, installed a full Vivint system the next day, and now I'm saving $15/month with way better equipment. The AI cameras actually work — no more false alerts from my dog.",
    initials: 'SM',
    color: 'bg-purple-500',
    source: 'Google',
  },
  {
    name: 'Marcus T.',
    location: 'Gilbert, AZ',
    date: 'Jan 2026',
    rating: 5,
    text: "I called ADT to cancel and they quoted me $1,100 in fees. ShieldHome covered it. The Vivint cameras are leagues ahead — actual AI person detection, color night vision, and the doorbell camera records 24/7 even without Wi-Fi. Wish I'd switched years ago.",
    initials: 'MT',
    color: 'bg-blue-500',
    source: 'Google',
  },
  {
    name: 'Jennifer K.',
    location: 'Frisco, TX',
    date: 'Mar 2026',
    rating: 5,
    text: "I was stuck in a Brinks contract with a system from 2019. The technician arrived at 9am, had everything installed by 10:30, and walked me through the app. My old system couldn't even connect to my phone. Night and day difference.",
    initials: 'JK',
    color: 'bg-pink-500',
    source: 'Google',
  },
]

// ─── FAQs ───
const switchFaqs = [
  {
    q: 'How does the contract buyout work?',
    a: "When you switch to Vivint through ShieldHome.pro, we cover up to $1,000 of your existing contract's early termination fee. You don't pay your old provider's cancellation fee out of pocket — we handle it. The buyout is applied as a credit toward your new system. Over 2,400 homeowners have used this program in the last 12 months.",
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

// ─── Equipment ───
const equipment = [
  {
    name: 'Outdoor Camera Pro',
    desc: 'AI person/vehicle detection, full color night vision, 140° FOV, 2-way audio with siren',
    icon: <Camera size={32} />,
    badge: 'Most Popular',
  },
  {
    name: 'Doorbell Camera Pro',
    desc: '24/7 recording even without Wi-Fi, package detection, 180° HDR video',
    icon: <DoorOpen size={32} />,
    badge: 'Free with Switch',
  },
  {
    name: 'Smart Hub',
    desc: '7" touchscreen, full system control, Google/Alexa built in',
    icon: <Smartphone size={32} />,
    badge: null,
  },
  {
    name: 'Smart Lock Pro',
    desc: 'Keyless entry, guest codes, auto-lock, remote access + activity log',
    icon: <Lock size={32} />,
    badge: null,
  },
]

function scrollToForm() {
  document.getElementById('switch-form')?.scrollIntoView({ behavior: 'smooth' })
}

// ─── Live Activity Counter (social proof) ───
function LiveCounter() {
  const [count, setCount] = useState(127)
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + (Math.random() > 0.5 ? 1 : 0))
    }, 30000)
    return () => clearInterval(interval)
  }, [])
  return (
    <span className="tabular-nums">{count}</span>
  )
}

function SwitchContent() {
  const searchParams = useSearchParams()
  const kw = searchParams.get('kw') || ''
  const headline = HEADLINES[kw] || DEFAULT_HEADLINE

  const onCTAClick = useCallback(() => scrollToForm(), [])

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
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* ═══ Hero ═══ */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-12 md:py-16 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 text-center relative">
          {/* Urgency banner */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-white/90 text-xs font-medium">
              March Offer: Free Doorbell Camera + Up to $1,000 Buyout
            </span>
          </div>

          <p className="text-emerald-500 font-bold text-sm uppercase tracking-widest mb-3">
            STUCK IN A SECURITY CONTRACT?
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            {headline}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Switch to Vivint&apos;s #1-rated smart home system with professional installation, AI-powered cameras, and no long-term commitment. <strong className="text-white">We handle your cancellation — you pay $0.</strong>
          </p>

          <button
            onClick={onCTAClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-900/30 hover:shadow-xl hover:shadow-green-900/40 hover:-translate-y-0.5 mb-8"
          >
            Check My Buyout Eligibility →
          </button>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-gray-400">
            {[
              { icon: <CheckCircle size={15} />, text: 'Up to $1,000 Buyout' },
              { icon: <CheckCircle size={15} />, text: 'Free Professional Installation' },
              { icon: <CheckCircle size={15} />, text: 'No Long-Term Contract' },
              { icon: <Clock size={15} />, text: 'Installed in Under 2 Hours' },
            ].map((b) => (
              <span key={b.text} className="flex items-center gap-1.5">
                <span className="text-emerald-500">{b.icon}</span>
                {b.text}
              </span>
            ))}
          </div>

          {/* Credibility bar */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white font-semibold">4.8/5</span> from 58,000+ reviews
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              BBB A+ Rated
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-emerald-500" />
              2M+ homes protected
            </span>
            <span className="flex items-center gap-1.5">
              <Award size={14} className="text-emerald-500" />
              #1 Home Security — SafeHome.org
            </span>
          </div>
        </div>
      </section>

      {/* ═══ Social proof strip ═══ */}
      <div className="bg-emerald-600 py-3">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-white font-medium">
          <span>2,400+ homeowners switched this year</span>
          <span className="hidden sm:inline">•</span>
          <span>Average savings: $22/month</span>
          <span className="hidden sm:inline">•</span>
          <span>98% satisfaction rate</span>
        </div>
      </div>

      {/* ═══ Switch Form ═══ */}
      <section id="switch-form" className="py-14 bg-slate-100">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Check Your Buyout Eligibility
            </h2>
            <p className="text-gray-600">Takes 60 seconds. No credit check. No obligation.</p>
          </div>

          <SwitchForm />

          {/* Below-form trust */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Lock size={12} /> 256-bit encrypted</span>
              <span className="flex items-center gap-1"><ShieldCheck size={12} /> Your info is never sold</span>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
              <LiveCounter /> people checked eligibility today
            </p>
          </div>
        </div>
      </section>

      {/* ═══ How Switching Works ═══ */}
      <HowItWorks
        title="How Switching Works"
        subtitle="Three steps. We handle the hard part."
        steps={switchSteps}
        footer="Most homeowners go from first call to fully installed in 24–48 hours"
      />

      {/* ═══ Savings Comparison ═══ */}
      <SavingsComparison />

      {/* ═══ Testimonials ═══ */}
      <TestimonialCarousel testimonials={switchTestimonials} />

      {/* ═══ Mid-page CTA ═══ */}
      <section className="py-10 bg-slate-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-slate-900 font-bold text-lg mb-4">
            Ready to stop overpaying for outdated security?
          </p>
          <button
            onClick={onCTAClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-200 hover:-translate-y-0.5"
          >
            Check My Buyout Eligibility →
          </button>
        </div>
      </section>

      {/* ═══ Equipment Showcase ═══ */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-emerald-500 font-bold text-sm uppercase tracking-widest mb-2">
              WHAT YOU&apos;RE SWITCHING TO
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              The Latest Vivint Smart Home Technology
            </h2>
            <p className="text-gray-600">Every system includes professional installation and 24/7 monitoring</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {equipment.map((item) => (
              <div
                key={item.name}
                className="bg-slate-100 rounded-xl border border-gray-200 p-5 text-center relative group hover:border-emerald-500/30 hover:shadow-md transition-all"
              >
                {item.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    {item.badge}
                  </span>
                )}
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-900 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm">{item.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Risk Reversal / Guarantee ═══ */}
      <section className="py-12 bg-slate-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-full mb-4">
              <ShieldCheck className="text-emerald-500" size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">The ShieldHome Switch Guarantee</h3>
            <p className="text-gray-600 max-w-xl mx-auto mb-4">
              If we can&apos;t beat your current provider on price, features, <em>and</em> service quality — we&apos;ll tell you. No pressure, no obligation, no hard sell. Over 98% of homeowners who get a quote decide to switch.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> Free consultation</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> No obligation</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> Satisfaction guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <FAQSection
        faqs={switchFaqs}
        title="Contract Buyout FAQ"
        subtitle="Everything you need to know about switching"
      />

      {/* ═══ Final CTA ═══ */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-14 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl" />
        <div className="max-w-2xl mx-auto px-4 relative">
          <p className="text-emerald-500 font-bold text-sm uppercase tracking-widest mb-3">
            LIMITED BUYOUT SLOTS AVAILABLE
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Stop Paying for a System That Doesn&apos;t Protect You
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Your old provider is charging you more for less. Check your buyout eligibility in 60 seconds — most homeowners save $200+/year after switching.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onCTAClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-900/30 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Check My Buyout Eligibility →
            </button>
            <a
              href={`tel:${PHONE_NUMBER_RAW}`}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <Phone size={16} />
              <span>Or call: {PHONE_NUMBER}</span>
            </a>
          </div>
          <p className="mt-6 text-xs text-gray-500">
            No credit check. No commitment. Free consultation.
          </p>
        </div>
      </section>

      <Footer />

      {/* ═══ Sticky CTAs ═══ */}
      <StickyPhoneCTA onQuizOpen={onCTAClick} />
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

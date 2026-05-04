'use client'

import { Suspense, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import UpgradeForm from '@/components/landing/UpgradeForm'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'
import TestimonialCarousel from '@/components/landing/TestimonialCarousel'
import FAQSection from '@/components/landing/FAQSection'
import StickyPhoneCTA from '@/components/landing/StickyPhoneCTA'
import { Shield, Phone, CheckCircle, Camera, DoorOpen, Flashlight, Lock, Wrench, Tag } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

const HEADLINES: Record<string, string> = {
  'vivint-camera': 'Upgrade Your Vivint Cameras — Buy 2, Get 1 Free',
  'vivint-upgrade': 'Upgrade Your Vivint System — Save Up to $500 on New Equipment',
  'vivint-doorbell': 'Upgrade to the New Vivint Doorbell Pro — Records 24/7 Without Wi-Fi',
  'add-camera': 'Add Cameras to Your Vivint System — Buy 2, Get 1 Free',
}
const DEFAULT_HEADLINE = 'Upgrade Your Vivint System — Buy 2 Cameras, Get 1 Free'

const upgradeTestimonials = [
  {
    name: 'Ryan H.',
    location: 'South Jordan, UT',
    date: 'Feb 2026',
    rating: 5,
    text: "I added two outdoor cameras and got the third free. The new cameras are leagues better than my originals from 3 years ago — the night vision alone is worth the upgrade.",
    initials: 'RH',
    color: 'bg-blue-500',
    source: 'Google',
  },
  {
    name: 'Nicole P.',
    location: 'Herriman, UT',
    date: 'Mar 2026',
    rating: 5,
    text: "The new doorbell camera records even when my internet drops. That was my biggest frustration with the old one. Upgrade took about 45 minutes.",
    initials: 'NP',
    color: 'bg-purple-500',
    source: 'Google',
  },
]

const upgradeFaqs = [
  {
    q: 'Which cameras qualify for the buy 2 get 1 free deal?',
    a: "The Outdoor Camera Pro, Indoor Camera, and Doorbell Camera Pro all qualify. Mix and match — for example, buy 2 outdoor cameras and get a free indoor camera, or any combination that works for your home.",
  },
  {
    q: 'Can I add new cameras to my existing Vivint plan?',
    a: "Yes — new equipment integrates seamlessly with your existing Vivint system and app. Your technician handles all the configuration. Your monitoring plan stays the same; you just get more coverage.",
  },
  {
    q: 'How does the $500 equipment credit work?',
    a: "The credit applies to any new Vivint equipment added to your system — cameras, smart locks, sensors, panels, or other devices. Your ShieldHome advisor will help you design the upgrade that makes the most sense for your home and apply the maximum credit.",
  },
]

const equipment = [
  {
    name: 'Outdoor Camera Pro',
    icon: <Camera size={32} />,
    features: ['AI-powered person & vehicle detection', 'Full color night vision', '140° field of view', '2-way audio with built-in siren'],
    upgrade: 'vs. older models: 4x sharper night vision, AI detection, wider FOV',
  },
  {
    name: 'Doorbell Camera Pro',
    icon: <DoorOpen size={32} />,
    features: ['Records 24/7 — even when Wi-Fi goes down', 'Package detection alerts', '180° field of view', 'HDR video, day and night'],
    upgrade: 'vs. older models: no-Wi-Fi recording, package detection, HDR',
  },
  {
    name: 'Smart Deter Floodlight',
    icon: <Flashlight size={32} />,
    features: ['Tracks intruders with a spotlight', 'Audible deterrent (whistle + flash)', 'The camera that fights back'],
    upgrade: 'NEW product — active deterrence, not just recording',
  },
  {
    name: 'Smart Lock Pro',
    icon: <Lock size={32} />,
    features: ['Keyless entry with guest codes', 'Auto-lock when you leave', 'Remote lock/unlock from anywhere', 'Activity log for every entry'],
    upgrade: 'vs. older models: faster unlock, guest codes, activity log',
  },
]

function scrollToForm() {
  document.getElementById('upgrade-form')?.scrollIntoView({ behavior: 'smooth' })
}

function UpgradeContent() {
  const searchParams = useSearchParams()
  const kw = searchParams.get('kw') || ''
  const headline = HEADLINES[kw] || DEFAULT_HEADLINE

  const onCTAClick = useCallback(() => scrollToForm(), [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ((window as any).fbq) {
        (window as any).fbq('track', 'ViewContent', { content_name: 'upgrade_page' })
      }
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({ event: 'page_view', page_type: 'upgrade' })
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-slate-900 py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-emerald-500 font-bold text-sm uppercase tracking-widest mb-3">
                EXCLUSIVE OFFER FOR VIVINT CUSTOMERS
              </p>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {headline}
              </h1>
              <p className="text-gray-300 text-base md:text-lg mb-6">
                Plus save up to $500 on new equipment. Professional installation included.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-300">
                {['Vivint Smart Home Partner', 'Professional Installation', '4.8/5 — 58,000+ Reviews'].map((s) => (
                  <span key={s} className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-500" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="w-full h-56 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Camera size={48} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Product imagery placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="upgrade-form" className="py-12 bg-slate-100">
        <div className="max-w-md mx-auto px-4">
          <UpgradeForm />
        </div>
      </section>

      {/* Offer Details */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Current Offers</h2>
            <p className="text-gray-600">Exclusive savings for Vivint customers</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-100 rounded-2xl p-6 border border-gray-200 relative">
              <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Tag size={12} /> Save $299
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Buy 2 Cameras, Get 1 Free</h3>
              <p className="text-gray-600 text-sm mb-4">
                Add coverage to your blind spots. For every 2 cameras you add, we include a third one free.
              </p>
              <p className="text-gray-500 text-xs">
                Qualifying cameras: Outdoor Camera Pro, Indoor Camera, Doorbell Camera Pro
              </p>
            </div>
            <div className="bg-slate-100 rounded-2xl p-6 border border-gray-200 relative">
              <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Tag size={12} /> Save up to $500
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Up to $500 Off Equipment</h3>
              <p className="text-gray-600 text-sm mb-4">
                Upgrade your panel, add smart locks, new sensors, or expand your system — save up to $500.
              </p>
              <p className="text-gray-500 text-xs">
                Applies to any new Vivint equipment added to your existing system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Showcase */}
      <section className="py-14 bg-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">What&apos;s New</h2>
            <p className="text-gray-600">The latest Vivint equipment — major upgrades over older generations</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {equipment.map((item) => (
              <div key={item.name} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-900">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-sm text-center mb-3">{item.name}</h3>
                <ul className="space-y-1.5 flex-1">
                  {item.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <CheckCircle size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 pt-3 border-t border-gray-100 text-[10px] text-emerald-500 font-semibold">
                  {item.upgrade}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-full mb-4">
            <Wrench className="text-emerald-500" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Professional Installation Included</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            A certified Vivint technician handles everything. Most equipment upgrades are completed in under an hour.
            We&apos;ll configure your new devices, update your app, and make sure everything works perfectly with your existing system.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialCarousel testimonials={upgradeTestimonials} />

      {/* FAQ */}
      <FAQSection
        faqs={upgradeFaqs}
        title="Upgrade FAQ"
        subtitle="Common questions about equipment upgrades"
      />

      {/* Final CTA */}
      <section className="bg-slate-900 py-12 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Don&apos;t Let Outdated Equipment Be Your Weak Spot
          </h2>
          <p className="text-gray-400 mb-6">
            Claim your free camera and equipment savings before this offer ends.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onCTAClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors w-full sm:w-auto"
            >
              Claim My Upgrade →
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

      <Footer />

      <StickyPhoneCTA onQuizOpen={onCTAClick} />
    </div>
  )
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <UpgradeContent />
    </Suspense>
  )
}

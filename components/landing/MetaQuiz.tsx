'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Package, DoorOpen, Flame, Smartphone, Home, Building2, Building, Landmark,
  Lock, Award, CheckCircle, ChevronLeft, ChevronRight, Shield, Star, Phone,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTracking } from '@/lib/utm'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

// Quiz answer types
interface QuizAnswers {
  concern: string
  ownership: string
  homeType: string
  entryPoints: string
  timeline: string
}

interface ContactForm {
  firstName: string
  phone: string
  email: string
  zipCode: string
}

// Results testimonials
const quizTestimonials = [
  {
    name: 'Amanda L.',
    location: 'West Jordan, UT',
    text: "I took this quiz on a whim from a Facebook ad and ended up with a full Vivint system installed two days later. The whole process was shockingly easy.",
    rating: 5,
  },
  {
    name: 'Marcus D.',
    location: 'Orem, UT',
    text: "After my neighbor's car was broken into, I finally did something about it. Free installation, no money down, and the cameras are incredible.",
    rating: 5,
  },
]

export default function MetaQuiz() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<QuizAnswers>({
    concern: '',
    ownership: '',
    homeType: '',
    entryPoints: '',
    timeline: '',
  })
  const [contact, setContact] = useState<ContactForm>({
    firstName: '',
    phone: '',
    email: '',
    zipCode: '',
  })
  const [tcpaConsent, setTcpaConsent] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState('')

  // Renter waitlist
  const [showRenterOverlay, setShowRenterOverlay] = useState(false)
  const [renterEmail, setRenterEmail] = useState('')
  const [renterSubmitted, setRenterSubmitted] = useState(false)

  const totalSteps = 6
  const progressPercent = ((step - 1) / totalSteps) * 100

  // Auto-detect ZIP on step 6
  useEffect(() => {
    if (step === 6 && !contact.zipCode) {
      fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en')
        .then(r => r.json())
        .then(d => {
          if (d.postcode) setContact(c => ({ ...c, zipCode: d.postcode }))
        })
        .catch(() => {})
    }
  }, [step, contact.zipCode])

  function fireStepEvent(stepNum: number, answer?: string) {
    if (typeof window === 'undefined') return
    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'QuizStep', { step: stepNum, answer: answer || '' })
      if (stepNum === 1) {
        (window as any).fbq('track', 'InitiateCheckout', { content_name: 'meta_quiz_started' })
      }
    }
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'quiz_step', quiz_step: stepNum, answer: answer || '' })
    }
  }

  function selectAnswer(field: keyof QuizAnswers, value: string) {
    setAnswers(a => ({ ...a, [field]: value }))
    fireStepEvent(step, value)

    // Handle ownership conditional
    if (field === 'ownership' && value === 'RENT') {
      setShowRenterOverlay(true)
      return
    }

    // Auto-advance
    setTimeout(() => setStep(s => s + 1), 300)
  }

  function goBack() {
    if (step > 1) setStep(s => s - 1)
  }

  async function submitRenterEmail() {
    if (!renterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(renterEmail)) return
    try {
      const tracking = getTracking()
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Renter',
          email: renterEmail,
          phone: '0000000000',
          zipCode: '00000',
          segment: 'renter-waitlist',
          tcpaConsent: false,
          ...tracking,
          landingPage: '/quiz',
        }),
      })
    } catch {}
    setRenterSubmitted(true)
  }

  // Contact form validation
  const phoneDigits = contact.phone.replace(/\D/g, '')
  const isFormValid =
    contact.firstName.trim().length > 0 &&
    phoneDigits.length === 10 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) &&
    contact.zipCode.length >= 5 &&
    tcpaConsent

  function getQualificationHeadline(): string {
    const isOwner = answers.ownership === 'OWN'
    const isHouse = answers.homeType === 'HOUSE' || answers.homeType === 'TOWNHOME'
    const isAsap = answers.timeline === 'ASAP'

    if (isOwner && isHouse && isAsap) {
      return "Great news — you qualify for our best deal! Homeowners like you get $0 down, free equipment, and a free doorbell camera with expert setup."
    }
    if (isOwner && isHouse) {
      return "Good news — based on your answers, you qualify for exclusive savings on a Vivint smart home system."
    }
    return "Your personalized security recommendation is ready — where should we send it?"
  }

  async function handleSubmit() {
    if (!isFormValid || submitting) return
    setSubmitting(true)
    setShowLoading(true)
    setError('')

    // Fire form view → submit conversion
    fireStepEvent(6, 'submit')

    await new Promise(resolve => setTimeout(resolve, 2500))

    try {
      const tracking = getTracking()

      // Map quiz answers to API fields
      const timelineMap: Record<string, string> = {
        'ASAP': 'ASAP',
        '1-2-WEEKS': 'ONE_TWO_WEEKS',
        '1-3-MONTHS': 'ONE_MONTH',
        'RESEARCHING': 'JUST_RESEARCHING',
      }
      const homeTypeMap: Record<string, string> = {
        'HOUSE': 'HOUSE',
        'TOWNHOME': 'TOWNHOME',
        'APARTMENT': 'CONDO_APARTMENT',
        'CONDO': 'CONDO_APARTMENT',
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: contact.firstName,
          phone: phoneDigits,
          email: contact.email,
          zipCode: contact.zipCode,
          propertyType: homeTypeMap[answers.homeType] || 'HOUSE',
          homeownership: 'OWN',
          productsInterested: [answers.concern],
          timeline: timelineMap[answers.timeline] || 'ASAP',
          entryPoints: answers.entryPoints,
          segment: 'new-customer',
          tcpaConsent,
          ...tracking,
          landingPage: '/quiz',
          source: tracking.source || 'facebook',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')

      // Fire conversion events
      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Lead', { content_name: 'meta_quiz', value: 900, currency: 'USD' })
          ;(window as any).fbq('track', 'CompleteRegistration')
        }
        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: 'lead_submitted',
            lead_value: 900,
            segment: 'new-customer',
            source: 'meta-quiz',
            concern: answers.concern,
            timeline: answers.timeline,
          })
        }
        if ((window as any).gtag) {
          (window as any).gtag('event', 'conversion', { send_to: 'AW-18032237621/PeImCJX0lI0cELW4uJZD' })
        }
      }

      setShowLoading(false)
      setShowResults(true)
    } catch (err: any) {
      setShowLoading(false)
      setError(err.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  // ──────── Loading State ────────
  if (showLoading) {
    return (
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mb-6" />
            <p className="text-xl font-bold text-slate-900 mb-2">Analyzing your home security profile...</p>
            <p className="text-gray-500 text-sm">Building your personalized recommendation</p>
          </div>
        </div>
      </div>
    )
  }

  // ──────── Results Page ────────
  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto px-4 pb-16">
        {/* Recommendation Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <CheckCircle className="text-emerald-500" size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
              Your Recommended Vivint System
            </h2>
            <p className="text-gray-500">Based on your answers, here&apos;s your personalized security plan</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 text-white mb-6">
            <p className="text-emerald-500 font-bold text-sm uppercase tracking-widest mb-1">Recommended For You</p>
            <h3 className="text-xl font-bold mb-4">The Total Shield Package</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500 flex-shrink-0" /> Vivint Doorbell Camera Pro</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500 flex-shrink-0" /> 2x Outdoor Camera Pro (AI detection)</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500 flex-shrink-0" /> Smart Hub (7&quot; touchscreen)</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500 flex-shrink-0" /> Smart Lock (keyless entry)</li>
              <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500 flex-shrink-0" /> Door/window sensors for all entry points</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-2xl font-extrabold">Starting at $33/month</p>
              <p className="text-sm text-gray-400">with professional 24/7 monitoring</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-600 justify-center mb-6">
            <span className="flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500" /> Free installation</span>
            <span className="flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500" /> Free doorbell camera</span>
            <span className="flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500" /> 24/7 monitoring</span>
          </div>

          <div className="bg-emerald-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-slate-900 font-bold mb-1">A ShieldHome advisor will call you within 10 minutes</p>
            <p className="text-gray-600 text-sm">to discuss your personalized plan and current promotions</p>
          </div>
        </div>

        {/* Value Stack */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-1 text-center">Your Quiz Completion Bonuses</h3>
          <p className="text-gray-500 text-sm text-center mb-6">Exclusive offers for completing your security assessment</p>

          <div className="space-y-3">
            {[
              { title: 'The Perimeter Protection Pack', desc: '$100 in free sensors to cover every entry point', value: '$499' },
              { title: 'The Eagle Eye Camera Upgrade', desc: 'Buy 2 cameras, get 1 free', value: '$299' },
              { title: 'The First 90 Days Free', desc: '3 months of monitoring on us', value: '$150' },
              { title: 'Free Professional Installation', desc: 'Certified technician handles everything', value: '$499' },
            ].map((bonus) => (
              <div key={bonus.title} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm">{bonus.title}</p>
                  <p className="text-gray-600 text-xs">{bonus.desc}</p>
                </div>
                <span className="text-gray-400 text-xs line-through">{bonus.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">Total Package Value: <span className="line-through">$2,847</span></p>
            <p className="text-emerald-500 font-bold text-lg">Included with your personalized quote</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">What Others Are Saying</h3>
          <div className="space-y-4">
            {quizTestimonials.map((t) => (
              <div key={t.name} className="bg-slate-100 rounded-xl p-5">
                <div className="flex mb-2">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-3">&ldquo;{t.text}&rdquo;</p>
                <p className="text-gray-500 text-xs font-semibold">{t.name}, {t.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Footer */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Shield className="text-emerald-500" size={20} />
            <span className="font-semibold text-slate-900">Vivint Authorized Dealer</span>
          </div>
          <p className="text-gray-500 text-sm">Your advisor will call within 10 minutes</p>
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            <Phone size={18} />
            Call Now: {PHONE_NUMBER}
          </a>
        </div>
      </div>
    )
  }

  // ──────── Renter Overlay ────────
  if (showRenterOverlay) {
    return (
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          {renterSubmitted ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <CheckCircle className="text-emerald-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Thanks! We&apos;ll keep you posted.</h3>
              <p className="text-gray-500 text-sm">We&apos;ll email you as soon as renter options are available.</p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-slate-900 mb-2">We currently serve homeowners</h3>
              <p className="text-gray-600 text-sm mb-6">
                But that may change soon! Enter your email to be the first to know when renter options launch.
              </p>
              <input
                type="email"
                inputMode="email"
                value={renterEmail}
                onChange={(e) => setRenterEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none transition-all text-base mb-4"
              />
              <button
                onClick={submitRenterEmail}
                disabled={!renterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(renterEmail)}
                className={cn(
                  'w-full py-3 rounded-xl font-bold transition-all',
                  renterEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(renterEmail)
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                )}
              >
                Notify Me
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  // ──────── Quiz Steps ────────
  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {step > 1 && (
                <button onClick={goBack} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <ChevronLeft size={20} />
                </button>
              )}
              <span className="text-xs font-semibold text-gray-500">Step {step} of {totalSteps}</span>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step 1: Concern */}
        {step === 1 && (
          <div className="animate-[fadeInUp_0.3s_ease-out]">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">What matters most to you?</h2>
            <p className="text-gray-500 text-sm mb-6">Select your biggest security concern</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'PACKAGE_THEFT', label: 'Package Theft', icon: <Package size={32} /> },
                { value: 'BREAKINS', label: 'Break-ins / Burglary', icon: <DoorOpen size={32} /> },
                { value: 'FIRE_SMOKE', label: 'Fire & CO Detection', icon: <Flame size={32} /> },
                { value: 'SMART_HOME', label: 'Smart Home Control', icon: <Smartphone size={32} /> },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer('concern', opt.value)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 transition-all min-h-[120px]',
                    answers.concern === opt.value
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-500'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {opt.icon}
                  <span className="text-sm font-semibold text-center">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Own / Rent */}
        {step === 2 && (
          <div className="animate-[fadeInUp_0.3s_ease-out]">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">Do you own or rent your home?</h2>
            <p className="text-gray-500 text-sm mb-6">This helps us find the right options for you</p>
            <div className="space-y-3">
              {[
                { value: 'OWN', label: 'I Own My Home', icon: <Home size={24} /> },
                { value: 'RENT', label: 'I Rent', icon: <Building size={24} /> },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer('ownership', opt.value)}
                  className={cn(
                    'w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left',
                    answers.ownership === opt.value
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <div className="text-gray-500">{opt.icon}</div>
                  <span className="font-semibold text-slate-900">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Home Type */}
        {step === 3 && (
          <div className="animate-[fadeInUp_0.3s_ease-out]">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">What type of home do you live in?</h2>
            <p className="text-gray-500 text-sm mb-6">This helps us size your system correctly</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'HOUSE', label: 'House', icon: <Home size={32} /> },
                { value: 'TOWNHOME', label: 'Townhome', icon: <Building2 size={32} /> },
                { value: 'APARTMENT', label: 'Apartment', icon: <Building size={32} /> },
                { value: 'CONDO', label: 'Condo', icon: <Landmark size={32} /> },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer('homeType', opt.value)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 transition-all min-h-[120px]',
                    answers.homeType === opt.value
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-500'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {opt.icon}
                  <span className="text-sm font-semibold text-center">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Entry Points */}
        {step === 4 && (
          <div className="animate-[fadeInUp_0.3s_ease-out]">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">How many entry points does your home have?</h2>
            <p className="text-gray-500 text-sm mb-6">Doors, windows, and garage entries</p>
            <div className="space-y-3">
              {[
                { value: '1-3', label: '1–3 entry points' },
                { value: '4-6', label: '4–6 entry points' },
                { value: '7+', label: '7+ entry points' },
                { value: 'NOT_SURE', label: 'Not sure' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer('entryPoints', opt.value)}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 font-semibold transition-all text-center',
                    answers.entryPoints === opt.value
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-500'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Timeline */}
        {step === 5 && (
          <div className="animate-[fadeInUp_0.3s_ease-out]">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">How soon do you want protection?</h2>
            <p className="text-gray-500 text-sm mb-6">We&apos;ll match you with the right timing</p>
            <div className="space-y-3">
              {[
                { value: 'ASAP', label: 'ASAP', badge: 'Most Popular' },
                { value: '1-2-WEEKS', label: '1–2 weeks', badge: null },
                { value: '1-3-MONTHS', label: '1–3 months', badge: null },
                { value: 'RESEARCHING', label: 'Just researching', badge: null },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer('timeline', opt.value)}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 font-semibold transition-all text-center relative',
                    answers.timeline === opt.value
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-500'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {opt.label}
                  {opt.badge && (
                    <span className="absolute -top-2 right-3 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {opt.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Contact Form */}
        {step === 6 && (
          <div className="animate-[fadeInUp_0.3s_ease-out]">
            <div className="bg-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-slate-900 font-semibold text-sm">{getQualificationHeadline()}</p>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
              Where should we send your personalized security plan?
            </h2>
            <p className="text-gray-500 text-sm mb-6">We&apos;ll call you with your custom recommendation</p>

            <div className="space-y-4 mb-6">
              <div>
                <input
                  type="text"
                  autoComplete="given-name"
                  value={contact.firstName}
                  onChange={(e) => setContact(c => ({ ...c, firstName: e.target.value }))}
                  onBlur={() => setTouched(t => ({ ...t, firstName: true }))}
                  placeholder="First Name"
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none transition-all text-base',
                    touched.firstName && !contact.firstName.trim() ? 'border-red-300' : 'border-gray-300'
                  )}
                />
              </div>
              <div>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={contact.phone}
                  onChange={(e) => setContact(c => ({ ...c, phone: formatPhone(e.target.value) }))}
                  onBlur={() => setTouched(t => ({ ...t, phone: true }))}
                  placeholder="Phone Number"
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none transition-all text-base',
                    touched.phone && phoneDigits.length !== 10 ? 'border-red-300' : 'border-gray-300'
                  )}
                />
              </div>
              <div>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={contact.email}
                  onChange={(e) => setContact(c => ({ ...c, email: e.target.value }))}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  placeholder="Email Address"
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none transition-all text-base',
                    touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? 'border-red-300' : 'border-gray-300'
                  )}
                />
              </div>
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={contact.zipCode}
                  onChange={(e) => setContact(c => ({ ...c, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                  onBlur={() => setTouched(t => ({ ...t, zipCode: true }))}
                  placeholder="ZIP Code"
                  maxLength={5}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none transition-all text-base',
                    touched.zipCode && contact.zipCode.length < 5 ? 'border-red-300' : 'border-gray-300'
                  )}
                />
              </div>
            </div>

            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={tcpaConsent}
                onChange={(e) => setTcpaConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                By submitting, you agree to receive calls/texts from ShieldHome.pro. Msg &amp; data rates may apply. Reply STOP to cancel.
              </span>
            </label>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!isFormValid || submitting}
              className={cn(
                'w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2',
                isFormValid && !submitting
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-green-200 animate-[pulse-green_2s_infinite]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              See My Security Plan <ChevronRight size={20} />
            </button>

            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Lock size={12} /> 256-bit SSL</span>
              <span className="flex items-center gap-1"><Award size={12} /> BBB A+</span>
              <span className="flex items-center gap-1"><CheckCircle size={12} /> #1 Rated</span>
            </div>
          </div>
        )}
      </div>

      {/* Trust line below quiz */}
      <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
        <Lock size={12} /> 256-bit encryption. Your data is secure and will never be sold.
      </p>
    </div>
  )
}

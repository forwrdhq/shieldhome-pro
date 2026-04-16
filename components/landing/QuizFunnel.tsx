'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ChevronLeft, X, Home, Building2, Building, Briefcase,
  Key, ClipboardList, ShoppingCart, Shield, AlertTriangle,
  PawPrint, CheckCircle2, Lock, Award, Users,
  Bolt, Calendar, Search, CheckCircle, DoorOpen, Flame, CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTracking } from '@/lib/utm'
import { genEventId, firePixelEvent, firePixelCustomEvent, fireCapi } from '@/lib/meta-pixel'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  zipCode: z.string().min(5, 'ZIP code required'),
})
type ContactForm = z.infer<typeof contactSchema>

interface QuizState {
  propertyType: string
  homeownership: string
  securityConcerns: string[]
  entryPoints: string
  timeline: string
  creditScoreRange: string
}

interface QuizFunnelProps {
  className?: string
  isModal?: boolean
  onClose?: () => void
}

const TOTAL_STEPS = 7

function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1)
  digits = digits.slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function getQualificationMessage(quiz: QuizState): { headline: string; subtext: string } {
  const isOwner = quiz.homeownership === 'OWN'
  const isUrgent = quiz.timeline === 'ASAP' || quiz.timeline === 'WITHIN_MONTH'
  const isHouse = quiz.propertyType === 'HOUSE' || quiz.propertyType === 'TOWNHOME'

  if (isOwner && isUrgent && isHouse) {
    return {
      headline: 'Great news — you qualify for our best deal!',
      subtext: 'Homeowners like you get $0 down, free equipment, and a free doorbell camera with expert setup.',
    }
  }
  if (isOwner && isHouse) {
    return {
      headline: 'Great news — you qualify!',
      subtext: 'As a homeowner, you get free expert setup and a free doorbell camera with your system.',
    }
  }
  if (isOwner) {
    return {
      headline: 'You qualify for a free custom quote!',
      subtext: 'We have packages built for your property type with free expert setup included.',
    }
  }
  if (quiz.homeownership === 'RENT') {
    return {
      headline: 'We have renter-friendly plans!',
      subtext: 'Vivint offers flexible renter packages. A Smart Home Pro will walk you through your best options.',
    }
  }
  return {
    headline: 'Great news — you qualify!',
    subtext: 'Enter your info below to get your free custom security quote.',
  }
}

export function getRiskLevel(entryPoints: string, concerns: string[]): { level: string; score: number; color: string } {
  let score = 40
  if (entryPoints === '6-10') score += 15
  else if (entryPoints === '11-15') score += 25
  else if (entryPoints === '15+') score += 35
  if (concerns.includes('BREAKINS')) score += 10
  if (concerns.includes('ALL')) score += 15
  if (concerns.length >= 3) score += 10
  score = Math.min(score, 95)

  if (score >= 70) return { level: 'HIGH', score, color: 'text-red-600' }
  if (score >= 50) return { level: 'MODERATE', score, color: 'text-yellow-600' }
  return { level: 'LOW', score, color: 'text-green-600' }
}

export default function QuizFunnel({ className, isModal = false, onClose }: QuizFunnelProps) {
  const router = useRouter()
  const [sessionEventId] = useState(() => genEventId())
  const [step, setStep] = useState(1)
  const [quiz, setQuiz] = useState<QuizState>({
    propertyType: '',
    homeownership: '',
    securityConcerns: [],
    entryPoints: '',
    timeline: '',
    creditScoreRange: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [phoneDisplay, setPhoneDisplay] = useState('')
  const [tcpaConsent, setTcpaConsent] = useState(true)
  const [showRenterNote, setShowRenterNote] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  // Auto-detect zip code via geolocation
  useEffect(() => {
    if (step === 7 && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
          )
          const data = await response.json()
          if (data.postcode) {
            setValue('zipCode', data.postcode)
          }
        } catch {
          // Silently fail — user can enter manually
        }
      }, () => {}, { timeout: 5000 })
    }
  }, [step, setValue])

  // Track quiz start on first advance
  useEffect(() => {
    if (step === 2 && typeof window !== 'undefined') {
      firePixelEvent('InitiateCheckout', `${sessionEventId}_ic`, { content_name: 'quiz_started' })
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({ event: 'quiz_start', quiz_step: 1 })
      }
    }
  }, [step, sessionEventId])

  function trackStep(stepNum: number, answer: string) {
    firePixelCustomEvent('QuizStep', genEventId(), { step: stepNum, answer })
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'quiz_step', quiz_step: stepNum, answer })
    }
  }

  function selectProperty(value: string) {
    setQuiz(q => ({ ...q, propertyType: value }))
    trackStep(1, value)
    setStep(2)
  }

  function selectOwnership(value: string) {
    setQuiz(q => ({ ...q, homeownership: value }))
    trackStep(2, value)
    if (value === 'RENT') {
      setShowRenterNote(true)
      setTimeout(() => {
        setShowRenterNote(false)
        setStep(3)
      }, 2500)
    } else {
      setStep(3)
    }
  }

  function toggleConcern(value: string) {
    setQuiz(q => {
      if (value === 'ALL') {
        return { ...q, securityConcerns: q.securityConcerns.includes('ALL') ? [] : ['ALL'] }
      }
      const filtered = q.securityConcerns.filter(c => c !== 'ALL')
      return {
        ...q,
        securityConcerns: filtered.includes(value)
          ? filtered.filter(c => c !== value)
          : [...filtered, value]
      }
    })
  }

  function selectEntryPoints(value: string) {
    setQuiz(q => ({ ...q, entryPoints: value }))
    trackStep(4, value)
    setStep(5)
  }

  function selectTimeline(value: string) {
    setQuiz(q => ({ ...q, timeline: value }))
    trackStep(5, value)
    setStep(6)
  }

  function selectCreditScore(value: string) {
    setQuiz(q => ({ ...q, creditScoreRange: value }))
    trackStep(6, value)
    setStep(7)
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value)
    setPhoneDisplay(formatted)
    const digits = formatted.replace(/\D/g, '')
    setValue('phone', digits, { shouldValidate: digits.length >= 10 })
  }

  async function onSubmit(contact: ContactForm) {
    setSubmitting(true)
    setError('')
    try {
      const tracking = getTracking()
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contact,
          propertyType: quiz.propertyType,
          homeownership: quiz.homeownership === 'BUYING' ? 'OWN' : quiz.homeownership,
          productsInterested: quiz.securityConcerns,
          timeline: quiz.timeline,
          entryPoints: quiz.entryPoints,
          creditScoreRange: quiz.creditScoreRange,
          tcpaConsent,
          ...tracking,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')

      const leadEventId = `${sessionEventId}_lead`
      const crEventId = `${sessionEventId}_cr`
      firePixelEvent('Lead', leadEventId, { content_name: 'security_quote', value: 900, currency: 'USD' })
      firePixelEvent('CompleteRegistration', crEventId)
      fireCapi('Lead', leadEventId, { email: contact.email, phone: contact.phone, firstName: contact.firstName, zipCode: contact.zipCode }, { content_name: 'security_quote', value: 900, currency: 'USD' })
      fireCapi('CompleteRegistration', crEventId, { email: contact.email, phone: contact.phone, firstName: contact.firstName, zipCode: contact.zipCode })

      if (typeof window !== 'undefined') {
        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: 'lead_submitted',
            lead_value: 900,
            property_type: quiz.propertyType,
            ownership: quiz.homeownership,
            timeline: quiz.timeline,
            zip_code: contact.zipCode,
          })
        }
      }

      router.push(`/thank-you?ep=${quiz.entryPoints}&concerns=${quiz.securityConcerns.join(',')}&timeline=${quiz.timeline}&property=${quiz.propertyType}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const propertyOptions = [
    { value: 'HOUSE', label: 'House', icon: <Home size={28} /> },
    { value: 'TOWNHOME', label: 'Townhome', icon: <Building2 size={28} /> },
    { value: 'CONDO_APARTMENT', label: 'Condo / Apartment', icon: <Building size={28} /> },
    { value: 'BUSINESS', label: 'Business', icon: <Briefcase size={28} /> },
  ]

  const ownershipOptions = [
    { value: 'OWN', label: 'I Own My Home', icon: <Key size={28} /> },
    { value: 'RENT', label: 'I Rent', icon: <ClipboardList size={28} /> },
    { value: 'BUYING', label: "I'm Buying Soon", icon: <ShoppingCart size={28} /> },
  ]

  const concernOptions = [
    { value: 'BREAKINS', label: 'Break-ins / Burglary', icon: <Shield size={24} /> },
    { value: 'PACKAGES', label: 'Package Theft', icon: <AlertTriangle size={24} /> },
    { value: 'FIRE', label: 'Fire / Smoke / CO', icon: <Flame size={24} /> },
    { value: 'KIDS_PETS', label: 'Watching Kids / Pets', icon: <PawPrint size={24} /> },
    { value: 'ALL', label: 'All of the Above', icon: <CheckCircle2 size={24} /> },
  ]

  const entryPointOptions = [
    { value: '1-5', label: '1-5 entry points' },
    { value: '6-10', label: '6-10 entry points' },
    { value: '11-15', label: '11-15 entry points' },
    { value: '15+', label: '15+ entry points' },
  ]

  const timelineOptions = [
    { value: 'ASAP', label: 'ASAP (within a week)', icon: <Bolt size={24} />, hot: true },
    { value: 'ONE_MONTH', label: 'Within the next month', icon: <Calendar size={24} /> },
    { value: 'JUST_RESEARCHING', label: 'Just researching', icon: <Search size={24} /> },
  ]

  const creditScoreOptions = [
    { value: 'EXCELLENT', label: 'Excellent (750+)' },
    { value: 'GOOD', label: 'Good (700–749)' },
    { value: 'FAIR', label: 'Fair (650–699)' },
    { value: 'BELOW_650', label: 'Below 650' },
    { value: 'NOT_SURE', label: "I'm not sure" },
  ]

  const qualification = getQualificationMessage(quiz)

  const quizContent = (
    <div className={cn('w-full', isModal ? '' : 'max-w-xl mx-auto', className)}>
      <div className={cn(
        'overflow-hidden',
        isModal ? '' : 'bg-white rounded-xl shadow-md border border-slate-200'
      )}>
        {/* Header for modal */}
        {isModal && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-emerald-500" />
              <span className="text-white font-bold">Free Home Security Assessment</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
              aria-label="Close quiz"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-slate-200 h-1">
          <div
            className="bg-emerald-500 h-1 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6 md:p-8">
          {/* Step indicator + Back button */}
          <div className="flex items-center justify-between mb-5">
            {step > 1 ? (
              <button
                onClick={() => {
                  if (showRenterNote) return
                  setStep(s => s - 1)
                }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 font-medium">Step {step} of {TOTAL_STEPS}</span>
              <div className="flex items-center gap-1 ml-2">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      i < step ? 'bg-emerald-600 w-4' : i === step - 1 ? 'bg-emerald-600 w-6' : 'bg-gray-200 w-4'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Step 1: Property Type */}
          {step === 1 && (
            <div className="animate-in">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                What type of property do you want to protect?
              </h2>
              <p className="text-gray-500 mb-6 text-sm">This helps us build the right system for you.</p>
              <div className="grid grid-cols-2 gap-3">
                {propertyOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => selectProperty(opt.value)}
                    className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 transition-all duration-200 group min-h-[100px]"
                    aria-label={`Select ${opt.label}`}
                  >
                    <span className="text-gray-500 group-hover:text-emerald-500 transition-colors">{opt.icon}</span>
                    <span className="font-semibold text-gray-800 text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Ownership */}
          {step === 2 && (
            <div className="animate-in">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Do you own or rent?</h2>
              <p className="text-gray-500 mb-6 text-sm">This helps us find the best plan for you.</p>

              {showRenterNote && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                  <strong>Note:</strong> Vivint systems need homeowner approval. If your landlord agrees, we can still help!
                </div>
              )}

              <div className="flex flex-col gap-3">
                {ownershipOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => selectOwnership(opt.value)}
                    disabled={showRenterNote}
                    className={cn(
                      'flex items-center gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 transition-all duration-200 group text-left',
                      showRenterNote && 'opacity-50 cursor-not-allowed'
                    )}
                    aria-label={`Select ${opt.label}`}
                  >
                    <span className="text-gray-500 group-hover:text-emerald-500 transition-colors">{opt.icon}</span>
                    <span className="font-semibold text-gray-800">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Security Concerns */}
          {step === 3 && (
            <div className="animate-in">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">What concerns you most?</h2>
              <p className="text-gray-500 mb-6 text-sm">Select all that apply.</p>
              <div className="flex flex-col gap-3 mb-6">
                {concernOptions.map(opt => {
                  const selected = quiz.securityConcerns.includes(opt.value)
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleConcern(opt.value)}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left min-h-[56px]',
                        selected
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-600 hover:bg-emerald-50'
                      )}
                      aria-label={`${selected ? 'Deselect' : 'Select'} ${opt.label}`}
                      aria-pressed={selected}
                    >
                      <span className={cn('transition-colors', selected ? 'text-emerald-500' : 'text-gray-500')}>
                        {opt.icon}
                      </span>
                      <span className="font-semibold text-gray-800 flex-1">{opt.label}</span>
                      {selected && <CheckCircle size={20} className="text-emerald-500" />}
                    </button>
                  )
                })}
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  if (quiz.securityConcerns.length > 0) {
                    trackStep(3, quiz.securityConcerns.join(','))
                    setStep(4)
                  }
                }}
                disabled={quiz.securityConcerns.length === 0}
              >
                Next
              </Button>
            </div>
          )}

          {/* Step 4: Entry Points */}
          {step === 4 && (
            <div className="animate-in">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                How many entry points does your home have?
              </h2>
              <p className="text-gray-500 mb-6 text-sm">Count doors and windows someone could get through. This helps us size your system.</p>
              <div className="flex flex-col gap-3">
                {entryPointOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => selectEntryPoints(opt.value)}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 transition-all duration-200 text-left group min-h-[56px]"
                    aria-label={`Select ${opt.label}`}
                  >
                    <span className="text-gray-500 group-hover:text-emerald-500 transition-colors">
                      <DoorOpen size={24} />
                    </span>
                    <span className="font-semibold text-gray-800">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Timeline */}
          {step === 5 && (
            <div className="animate-in">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">When do you want to get protected?</h2>
              <p className="text-gray-500 mb-6 text-sm">This helps us schedule your free quote call.</p>
              <div className="flex flex-col gap-3">
                {timelineOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => selectTimeline(opt.value)}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 transition-all duration-200 text-left group min-h-[56px]"
                    aria-label={`Select ${opt.label}`}
                  >
                    <span className="text-gray-500 group-hover:text-emerald-500 transition-colors">{opt.icon}</span>
                    <span className="font-semibold text-gray-800 flex-1">{opt.label}</span>
                    {opt.hot && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                        Most Popular
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Credit Score Range */}
          {step === 6 && (
            <div className="animate-in">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                What&apos;s your estimated credit score?
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                Vivint offers $0-down financing for qualifying credit. This helps us find the best plan for you.
              </p>
              <div className="flex flex-col gap-3">
                {creditScoreOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => selectCreditScore(opt.value)}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 transition-all duration-200 text-left group min-h-[56px]"
                    aria-label={`Select ${opt.label}`}
                  >
                    <span className="text-gray-500 group-hover:text-emerald-500 transition-colors">
                      <CreditCard size={24} />
                    </span>
                    <span className="font-semibold text-gray-800">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Contact Form */}
          {step === 7 && (
            <div className="animate-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-3">
                  <CheckCircle className="text-emerald-500" size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{qualification.headline}</h2>
                <p className="text-gray-500 mt-1 text-sm max-w-md mx-auto">{qualification.subtext}</p>
              </div>

              <form id="quiz-contact-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  error={errors.firstName?.message}
                  autoComplete="given-name"
                  {...register('firstName')}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(555) 555-5555"
                    value={phoneDisplay}
                    onChange={handlePhoneChange}
                    autoComplete="tel"
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all',
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    )}
                    style={{ fontSize: '16px' }}
                  />
                  <input type="hidden" {...register('phone')} />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  error={errors.email?.message}
                  autoComplete="email"
                  {...register('email')}
                />

                <Input
                  label="ZIP Code"
                  placeholder="90210"
                  maxLength={10}
                  error={errors.zipCode?.message}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  {...register('zipCode')}
                />

                {/* TCPA Consent */}
                <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tcpaConsent}
                    onChange={(e) => setTcpaConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    By clicking &ldquo;Get My Free Quote,&rdquo; I agree to receive calls, texts, and emails
                    from ShieldHome Pro and Vivint Smart Home at the number provided, including by autodialer.
                    Consent is not a condition of purchase. Msg &amp; data rates may apply. Reply STOP to opt out.
                  </span>
                </label>

                {/* Button + trust seals inline for non-modal */}
                {!isModal && (
                  <>
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="xl"
                      className="w-full text-lg"
                      loading={submitting}
                    >
                      Get My Free Quote
                    </Button>

                    <div className="pt-2 space-y-3">
                      <div className="flex items-center justify-center gap-1.5 text-gray-500">
                        <Lock size={14} className="text-emerald-500" />
                        <span className="text-xs font-medium">Your info is 100% secure. We never sell or share your data.</span>
                      </div>
                      <div className="flex items-center justify-center gap-6 text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Lock size={14} className="text-emerald-500" />
                          <span className="text-xs font-medium">256-bit SSL</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Shield size={14} className="text-emerald-500" />
                          <span className="text-xs font-medium">BBB A+ Rated</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Award size={14} className="text-emerald-500" />
                          <span className="text-xs font-medium">#1 Rated</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <Users size={14} className="text-gray-400" />
                        <p className="text-xs text-gray-500 font-medium">
                          <span className="text-emerald-500 font-bold">2,847 homeowners</span> requested a quote this month
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full sm:max-w-lg flex flex-col bg-white rounded-t-2xl sm:rounded-xl overflow-hidden" style={{ maxHeight: '95dvh' }}>
          <div className="overflow-y-auto flex-1 min-h-0">
            {quizContent}
          </div>
          {/* Sticky footer: submit button always visible on step 6 */}
          {step === 7 && (
            <div className="border-t border-slate-100 bg-white px-6 py-4 space-y-3 flex-shrink-0">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                form="quiz-contact-form"
                variant="primary"
                size="xl"
                className="w-full text-lg"
                loading={submitting}
              >
                Get My Free Quote
              </Button>
              <div className="flex items-center justify-center gap-4 text-gray-500">
                <div className="flex items-center gap-1">
                  <Lock size={12} className="text-emerald-500" />
                  <span className="text-[11px] font-medium">256-bit SSL</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={12} className="text-emerald-500" />
                  <span className="text-[11px] font-medium">BBB A+ Rated</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award size={12} className="text-emerald-500" />
                  <span className="text-[11px] font-medium">#1 Rated</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return quizContent
}

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, Home, Building2, Building, Briefcase, Key, ClipboardList, Shield, AlertTriangle, Camera, Zap, Package, Bolt, Calendar, CalendarDays, Search, CheckCircle, Lock, Award, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTracking } from '@/lib/utm'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const contactSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().min(10, 'Valid phone required'),
  email: z.string().email('Valid email required'),
  zipCode: z.string().min(5, 'ZIP required'),
})
type ContactForm = z.infer<typeof contactSchema>

interface QuizState {
  propertyType: string
  homeownership: string
  productsInterested: string[]
  timeline: string
}

interface QuizFunnelProps {
  className?: string
  variant?: 'default' | 'compact'
}

const STEPS = 5

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function getQualificationMessage(quiz: QuizState): { headline: string; subtext: string } {
  const isOwner = quiz.homeownership === 'OWN'
  const isUrgent = quiz.timeline === 'ASAP' || quiz.timeline === 'ONE_TWO_WEEKS'
  const isHouse = quiz.propertyType === 'HOUSE' || quiz.propertyType === 'TOWNHOME'

  if (isOwner && isUrgent && isHouse) {
    return {
      headline: 'You qualify for our best deal.',
      subtext: 'Homeowners like you are eligible for $0 down, free equipment, and a free doorbell camera with professional installation.',
    }
  }
  if (isOwner && isHouse) {
    return {
      headline: 'Great news — you qualify!',
      subtext: 'As a homeowner, you\'re eligible for our premium package including free professional installation and a free doorbell camera.',
    }
  }
  if (isOwner) {
    return {
      headline: 'You qualify for a custom quote.',
      subtext: 'We have specialized packages for your property type with free professional installation included.',
    }
  }
  if (quiz.homeownership === 'RENT') {
    return {
      headline: 'We have renter-friendly plans!',
      subtext: 'Vivint offers flexible renter packages — a Smart Home Pro will walk you through your best options and pricing.',
    }
  }
  return {
    headline: 'Great news! You qualify.',
    subtext: 'Enter your info below to get your free personalized security quote.',
  }
}

export default function QuizFunnel({ className, variant = 'default' }: QuizFunnelProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [quiz, setQuiz] = useState<QuizState>({
    propertyType: '',
    homeownership: '',
    productsInterested: [],
    timeline: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [phoneDisplay, setPhoneDisplay] = useState('')
  const phoneRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const progress = ((step - 1) / (STEPS - 1)) * 100

  function selectProperty(value: string) {
    setQuiz(q => ({ ...q, propertyType: value }))
    setStep(2)
  }

  function selectOwnership(value: string) {
    setQuiz(q => ({ ...q, homeownership: value }))
    setStep(3)
  }

  function toggleProduct(value: string) {
    setQuiz(q => ({
      ...q,
      productsInterested: q.productsInterested.includes(value)
        ? q.productsInterested.filter(p => p !== value)
        : [...q.productsInterested, value]
    }))
  }

  function selectTimeline(value: string) {
    setQuiz(q => ({ ...q, timeline: value }))
    setStep(5)
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
        body: JSON.stringify({ ...contact, ...quiz, ...tracking }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')

      // Fire tracking events
      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Lead', { content_name: 'security_quote', value: 850.00, currency: 'USD' })
        }
        if ((window as any).gtag) {
          (window as any).gtag('event', 'generate_lead', { event_category: 'form_submission', event_label: 'quiz_funnel', value: 850 })
        }
      }

      router.push('/thank-you')
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
  ]

  const productOptions = [
    { value: 'Home Security System', label: 'Home Security System', icon: <Shield size={24} /> },
    { value: 'Safety & Smoke Alarms', label: 'Safety & Smoke Alarms', icon: <AlertTriangle size={24} /> },
    { value: 'Indoor/Outdoor Cameras', label: 'Indoor/Outdoor Cameras', icon: <Camera size={24} /> },
    { value: 'Smart Home Automation', label: 'Smart Home Automation', icon: <Zap size={24} /> },
    { value: 'Package Protection', label: 'Package Protection', icon: <Package size={24} /> },
  ]

  const timelineOptions = [
    { value: 'ASAP', label: 'As soon as possible', icon: <Bolt size={24} /> },
    { value: 'ONE_TWO_WEEKS', label: 'Within 1-2 weeks', icon: <Calendar size={24} /> },
    { value: 'ONE_MONTH', label: 'Within a month', icon: <CalendarDays size={24} /> },
    { value: 'JUST_RESEARCHING', label: "I'm just researching", icon: <Search size={24} /> },
  ]

  const qualification = getQualificationMessage(quiz)

  return (
    <div id="quiz" className={cn('w-full max-w-xl mx-auto', className)}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-100 h-2">
          <div
            className="bg-[#00C853] h-2 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6 md:p-8">
          {/* Back button + subtle indicator (no "Step X of Y") */}
          {step > 1 && (
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Go back to previous question"
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>
              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(i => (
                  <div
                    key={i}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      i < step ? 'bg-[#00C853]' : i === step ? 'bg-[#00C853] w-4' : 'bg-gray-200'
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Selected badges */}
          {step > 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {quiz.propertyType && (
                <span className="text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 font-medium">
                  {propertyOptions.find(p => p.value === quiz.propertyType)?.label}
                </span>
              )}
              {quiz.homeownership && step > 2 && (
                <span className="text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 font-medium">
                  {ownershipOptions.find(o => o.value === quiz.homeownership)?.label}
                </span>
              )}
            </div>
          )}

          {/* Step 1: Property Type */}
          {step === 1 && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Let&apos;s customize your security system
              </h2>
              <p className="text-gray-600 mb-6">What type of property do you want to protect?</p>
              <div className="grid grid-cols-2 gap-3">
                {propertyOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => selectProperty(opt.value)}
                    className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-[#00C853] hover:bg-green-50 transition-all duration-200 group"
                    aria-label={`Select ${opt.label}`}
                  >
                    <span className="text-gray-600 group-hover:text-[#00C853] transition-colors">{opt.icon}</span>
                    <span className="font-semibold text-gray-800 text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Ownership */}
          {step === 2 && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Do you own or rent?</h2>
              <p className="text-gray-600 mb-6">This helps us find the best plan for you</p>
              <div className="grid grid-cols-2 gap-3">
                {ownershipOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => selectOwnership(opt.value)}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-[#00C853] hover:bg-green-50 transition-all duration-200 group"
                    aria-label={`Select ${opt.label}`}
                  >
                    <span className="text-gray-600 group-hover:text-[#00C853] transition-colors">{opt.icon}</span>
                    <span className="font-semibold text-gray-800">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Products */}
          {step === 3 && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">What are you interested in?</h2>
              <p className="text-gray-600 mb-6">Select all that apply</p>
              <div className="flex flex-col gap-3 mb-6">
                {productOptions.map(opt => {
                  const selected = quiz.productsInterested.includes(opt.value)
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleProduct(opt.value)}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left',
                        selected
                          ? 'border-[#00C853] bg-green-50'
                          : 'border-gray-200 hover:border-[#00C853] hover:bg-green-50'
                      )}
                      aria-label={`${selected ? 'Deselect' : 'Select'} ${opt.label}`}
                      aria-pressed={selected}
                    >
                      <span className={cn('transition-colors', selected ? 'text-[#00C853]' : 'text-gray-500')}>
                        {opt.icon}
                      </span>
                      <span className="font-semibold text-gray-800 flex-1">{opt.label}</span>
                      {selected && <CheckCircle size={20} className="text-[#00C853]" />}
                    </button>
                  )
                })}
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => quiz.productsInterested.length > 0 && setStep(4)}
                disabled={quiz.productsInterested.length === 0}
              >
                Next →
              </Button>
            </div>
          )}

          {/* Step 4: Timeline */}
          {step === 4 && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">How soon do you want it installed?</h2>
              <p className="text-gray-600 mb-6">This helps us schedule your consultation</p>
              <div className="flex flex-col gap-3">
                {timelineOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => selectTimeline(opt.value)}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-[#00C853] hover:bg-green-50 transition-all duration-200 text-left group"
                    aria-label={`Select ${opt.label}`}
                  >
                    <span className="text-gray-600 group-hover:text-[#00C853] transition-colors">{opt.icon}</span>
                    <span className="font-semibold text-gray-800">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Contact Form — Personalized */}
          {step === 5 && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <CheckCircle className="text-[#00C853]" size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{qualification.headline}</h2>
                <p className="text-gray-600 mt-1 text-sm max-w-md mx-auto">{qualification.subtext}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First Name"
                    placeholder="John"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Smith"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(555) 555-5555"
                    value={phoneDisplay}
                    onChange={handlePhoneChange}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent transition-all',
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    )}
                  />
                  <input type="hidden" {...register('phone')} />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
                  <p className="text-xs text-gray-500 mt-1">We&apos;ll text you a confirmation</p>
                </div>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="ZIP Code"
                  placeholder="90210"
                  maxLength={10}
                  error={errors.zipCode?.message}
                  {...register('zipCode')}
                />

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
                  Get My Free Quote →
                </Button>

                {/* Enhanced trust seals */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-center gap-6 text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Lock size={14} className="text-[#00C853]" />
                      <span className="text-xs font-medium">256-bit SSL</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shield size={14} className="text-[#00C853]" />
                      <span className="text-xs font-medium">BBB A+ Rated</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award size={14} className="text-[#00C853]" />
                      <span className="text-xs font-medium">#1 Rated</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    By submitting, you consent to receive calls and texts from an authorized Vivint dealer.
                    Msg & data rates may apply. Reply STOP to opt out.
                  </p>

                  {/* Social proof nudge */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <Users size={14} className="text-gray-400" />
                    <p className="text-xs text-gray-500 font-medium">
                      <span className="text-[#00C853] font-bold">2,847 homeowners</span> requested a quote this month
                    </p>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

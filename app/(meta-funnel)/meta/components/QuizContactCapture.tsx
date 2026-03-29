'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, CheckCircle } from 'lucide-react'
import QuizProgressBar from './QuizProgressBar'
import type { QuizAnswers } from './scoring'

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  phone: z.string().min(10, 'Valid phone number required').max(20),
  email: z.string().email('Valid email required'),
  zipCode: z.string().regex(/^\d{5}$/, 'Valid 5-digit ZIP required'),
  smsConsent: z.boolean(),
})

type ContactFormData = z.infer<typeof contactSchema>

export interface ContactSubmitData extends ContactFormData {
  tcpaConsent: boolean
}

interface QuizContactCaptureProps {
  totalQuestions: number
  quizAnswers: QuizAnswers
  onSubmit: (data: ContactSubmitData) => void
  loading: boolean
}

function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function getQualificationMessage(answers: QuizAnswers): string {
  const isOwner = answers.ownership === 'own'
  const isAsap = answers.timeline === 'asap'
  const isHouse = answers.propertyType === 'house'
  const isRenter = answers.ownership === 'rent'
  const hasSystem = answers.currentSystem === 'unhappy_professional' || answers.currentSystem === 'outdated'

  if (isOwner && isAsap && isHouse) {
    return 'Great news \u2014 you likely qualify for our best homeowner package!'
  }
  if (isOwner && isHouse) {
    return 'You qualify! See your personalized protection plan.'
  }
  if (isRenter) {
    return 'We have options for renters too! See what\u2019s available.'
  }
  if (hasSystem) {
    return 'Let\u2019s see if we can upgrade your protection.'
  }
  return 'Your personalized security report is ready!'
}

export default function QuizContactCapture({
  totalQuestions,
  quizAnswers,
  onSubmit,
  loading,
}: QuizContactCaptureProps) {
  const [phoneDisplay, setPhoneDisplay] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { smsConsent: true },
  })

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value)
    setPhoneDisplay(formatted)
    const digits = e.target.value.replace(/\D/g, '')
    setValue('phone', digits, { shouldValidate: true })
  }

  const onFormSubmit = (data: ContactFormData) => {
    onSubmit({ ...data, tcpaConsent: true })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 md:px-8 pt-6 pb-8">
      {/* Progress Bar — 100% */}
      <div className="max-w-xl mx-auto w-full mb-8">
        <QuizProgressBar current={totalQuestions} total={totalQuestions} />
      </div>

      <div
        className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full"
        style={{ animation: 'fadeUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both' }}
      >
        {/* Lock icon */}
        <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-5">
          <Lock className="w-5 h-5 text-emerald-600" />
        </div>

        {/* Headline */}
        <h2 className="text-[22px] md:text-[28px] font-heading font-bold text-slate-900 text-center leading-[1.2] tracking-[-0.03em] mb-2">
          Your Security Report Is Ready
        </h2>

        {/* Dynamic qualification message */}
        <p className="text-[13px] font-heading font-semibold text-emerald-600 text-center mb-1">
          {getQualificationMessage(quizAnswers)}
        </p>

        <p className="text-[13px] text-slate-500 font-body text-center mb-6">
          Where should we send your results?
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="w-full space-y-3">
          <div>
            <input
              {...register('firstName')}
              type="text"
              placeholder="First Name"
              autoComplete="given-name"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 text-[16px] font-body focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            />
            {errors.firstName && (
              <p className="text-[11px] text-red-500 mt-1 ml-1 font-body">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              autoComplete="tel"
              value={phoneDisplay}
              onChange={handlePhoneChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 text-[16px] font-body focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            />
            <input type="hidden" {...register('phone')} />
            {errors.phone && (
              <p className="text-[11px] text-red-500 mt-1 ml-1 font-body">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 text-[16px] font-body focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            />
            {errors.email && (
              <p className="text-[11px] text-red-500 mt-1 ml-1 font-body">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('zipCode')}
              type="text"
              placeholder="ZIP Code"
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength={5}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 text-[16px] font-body focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            />
            {errors.zipCode && (
              <p className="text-[11px] text-red-500 mt-1 ml-1 font-body">{errors.zipCode.message}</p>
            )}
          </div>

          {/* SMS consent checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer py-1">
            <input
              type="checkbox"
              {...register('smsConsent')}
              defaultChecked
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-[13px] text-slate-600 font-body">
              Text me my results instantly (recommended)
            </span>
          </label>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-semibold text-[15px] py-4 px-8 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              'SEE MY SECURITY SCORE \u2192'
            )}
          </button>

          {/* TCPA consent */}
          <p className="text-[10px] text-slate-400 leading-relaxed text-center font-body">
            By clicking &lsquo;See My Security Score,&rsquo; I agree to receive calls, texts, and emails from
            ShieldHome Pro and Vivint Smart Home at the number provided, including by autodialer. Consent
            is not a condition of purchase. Msg &amp; data rates may apply. Reply STOP to opt out.
          </p>
        </form>

        {/* Social proof */}
        <div className="flex flex-col items-center gap-2 mt-6">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-body">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>5,847 homeowners assessed this month</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-body">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Your information is 256-bit encrypted and never sold</span>
          </div>
        </div>
      </div>
    </div>
  )
}

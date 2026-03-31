'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { captureTrackingData, persistTracking, getTracking } from '@/lib/utm'
import { calculateSecurityScore, scoreMetaLead } from './scoring'
import { fireMetaEvent, fireMetaCustomEvent, fireMetaEventWithId } from './MetaPixelEvents'
import { QUIZ_QUESTIONS, TOTAL_QUESTIONS } from './questions'
import type { QuizAnswers } from './scoring'
import type { StepASubmitData, StepBSubmitData } from './QuizContactCapture'

import QuizStartScreen from './QuizStartScreen'
import QuizQuestion from './QuizQuestion'
import QuizContactCapture from './QuizContactCapture'
import QuizCalculating from './QuizCalculating'
import QuizExitIntent from './QuizExitIntent'

type FunnelStage = 'start' | 'questions' | 'capture' | 'calculating'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split(';').find(c => c.trim().startsWith(`${name}=`))
  return match ? match.split('=')[1]?.trim() || null : null
}

export default function MetaQuizFunnel() {
  const router = useRouter()
  const [stage, setStage] = useState<FunnelStage>('start')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [loadingA, setLoadingA] = useState(false)
  const [loadingB, setLoadingB] = useState(false)
  const [stepAComplete, setStepAComplete] = useState(false)
  const [leadId, setLeadId] = useState<string | null>(null)
  const [stepAData, setStepAData] = useState<{ firstName: string; score: number; riskLevel: string; vulnerabilities: string[]; recommendedPackage: string } | null>(null)
  const [eventId] = useState(() => typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2))
  const [quizStartTime] = useState(() => new Date().toISOString())

  // Capture tracking on mount
  useEffect(() => {
    const data = captureTrackingData()
    persistTracking(data)
  }, [])

  const getQuizAnswers = useCallback((): QuizAnswers => ({
    propertyType: answers['1'] as string,
    topConcern: answers['2'] as string,
    neighborhood: answers['3'] as string,
    ownership: answers['4'] as string,
    currentSystem: answers['5'] as string,
    features: Array.isArray(answers['6']) ? answers['6'] : answers['6'] ? [answers['6'] as string] : [],
    timeline: answers['7'] as string,
  }), [answers])

  const handleStart = () => {
    setStage('questions')
    fireMetaCustomEvent('QuizStart', {
      traffic_source: 'meta_ads',
    })
  }

  const handleQuestionAnswer = (value: string | string[]) => {
    const questionId = QUIZ_QUESTIONS[currentQuestion].id
    setAnswers(prev => ({ ...prev, [String(questionId)]: value }))

    // Fire progress event
    fireMetaCustomEvent('QuizProgress', {
      question_number: questionId,
      answer_value: Array.isArray(value) ? value.join(',') : value,
    })

    // Advance to next question or capture gate
    if (currentQuestion < TOTAL_QUESTIONS - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Quiz complete — fire event and show capture gate
      fireMetaCustomEvent('QuizComplete', {
        quiz_type: 'home_security_assessment',
        property_type: answers['1'],
        urgency: value, // last question is timeline
      })
      setStage('capture')
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    } else {
      setStage('start')
    }
  }

  // Step A: Phone-first capture — fires API immediately
  const handleStepASubmit = async (contactData: StepASubmitData) => {
    setLoadingA(true)

    const tracking = getTracking()
    const quizAnswers = getQuizAnswers()
    const finalAnswers = {
      ...quizAnswers,
      timeline: (answers['7'] as string) || quizAnswers.timeline,
    }
    const { score, riskLevel, vulnerabilities, recommendedPackage } = calculateSecurityScore(finalAnswers)
    const { score: leadScore, priority } = scoreMetaLead(finalAnswers)

    // Read Meta cookies
    const fbp = getCookie('_fbp')
    const fbclid = tracking.fbclid
    const fbc = fbclid ? `fb.1.${Date.now()}.${fbclid}` : getCookie('_fbc')

    const payload = {
      // Contact (phone-first — no email/zip required)
      firstName: contactData.firstName,
      phone: contactData.phone,
      smsConsent: contactData.smsConsent,
      tcpaConsent: contactData.tcpaConsent,

      // Quiz answers
      quizAnswers: {
        propertyType: finalAnswers.propertyType,
        ownership: finalAnswers.ownership,
        topConcern: finalAnswers.topConcern,
        neighborhood: finalAnswers.neighborhood,
        currentSystem: finalAnswers.currentSystem,
        features: finalAnswers.features,
        timeline: finalAnswers.timeline,
      },

      // Computed
      securityScore: score,
      riskLevel,
      recommendedPackage,
      vulnerabilities,
      leadScore,
      priority,
      urgencyLevel: finalAnswers.timeline || 'researching',

      // Funnel tracking
      quizStartedAt: quizStartTime,

      // Attribution
      fbclid: fbclid || undefined,
      fbp: fbp || undefined,
      fbc: fbc || undefined,
      utmSource: tracking.source || 'facebook',
      utmMedium: tracking.medium || 'paid',
      utmCampaign: tracking.campaign || undefined,
      utmContent: tracking.utmContent || undefined,
      utmTerm: tracking.keyword || undefined,
      utmAdset: tracking.adSet || undefined,
      utmAdId: tracking.adId || undefined,
      landingPage: tracking.landingPage || '/meta',
      referrer: tracking.referrer || undefined,
      deviceType: tracking.deviceType || undefined,
      browser: tracking.browser || undefined,
      eventId,
    }

    try {
      const res = await fetch('/api/leads/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      // Fire Lead pixel event with event_id for deduplication
      fireMetaEventWithId('Lead', eventId, {
        value: 50.0,
        currency: 'USD',
        content_name: 'meta_quiz_lead',
      })

      // Store lead data for results page and Step B
      setLeadId(result.leadId)
      setStepAData({ firstName: contactData.firstName, score, riskLevel, vulnerabilities, recommendedPackage })

      // Store results in sessionStorage
      sessionStorage.setItem('metaQuizResults', JSON.stringify({
        leadId: result.leadId,
        firstName: contactData.firstName,
        securityScore: score,
        riskLevel,
        vulnerabilities,
        recommendedPackage,
        quizAnswers: finalAnswers,
        eventId,
      }))

      setLoadingA(false)
      setStepAComplete(true)
    } catch (err) {
      console.error('Meta lead submission error:', err)
      setLoadingA(false)
      // Still proceed — save what we can
      sessionStorage.setItem('metaQuizResults', JSON.stringify({
        leadId: null,
        firstName: contactData.firstName,
        securityScore: score,
        riskLevel,
        vulnerabilities,
        recommendedPackage,
        quizAnswers: finalAnswers,
        eventId,
      }))
      setStepAData({ firstName: contactData.firstName, score, riskLevel, vulnerabilities, recommendedPackage })
      setStepAComplete(true)
    }
  }

  // Step B: Email + ZIP enrichment — PATCH existing lead
  const handleStepBSubmit = async (data: StepBSubmitData) => {
    setLoadingB(true)

    if (leadId) {
      try {
        await fetch(`/api/leads/meta/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, zipCode: data.zipCode }),
        })

        // Update sessionStorage with email for results page
        const stored = sessionStorage.getItem('metaQuizResults')
        if (stored) {
          const parsed = JSON.parse(stored)
          parsed.email = data.email
          sessionStorage.setItem('metaQuizResults', JSON.stringify(parsed))
        }
      } catch (err) {
        console.error('Meta lead enrichment error:', err)
      }
    }

    setLoadingB(false)
    setStage('calculating')
  }

  // Skip Step B — go straight to calculating
  const handleSkipStepB = () => {
    setStage('calculating')
  }

  const handleCalculatingComplete = useCallback(() => {
    router.push('/meta/results')
  }, [router])

  return (
    <>
      {stage === 'start' && <QuizStartScreen onStart={handleStart} />}

      {stage === 'questions' && (
        <QuizQuestion
          key={currentQuestion}
          question={QUIZ_QUESTIONS[currentQuestion]}
          currentIndex={currentQuestion}
          totalQuestions={TOTAL_QUESTIONS}
          onSelect={handleQuestionAnswer}
          onBack={handleBack}
          showBackButton={true}
        />
      )}

      {stage === 'capture' && (
        <QuizContactCapture
          totalQuestions={TOTAL_QUESTIONS}
          quizAnswers={getQuizAnswers()}
          onSubmitStepA={handleStepASubmit}
          onSubmitStepB={handleStepBSubmit}
          onSkipStepB={handleSkipStepB}
          loadingA={loadingA}
          loadingB={loadingB}
          stepAComplete={stepAComplete}
        />
      )}

      {stage === 'calculating' && (
        <QuizCalculating onComplete={handleCalculatingComplete} />
      )}

      {/* Exit intent popup — desktop only, 30s delay */}
      {(stage === 'questions' || stage === 'capture') && <QuizExitIntent />}
    </>
  )
}

'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, Phone } from 'lucide-react'
import StickyHeader from '@/components/business/StickyHeader'
import MinimalFooter from '@/components/business/MinimalFooter'

const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER || '(877) 555-0199'
const PHONE_RAW = process.env.NEXT_PUBLIC_PHONE_NUMBER_RAW || '+18775550199'

function buildGoogleCalendarUrl(title: string, dateTime: string, duration = 45) {
  const start = new Date(dateTime)
  const end = new Date(start.getTime() + duration * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: 'ShieldHome Pro Commercial Security Assessment — your specialist will walk your property and provide a written security recommendation.',
    location: 'Your Business Location',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function buildAppleCalendarUrl(title: string, dateTime: string, duration = 45) {
  const start = new Date(dateTime)
  const end = new Date(start.getTime() + duration * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`,
    'DESCRIPTION:ShieldHome Pro Commercial Security Assessment',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\n')
  return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`
}

function AssessmentContent() {
  const params = useSearchParams()
  const eventDate = params.get('eventDate') || params.get('date') || ''
  const eventTime = params.get('eventTime') || params.get('time') || ''
  const eventTitle = params.get('eventTitle') || 'Commercial Security Assessment — ShieldHome Pro'
  const contactName = params.get('contactName') || ''

  const dateTimeStr = eventDate && eventTime ? `${eventDate}T${eventTime}` : ''

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Schedule')
      }
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'book_appointment', { value: 1200, currency: 'USD' })
      }
    }
  }, [])

  const googleUrl = dateTimeStr ? buildGoogleCalendarUrl(eventTitle, dateTimeStr) : null
  const appleUrl = dateTimeStr ? buildAppleCalendarUrl(eventTitle, dateTimeStr) : null

  return (
    <div className="min-h-screen flex flex-col">
      <StickyHeader />

      <main className="flex-1 py-16 px-4 sm:px-6" style={{ background: '#F8F9FA' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ background: '#00C853' }}
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: '#1A1A2E' }}>
            Your Assessment is Confirmed! ✅
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            {contactName ? `${contactName}, a` : 'A'} commercial security specialist will meet with you at the scheduled time.
          </p>

          {/* What to expect */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6 text-left">
            <h2 className="text-lg font-bold mb-5" style={{ color: '#1A1A2E' }}>What to Expect</h2>
            <div className="space-y-5">
              {[
                {
                  step: '1',
                  icon: '📞',
                  title: 'Confirmation coming your way',
                  body: "You'll receive a confirmation text and email within the next few minutes with your appointment details.",
                },
                {
                  step: '2',
                  icon: '🏢',
                  title: 'On-site assessment',
                  body: 'Your specialist will arrive at your location at the scheduled time and walk your property with you.',
                },
                {
                  step: '3',
                  icon: '📋',
                  title: 'Written recommendation',
                  body: "They'll identify any vulnerabilities and provide a written security recommendation — zero obligation, zero pressure.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: '#1A1A2E' }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>
                      {item.icon} {item.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar add */}
          {(googleUrl || appleUrl) && (
            <div
              className="rounded-2xl p-6 mb-6 border-2"
              style={{ borderColor: '#00C853', background: 'rgba(0,200,83,0.04)' }}
            >
              <p className="font-semibold mb-4" style={{ color: '#1A1A2E' }}>
                📅 Add it to your calendar so you don't forget!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {googleUrl && (
                  <a
                    href={googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm transition-colors"
                    style={{ background: '#1A1A2E' }}
                  >
                    Add to Google Calendar
                  </a>
                )}
                {appleUrl && (
                  <a
                    href={appleUrl}
                    download="assessment.ics"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border-2 border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white transition-colors"
                  >
                    Add to Apple Calendar
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Testimonial */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex mb-2">
              {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400">★</span>)}
            </div>
            <p className="text-gray-700 text-sm italic mb-3">
              "The assessment was completely free and incredibly thorough. Had a quote the next day."
            </p>
            <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>Mark D. — Retail Manager</p>
          </div>

          {/* Phone CTA */}
          <p className="text-gray-500 text-sm mb-3">Questions before your appointment?</p>
          <a
            href={`tel:${PHONE_RAW}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-colors"
            style={{ background: '#00C853' }}
          >
            <Phone className="w-4 h-4" />
            Call Us: {PHONE}
          </a>
        </div>
      </main>

      <MinimalFooter />
    </div>
  )
}

export default function AssessmentBookedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00C853] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading…</p>
        </div>
      </div>
    }>
      <AssessmentContent />
    </Suspense>
  )
}

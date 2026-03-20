'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle, Phone, MessageSquare, Building2, ClipboardList } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

function buildGoogleCalendarUrl(params: {
  title: string
  startTime: string
  endTime: string
  description: string
  location?: string
}) {
  const fmt = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d+/, '')
  const url = new URL('https://calendar.google.com/calendar/render')
  url.searchParams.set('action', 'TEMPLATE')
  url.searchParams.set('text', params.title)
  url.searchParams.set('dates', `${fmt(params.startTime)}/${fmt(params.endTime)}`)
  url.searchParams.set('details', params.description)
  if (params.location) url.searchParams.set('location', params.location)
  return url.toString()
}

function buildIcsDataUri(params: {
  title: string
  startTime: string
  endTime: string
  description: string
  location?: string
}) {
  const fmt = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d+/, '').slice(0, 15) + 'Z'
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ShieldHome Pro//Assessment//EN',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(params.startTime)}`,
    `DTEND:${fmt(params.endTime)}`,
    `SUMMARY:${params.title}`,
    `DESCRIPTION:${params.description.replace(/\n/g, '\\n')}`,
    params.location ? `LOCATION:${params.location}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}

function AssessmentBookedContent() {
  const searchParams = useSearchParams()

  const businessName = searchParams.get('business') || searchParams.get('businessName') || 'your business'
  const date = searchParams.get('date') || searchParams.get('appointmentDate') || ''
  const time = searchParams.get('time') || searchParams.get('appointmentTime') || ''
  const contactName = searchParams.get('name') || searchParams.get('contactName') || ''

  // Build ISO start/end time from query params
  let startTime = searchParams.get('start') || ''
  let endTime = searchParams.get('end') || ''

  if (!startTime && date && time) {
    // Try to construct from date + time params
    try {
      const d = new Date(`${date} ${time}`)
      if (!isNaN(d.getTime())) {
        startTime = d.toISOString()
        endTime = new Date(d.getTime() + 60 * 60 * 1000).toISOString() // +1 hour
      }
    } catch {
      // Fall through — calendar buttons won't show
    }
  }

  const calendarTitle = `Security Assessment — ${businessName}`
  const calendarDescription = `Commercial security assessment with ShieldHome Pro.\n\nContact: ${contactName}\nBusiness: ${businessName}\n\nQuestions? Call ${PHONE_NUMBER}`

  const hasCalendarData = !!startTime && !!endTime

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Conversion tracking */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof fbq !== 'undefined') {
              fbq('track', 'Schedule');
            }
            if (typeof gtag !== 'undefined') {
              gtag('event', 'book_appointment', { value: 1200 });
            }
          `
        }}
      />

      {/* Sticky header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00C853] rounded-lg flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-[#1A1A2E]">ShieldHome Pro</span>
            <span className="text-xs text-gray-400 hidden sm:inline">Commercial Security</span>
          </div>
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#00C853]"
          >
            <Phone size={14} />
            {PHONE_NUMBER}
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="text-[#00C853]" size={52} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
            Your Assessment is Confirmed!
          </h1>
          <h2 className="text-lg text-gray-500">
            A commercial security specialist will meet with you at the scheduled time.
          </h2>
        </div>

        {/* What to expect */}
        <div className="space-y-4 mb-8">
          {[
            {
              icon: <MessageSquare className="text-[#00C853]" size={24} />,
              title: 'Confirmation on the way',
              desc: "You'll receive a confirmation text and email within the next few minutes.",
            },
            {
              icon: <Building2 className="text-[#00C853]" size={24} />,
              title: 'On-site visit',
              desc: 'Your specialist will arrive at your location at the scheduled time.',
            },
            {
              icon: <ClipboardList className="text-[#00C853]" size={24} />,
              title: 'Free security recommendation',
              desc: "They'll walk your property, identify any vulnerabilities, and provide a written security recommendation — no obligation.",
            },
          ].map(step => (
            <div key={step.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                {step.icon}
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A2E] mb-1">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar reminder box */}
        {hasCalendarData && (
          <div className="bg-white rounded-xl p-6 border-2 border-[#00C853] mb-8">
            <p className="font-bold text-[#1A1A2E] mb-4 text-center">
              Add it to your calendar so you don&apos;t forget!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={buildGoogleCalendarUrl({
                  title: calendarTitle,
                  startTime,
                  endTime,
                  description: calendarDescription,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-[#00C853] text-[#1A1A2E] px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" stroke="#4285F4" strokeWidth="2"/><path d="M16 2v4M8 2v4M4 10h16" stroke="#4285F4" strokeWidth="2" strokeLinecap="round"/></svg>
                Add to Google Calendar
              </a>
              <a
                href={buildIcsDataUri({
                  title: calendarTitle,
                  startTime,
                  endTime,
                  description: calendarDescription,
                })}
                download="security-assessment.ics"
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-[#00C853] text-[#1A1A2E] px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" stroke="#333" strokeWidth="2"/><path d="M16 2v4M8 2v4M4 10h16" stroke="#333" strokeWidth="2" strokeLinecap="round"/></svg>
                Add to Apple Calendar
              </a>
            </div>
          </div>
        )}

        {/* Testimonial */}
        <div className="bg-[#1A1A2E] rounded-2xl p-6 mb-8 text-center">
          <p className="text-white text-lg italic mb-3">
            &ldquo;The assessment was completely free and incredibly thorough. Had a quote the next day.&rdquo;
          </p>
          <p className="text-gray-400 text-sm font-semibold">
            — Mark D., Retail Manager
          </p>
        </div>

        {/* Phone CTA */}
        <div className="text-center">
          <p className="text-gray-500 mb-3">Questions? We&apos;re here to help.</p>
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            className="inline-flex items-center gap-2 bg-[#00C853] hover:bg-[#00A846] text-white px-8 py-3 rounded-xl font-bold text-lg transition-colors"
          >
            <Phone size={20} />
            Call Us: {PHONE_NUMBER}
          </a>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-xs">
        <p>ShieldHome Pro — Authorized Vivint Smart Home Dealer</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} ShieldHome Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default function AssessmentBookedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="text-[#00C853]" size={52} />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Loading confirmation...</h1>
        </div>
      </div>
    }>
      <AssessmentBookedContent />
    </Suspense>
  )
}

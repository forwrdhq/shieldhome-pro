'use client'

import { Phone, FileDown } from 'lucide-react'
import { fireMetaEvent } from '../../components/MetaPixelEvents'

const META_PHONE = process.env.NEXT_PUBLIC_META_PHONE || '(801) 616-6301'
const META_PHONE_RAW = process.env.NEXT_PUBLIC_META_PHONE_RAW || '+18016166301'

interface BookingCTAProps {
  eventId: string
  leadId: string | null
}

export default function BookingCTA({ eventId, leadId }: BookingCTAProps) {
  const handleCallClick = () => {
    fireMetaEvent('Schedule', {
      value: 350.0,
      currency: 'USD',
      content_name: 'phone_call_click',
      eventID: eventId,
    })
  }

  const handleDownloadClick = () => {
    fireMetaEvent('CompleteRegistration', {
      value: 10.0,
      currency: 'USD',
      content_name: 'guide_download',
    })
  }

  const downloadUrl = leadId
    ? `/api/guides/download?leadId=${leadId}&source=meta_results`
    : '/api/guides/download?source=meta_results'

  return (
    <div
      className="max-w-md mx-auto"
      style={{ animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 400ms both' }}
    >
      <h2 className="text-[20px] md:text-[24px] font-heading font-bold text-white text-center leading-[1.2] tracking-[-0.03em] mb-2">
        Ready to Protect Your Home?
      </h2>
      <p className="text-[13px] text-slate-400 font-body text-center mb-6">
        Speak with a security specialist now &mdash; no obligation.
      </p>

      {/* Primary CTA — Call */}
      <a
        href={`tel:${META_PHONE_RAW}`}
        onClick={handleCallClick}
        className="flex items-center justify-center gap-2.5 w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-semibold text-[15px] py-4 px-8 rounded-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
      >
        <Phone className="w-5 h-5" />
        CALL NOW: {META_PHONE}
      </a>
      <p className="text-[11px] text-slate-500 text-center mt-2.5 font-body">
        Free &bull; No obligation &bull; Takes 15 minutes
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-slate-700" />
        <span className="text-[11px] text-slate-500 font-body">or</span>
        <div className="flex-1 h-px bg-slate-700" />
      </div>

      {/* Secondary CTA — Download Guide */}
      <a
        href={downloadUrl}
        onClick={handleDownloadClick}
        className="flex items-center justify-center gap-2 w-full border border-slate-700 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 font-body text-[13px] py-3 px-6 rounded-lg transition-all duration-300 cursor-pointer"
      >
        <FileDown className="w-4 h-4" />
        Download Free Home Security Guide
      </a>
      <p className="text-[11px] text-slate-600 text-center mt-2 font-body">
        Not ready to talk? Get our 15-page guide with room-by-room security tips.
      </p>
    </div>
  )
}

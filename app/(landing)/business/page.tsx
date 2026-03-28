'use client'

import { useEffect } from 'react'
import StickyHeader from '@/components/business/StickyHeader'
import HeroSection from '@/components/business/HeroSection'
import PainBar from '@/components/business/PainBar'
import TrustBar from '@/components/business/TrustBar'
import ServicesGrid from '@/components/business/ServicesGrid'
import B2BComparisonTable from '@/components/business/B2BComparisonTable'
import TestimonialsSection from '@/components/business/TestimonialsSection'
import LeadCaptureForm from '@/components/business/LeadCaptureForm'
import B2BFAQSection from '@/components/business/B2BFAQSection'
import FinalCTABar from '@/components/business/FinalCTABar'
import MinimalFooter from '@/components/business/MinimalFooter'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export default function BusinessPage() {
  useEffect(() => {
    window.fbq?.('track', 'ViewContent', { content_name: 'B2B Landing Page' })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <StickyHeader />
      <HeroSection />
      <PainBar />
      <TrustBar />
      <ServicesGrid />
      <B2BComparisonTable />
      <TestimonialsSection />
      <LeadCaptureForm />
      <B2BFAQSection />
      <FinalCTABar />
      <MinimalFooter />
    </div>
  )
}

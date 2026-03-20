import StickyHeader from '@/components/business/StickyHeader'
import HeroSection from '@/components/business/HeroSection'
import PainBar from '@/components/business/PainBar'
import TrustBar from '@/components/business/TrustBar'
import ServicesGrid from '@/components/business/ServicesGrid'
import ComparisonTable from '@/components/business/ComparisonTable'
import TestimonialsSection from '@/components/business/TestimonialsSection'
import LeadCaptureForm from '@/components/business/LeadCaptureForm'
import FAQSection from '@/components/business/FAQSection'
import FinalCTABar from '@/components/business/FinalCTABar'
import MinimalFooter from '@/components/business/MinimalFooter'

export default function BusinessPage() {
  return (
    <main>
      <StickyHeader />
      <HeroSection />
      <PainBar />
      <TrustBar />
      <ServicesGrid />
      <ComparisonTable />
      <TestimonialsSection />
      <LeadCaptureForm />
      <FAQSection />
      <FinalCTABar />
      <MinimalFooter />
    </main>
  )
}

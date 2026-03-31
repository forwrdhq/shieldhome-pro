import dynamic from 'next/dynamic'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'
import BusinessHero from '@/components/business/BusinessHero'
import BusinessPainBar from '@/components/business/BusinessPainBar'

// Below-fold: lazy loaded for performance
const EightSecondCallout = dynamic(() => import('@/components/business/EightSecondCallout'))
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks'))
const BusinessSegments = dynamic(() => import('@/components/business/BusinessSegments'))
const PricingComparison = dynamic(() => import('@/components/business/PricingComparison'))
const BusinessFeatures = dynamic(() => import('@/components/business/BusinessFeatures'))
const ROICalculator = dynamic(() => import('@/components/business/ROICalculator'))
const ValueStack = dynamic(() => import('@/components/business/ValueStack'))
const BusinessTestimonials = dynamic(() => import('@/components/business/BusinessTestimonials'))
const NotForSection = dynamic(() => import('@/components/business/NotForSection'))
const GuaranteeSection = dynamic(() => import('@/components/business/GuaranteeSection'))
const CostOfInaction = dynamic(() => import('@/components/business/CostOfInaction'))
const BusinessLeadForm = dynamic(() => import('@/components/business/BusinessLeadForm'))
const BusinessFAQ = dynamic(() => import('@/components/business/BusinessFAQ'))
const WarningPS = dynamic(() => import('@/components/business/WarningPS'))
const StickyLeadCTA = dynamic(() => import('@/components/business/StickyLeadCTA'))

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BusinessPage({ searchParams }: PageProps) {
  const params = await searchParams
  const kw = typeof params.kw === 'string' ? params.kw : ''

  return (
    <div className="min-h-screen bg-white" id="hero-form">
      <Navigation />
      <BusinessHero />
      <BusinessPainBar />
      <EightSecondCallout />
      <HowItWorks
        title="Your Business Is Fully Protected in 48 Hours. Here's How:"
        subtitle="From first call to full coverage — fast, free, and fully handled"
        steps={[
          {
            icon: <span className="text-[20px]">📋</span>,
            title: 'Tell Us About Your Business (60 seconds)',
            description: 'Answer 4 quick questions — business type, current provider, number of locations, biggest security concern. No prep required. No paperwork. Just a short phone call.',
          },
          {
            icon: <span className="text-[20px]">📞</span>,
            title: 'Get Your Free Custom Quote (same day)',
            description: "A ShieldHome Business Pro calls you — usually within 2 hours. They'll walk you through a tailored quote, your ADT contract buyout options, and answer every question you have. No sales pressure.",
          },
          {
            icon: <span className="text-[20px]">🔧</span>,
            title: 'Free Professional Installation (within 48 hours)',
            description: "A certified Vivint technician handles everything. Most businesses are fully covered within 48 hours of your quote call. You don't lift a finger.",
          },
        ]}
        footer="Most installs take 2–3 hours. You don't need to be on-site the entire time. No pressure. No aggressive sales tactics. If ShieldHome isn't the right fit for your business, we'll tell you."
      />
      <BusinessSegments />
      <PricingComparison />
      <BusinessFeatures />
      <ROICalculator />
      <ValueStack />
      <BusinessTestimonials />
      <NotForSection />
      <GuaranteeSection />
      <CostOfInaction />
      <div id="quiz">
        <BusinessLeadForm kw={kw} />
      </div>
      <BusinessFAQ />
      <WarningPS />
      <Footer />
      <StickyLeadCTA />
    </div>
  )
}

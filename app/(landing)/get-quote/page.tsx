import dynamic from 'next/dynamic'
import TrustBar from '../google/components/TrustBar'
import CostHero from './components/CostHero'
import CostPageTracker from './components/CostPageTracker'

// Below-fold: lazy loaded for performance
const CostBreakdown = dynamic(() => import('./components/CostBreakdown'))
const ValueStack = dynamic(() => import('../google/components/ValueStack'))
const HiddenCosts = dynamic(() => import('./components/HiddenCosts'))
const ProductShowcase = dynamic(() => import('../google/components/ProductShowcase'))
const TrustSection = dynamic(() => import('../google/components/TrustSection'))
const TestimonialCarousel = dynamic(() => import('@/components/landing/TestimonialCarousel'))
const ComparisonSection = dynamic(() => import('../google/components/ComparisonSection'))
const CostFAQ = dynamic(() => import('./components/CostFAQ'))
const UrgencySection = dynamic(() => import('../google/components/UrgencySection'))
const GoogleStickyBar = dynamic(() => import('../google/components/GoogleStickyBar'))

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function GetQuotePage({ searchParams }: PageProps) {
  const params = await searchParams
  const kw = typeof params.kw === 'string' ? params.kw : ''

  return (
    <div className="min-h-screen bg-white" id="hero-form">
      <CostPageTracker />
      <TrustBar />
      <CostHero keyword={kw} />
      <CostBreakdown />
      <div id="value-stack">
        <ValueStack title="Here's What You Get for Less Than $1/Day" />
      </div>
      <HiddenCosts />
      <ComparisonSection />
      <ProductShowcase />
      <TrustSection />
      <TestimonialCarousel />
      <CostFAQ />
      <UrgencySection />
      <GoogleStickyBar />
    </div>
  )
}

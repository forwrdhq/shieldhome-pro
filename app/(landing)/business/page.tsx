import dynamic from 'next/dynamic'
import BusinessNav from '@/components/business/BusinessNav'
import BusinessHero from '@/components/business/BusinessHero'
import SocialProofTicker from '@/components/business/SocialProofTicker'
import BusinessPainBar from '@/components/business/BusinessPainBar'
import Footer from '@/components/landing/Footer'

const EightSecondCallout = dynamic(() => import('@/components/business/EightSecondCallout'))
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks'))
const BusinessSegments = dynamic(() => import('@/components/business/BusinessSegments'))
const PricingComparison = dynamic(() => import('@/components/business/PricingComparison'))
const BusinessFeatures = dynamic(() => import('@/components/business/BusinessFeatures'))
const ROICalculator = dynamic(() => import('@/components/business/ROICalculator'))
const BusinessTestimonials = dynamic(() => import('@/components/business/BusinessTestimonials'))
const ValueStack = dynamic(() => import('@/components/business/ValueStack'))
const NotForSection = dynamic(() => import('@/components/business/NotForSection'))
const GuaranteeSection = dynamic(() => import('@/components/business/GuaranteeSection'))
const BusinessLeadForm = dynamic(() => import('@/components/business/BusinessLeadForm'))
const BusinessFAQ = dynamic(() => import('@/components/business/BusinessFAQ'))
const StickyLeadCTA = dynamic(() => import('@/components/business/StickyLeadCTA'))

// ── Dynamic headline map — keyed to ?kw= for Google Ads Quality Score ──────
const HEADLINE_MAP: Record<string, { h1: string; subhead: string }> = {
  'business-security-system': {
    h1: 'Business Security Systems — Professional Installation, Zero Commercial Markup',
    subhead: "Same Vivint AI hardware your competitors pay 30–50% more for. We match residential pricing for any business. Stuck in a contract? We'll buy it out up to $1,000.",
  },
  'commercial-security': {
    h1: 'Commercial Security Systems Without the Commercial Markup',
    subhead: "Most commercial providers charge businesses 30–50% more for identical hardware. We don't. Free installation. $1,000 contract buyout included.",
  },
  'business-security-cameras': {
    h1: 'AI Business Security Cameras — Free Professional Installation',
    subhead: "Vivint's AI Smart Deter cameras stop crime before it starts. $0 down. Free install. In a contract? We cover up to $1,000 to get you out.",
  },
  'adt-business-alternative': {
    h1: "Switch From ADT Business — We'll Cover Up to $1,000 of Your Contract",
    subhead: "ADT charges businesses up to $49.99/mo for the same hardware we provide from $39.99/mo. No commercial markup. Contract buyout up to $1,000 included.",
  },
  'small-business-security': {
    h1: 'Security Systems for Small Business — No Commercial Markup, Ever',
    subhead: "Built for 1–10 location businesses. AI monitoring, smart cameras, professional installation — free. Locked in a contract? We cover up to $1,000.",
  },
  'vivint-business': {
    h1: 'Vivint Business Security — Authorized Dealer, Exclusive Pricing',
    subhead: "Get Vivint's AI-powered commercial security at residential rates through ShieldHome Pro. Free installation. $1,000 contract buyout. No commercial surcharge.",
  },
  'warehouse-security': {
    h1: 'Warehouse & Industrial Security Systems — 4K Coverage, Free Install',
    subhead: "4K HDR cameras with 40×50ft motion detection. Up to 12 cameras per site. Professional installation at no cost. Monitoring from $39.99/mo.",
  },
  'office-security': {
    h1: 'Office Security Systems — Smart Access Control, No Commercial Markup',
    subhead: "Per-employee smart lock codes. Remote grant/revoke from your phone. AI cameras. Free professional installation. Monitoring from $39.99/mo.",
  },
  default: {
    h1: 'Business Security Systems — No Commercial Markup, Free Installation',
    subhead: "Same Vivint AI hardware. Same professional installation. No commercial markup — ever. Stuck in a contract? We cover up to $1,000 to get you out.",
  },
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BusinessPage({ searchParams }: PageProps) {
  const params = await searchParams
  const kw = typeof params.kw === 'string' ? params.kw : ''
  const kwKey = kw.toLowerCase().replace(/\s+/g, '-') || 'default'
  const headline = HEADLINE_MAP[kwKey] ?? HEADLINE_MAP['default']

  return (
    <div className="min-h-screen bg-slate-900" id="hero-form">
      {/* 1. Minimal nav — logo + phone only */}
      <BusinessNav />

      {/* 3. Hero — copy left + inline 2-step form right */}
      <BusinessHero h1={headline.h1} subhead={headline.subhead} kw={kw} />

      {/* 4. Social proof ticker */}
      <SocialProofTicker />

      {/* 5. Problem section — "The Commercial Tax" */}
      <BusinessPainBar />

      {/* 6. 8-second response stat block */}
      <EightSecondCallout />

      {/* 7. 3-step process */}
      <HowItWorks
        title="Your Business Is Fully Protected in 48 Hours. Here's How:"
        subtitle="From first call to full coverage — fast, free, and fully handled"
        steps={[
          {
            icon: <span className="text-[20px]">📋</span>,
            title: 'Tell Us About Your Business (60 seconds)',
            description: 'Answer 4 quick questions — business type, current provider, number of locations, biggest security concern. No prep required. No paperwork. Just this form.',
          },
          {
            icon: <span className="text-[20px]">📞</span>,
            title: 'Get Your Free Custom Quote (same day)',
            description: "A ShieldHome Business Pro calls you — usually within 2 hours. They'll walk you through a tailored quote, your buyout options, and answer every question. No sales pressure.",
          },
          {
            icon: <span className="text-[20px]">🔧</span>,
            title: 'Free Professional Installation (within 48 hours)',
            description: "A certified Vivint technician handles everything. Most businesses are fully covered within 48 hours of the quote call. You don't lift a finger.",
          },
        ]}
        footer="No pressure. No aggressive sales tactics. If ShieldHome isn't the right fit for your business, we'll tell you on the call. Most installs take 2–3 hours."
      />

      {/* 8. Industry tabs */}
      <BusinessSegments />

      {/* 9. Comparison table */}
      <PricingComparison />

      {/* 10. Feature benefits */}
      <BusinessFeatures />

      {/* 11. ROI Calculator */}
      <ROICalculator />

      {/* 12. Testimonials */}
      <BusinessTestimonials />

      {/* 13. Offer stack */}
      <ValueStack />

      {/* 14. NOT for you / IS for you */}
      <NotForSection />

      {/* 15. Guarantee */}
      <GuaranteeSection />

      {/* 16. Final CTA + full lead form */}
      <div id="quiz">
        <BusinessLeadForm kw={kw} />
      </div>

      {/* 17. FAQ */}
      <BusinessFAQ />

      <Footer />

      {/* 18. Sticky mobile CTA */}
      <StickyLeadCTA />
    </div>
  )
}

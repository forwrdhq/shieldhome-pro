import dynamic from 'next/dynamic'
import TrustBar from './components/TrustBar'
import HeroSection from './components/HeroSection'

const PromoBanner = dynamic(() => import('./components/PromoBanner'))

// Below-fold: lazy loaded for performance
const SystemIncludesStrip = dynamic(() => import('./components/SystemIncludesStrip'))
const ValueStack = dynamic(() => import('./components/ValueStack'))
const ProductShowcase = dynamic(() => import('./components/ProductShowcase'))
const DoorbellDeepDive = dynamic(() => import('./components/DoorbellDeepDive'))
const TrustSection = dynamic(() => import('./components/TrustSection'))
const WhyVivintSection = dynamic(() => import('./components/WhyVivintSection'))
const AwardsMarquee = dynamic(() => import('./components/AwardsMarquee'))
const ComparisonSection = dynamic(() => import('./components/ComparisonSection'))
const GoogleFAQ = dynamic(() => import('./components/GoogleFAQ'))
const BuyoutSection = dynamic(() => import('./components/BuyoutSection'))
const UrgencySection = dynamic(() => import('./components/UrgencySection'))
const GoogleStickyBar = dynamic(() => import('./components/GoogleStickyBar'))
const ExitIntentPopup = dynamic(() => import('./components/ExitIntentPopup'))

// ── Headline Map ──

const headlineMap: Record<string, string> = {
  'home-security-system': 'Smarter Security That Fights Back — Installed Tomorrow, $0 Down',
  'home-security-installation': 'Smarter Security That Fights Back — Installed Tomorrow, $0 Down',
  'home-security': 'Smarter Security That Fights Back — Installed Tomorrow, $0 Down',
  'vivint-dealer': 'Vivint Authorized Dealer — Free Installation + $0 Down',
  'vivint-near-me': 'Vivint Authorized Dealer — Free Installation + $0 Down',
  'vivint': 'Vivint Authorized Dealer — Free Installation + $0 Down',
  'best-home-security': 'The #1 Rated Smart Home Security System — Installed Tomorrow',
  'home-security-near-me': 'Top-Rated Home Security — Free Installation + $0 Down',
  'adt-alternative': 'Switch to Smarter Security — We Pay Up to $1,000 to Buy Out Your Contract',
  'switch-security': 'Switch to Smarter Security — We Pay Up to $1,000 to Buy Out Your Contract',
  'security-cameras': 'Smart Security Cameras with 24/7 Pro Monitoring',
  'home-alarm': 'Smart Home Alarm Systems — Installed in 24 Hours',
  'security-system': 'Complete Security System — $0 Down, Free Installation',
}

const defaultHeadline = 'Smarter Security That Fights Back — Installed Tomorrow, $0 Down'

const BUYOUT_KEYWORDS = ['adt-alternative', 'switch-security', 'switch', 'buyout', 'adt', 'simplisafe-switch', 'ring-switch']

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function GooglePage({ searchParams }: PageProps) {
  const params = await searchParams
  const kw = typeof params.kw === 'string' ? params.kw : ''
  const city = typeof params.city === 'string' ? params.city : ''

  // Resolve headline
  let headline = headlineMap[kw] || defaultHeadline
  if (city) {
    headline = `${city}'s Top-Rated Home Security — Free Installation + $0 Down`
  }

  // Determine if buyout visitor
  const isBuyoutVisitor = BUYOUT_KEYWORDS.some((bk) => kw.toLowerCase().includes(bk))

  // Pre-headline
  const preHeadline = city
    ? `Exclusive Vivint Deals in ${city}`
    : 'Exclusive Deals From a Top Vivint Authorized Partner'

  return (
    <div className="min-h-screen bg-white" id="hero-form">
      <TrustBar />
      <PromoBanner />
      <HeroSection
        headline={headline}
        preHeadline={preHeadline}
      />
      <SystemIncludesStrip />
      <ValueStack isBuyoutVisitor={isBuyoutVisitor} />
      <ProductShowcase />
      <DoorbellDeepDive />
      <TrustSection />
      {isBuyoutVisitor && <BuyoutSection />}
      <WhyVivintSection />
      <AwardsMarquee />
      <ComparisonSection />
      <GoogleFAQ />
      <UrgencySection />
      <GoogleStickyBar />
      <ExitIntentPopup />
    </div>
  )
}

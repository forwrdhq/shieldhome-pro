import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Home Security — Free Installation, $0 Down | ShieldHome Pro',
  description: 'Get a free home security assessment from a Vivint authorized dealer. Same-day installation, $0 down, 60-day money-back guarantee. Call (877) 555-0199.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Professional Home Security — Free Installation, $0 Down',
    description: 'Custom Vivint smart home systems with free professional installation. See your personalized quote in 30 seconds.',
    type: 'website',
    url: 'https://shieldhomepro.com/google',
    siteName: 'ShieldHome Pro',
  },
  alternates: {
    canonical: 'https://shieldhomepro.com/google',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'ShieldHome Pro',
  description: 'Authorized Vivint Smart Home Dealer — free home security assessments and professional installation.',
  telephone: '+18775550199',
  url: 'https://shieldhomepro.com',
  priceRange: '$0 - $200/mo',
  address: { '@type': 'PostalAddress', addressCountry: 'US' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    bestRating: '5',
    worstRating: '1',
    reviewCount: '58000',
  },
}

export default function GoogleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {children}
    </>
  )
}

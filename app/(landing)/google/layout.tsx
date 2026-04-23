import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Home Security — Free Installation, $0 Down | ShieldHome Pro',
  description: 'Get a free home security quote from a top Vivint Smart Home marketing partner. Same-day installation, $0 down. Exclusive deals nationwide.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Professional Home Security — Free Installation, $0 Down',
    description: 'Custom Vivint smart home systems with free professional installation. See your personalized quote in 30 seconds.',
    type: 'website',
    url: 'https://shieldhomepro.com/google',
    siteName: 'ShieldHome Pro',
  },
  twitter: {
    title: 'Professional Home Security — Free Installation, $0 Down | ShieldHome Pro',
    description: 'Exclusive Vivint deals with free professional installation nationwide. $0 down.',
  },
  alternates: {
    canonical: 'https://shieldhome.pro/google',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ShieldHome Pro',
  description: 'Top-performing Vivint Smart Home marketing partner — exclusive package deals, free professional installation, and bonus equipment nationwide.',
  telephone: '+18013486050',
  url: 'https://shieldhome.pro',
  priceRange: '$0 - $200/mo',
  areaServed: { '@type': 'Country', name: 'US' },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </>
  )
}

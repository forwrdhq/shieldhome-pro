import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Home Security Quote | Vivint Authorized Dealer | ShieldHome Pro',
  description: 'Get a free custom home security quote in 60 seconds. $0 down, free expert setup, free doorbell camera. Vivint\'s #1-rated smart home security. Call (877) 555-0199.',
  robots: 'index, follow',
  openGraph: {
    title: 'Is Your Home Protected? Free Security Assessment',
    description: 'Find out your home\'s security risk score in 60 seconds. Free quote, $0 down, free setup.',
    type: 'website',
    url: 'https://shieldhome.pro',
    siteName: 'ShieldHome Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Is Your Home Protected? Free Security Assessment',
    description: 'Find out your home\'s security risk score in 60 seconds. Free quote, $0 down, free setup.',
  },
  alternates: {
    canonical: 'https://shieldhome.pro',
  },
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'ShieldHome Pro',
  description: 'Authorized Vivint Smart Home Dealer providing free home security quotes and expert setup.',
  telephone: '+18775550199',
  url: 'https://shieldhome.pro',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '58000',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free expert setup and doorbell camera',
  },
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}

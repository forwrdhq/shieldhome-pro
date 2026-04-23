import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home Security System Cost 2026 — Pricing Guide | ShieldHome Pro',
  description:
    'How much does home security cost? Compare prices from $0 down. Professional installation included. Get your custom quote in 60 seconds.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Home Security System Cost 2026 — Pricing Guide | ShieldHome Pro',
    description:
      'How much does home security cost? Compare prices from $0 down. Professional installation included.',
    type: 'website',
    url: 'https://shieldhome.pro/get-quote',
    images: [
      {
        url: 'https://shieldhome.pro/og-get-quote.jpg',
        width: 1200,
        height: 630,
        alt: 'ShieldHome Pro — Home Security Cost Guide 2026',
      },
    ],
  },
  alternates: {
    canonical: 'https://shieldhome.pro/get-quote',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Security System Cost 2026 | ShieldHome Pro',
    description:
      'How much does home security cost? Compare prices from $0 down. Get your custom quote in 60 seconds.',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ShieldHome Pro',
  description:
    'Top-performing Vivint Smart Home marketing partner — exclusive package deals, free professional installation, and bonus equipment nationwide.',
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does home security cost per month?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Professional home security monitoring typically costs $25–$60/month depending on your system and provider. Through ShieldHome, plans start at $24.99/month and include 24/7 professional monitoring, the mobile app, and smart home controls. Most families pay $35–$55/month total.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a cheaper alternative to ADT?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. ADT's monitoring starts at $24.99/month but requires a $99–$199 installation fee and often a 36-month contract. Through ShieldHome, you get Vivint's #1-rated system with free professional installation, $0 down, and flexible terms — often saving $500–$1,000 in the first year compared to ADT.",
      },
    },
    {
      '@type': 'Question',
      name: 'How much does this actually cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The Total Shield Package starts at $0 down with monitoring as low as $24.99/month. Most families pay $35-$55/month total including equipment financing. That's less than $2/day for complete home protection.",
      },
    },
    {
      '@type': 'Question',
      name: 'Am I locked into a long contract?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Once your equipment is paid off, you're month-to-month with no cancellation fees. If you finance over 36 months, you have a service agreement during that period — but your equipment is yours and your rate is locked in.",
      },
    },
    {
      '@type': 'Question',
      name: 'I already have ADT/SimpliSafe/Ring. Why switch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We'll pay up to $1,000 to buy out your existing contract. Vivint's Smart Deter cameras don't just record — they actively deter intruders with spotlights, sirens, and 2-way audio. Plus you get free installation and a Visa gift card.",
      },
    },
    {
      '@type': 'Question',
      name: 'How fast can you install?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most installations happen within 24-48 hours. In many cases, same-day. Your certified technician handles everything — placement, wiring, app setup, and training. Your only job is to answer the door.',
      },
    },
    {
      '@type': 'Question',
      name: "What if I don't like it?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Our 60-day Protected Home Promise means you try the full system risk-free. If you're not completely satisfied for any reason, we remove everything and refund your money.",
      },
    },
    {
      '@type': 'Question',
      name: 'Who is ShieldHome? Is this legit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "ShieldHome is a top-performing Vivint Smart Home marketing partner. Because of our volume and direct relationship with Vivint, we negotiate exclusive promotions, bonus equipment, and package deals that aren't available on Vivint.com or through most other partners. Once your system is installed, you're a full Vivint customer with 24/7 monitoring, the app, and all warranties — we just get you a better deal getting there.",
      },
    },
  ],
}

export default function GetQuoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}

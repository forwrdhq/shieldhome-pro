import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Home Security Quote | Smart Home Security Specialists | ShieldHome Pro',
  description: 'Get a free custom home security quote in 60 seconds. $0 down, free expert setup, free doorbell camera. Vivint\'s #1-rated smart home security. Call (801) 348-6050.',
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

// JSON-LD Structured Data - LocalBusiness
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'ShieldHome Pro',
  description: 'Vivint Smart Home marketing partner providing free home security quotes and expert setup.',
  telephone: '+18013486050',
  url: 'https://shieldhome.pro',
  priceRange: '$0 - $200/mo',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    bestRating: '5',
    worstRating: '1',
    reviewCount: '58000',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free expert setup and doorbell camera',
  },
  sameAs: [],
}

// FAQ Schema — synced with on-page FAQ content
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is installation really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Professional installation by a certified Vivint technician is included at no cost. Most installations are completed in under 2 hours. Your technician handles all wiring, mounting, configuration, and walks you through the app before they leave.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a long-term contract?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Vivint offers flexible month-to-month monitoring plans. No multi-year commitment required. You can cancel anytime — though with a 4.8/5 rating from 58,000+ reviews, most customers stay for years.',
      },
    },
    {
      '@type': 'Question',
      name: 'How fast can I get protected?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most homes are fully installed within 24–48 hours of your consultation. We schedule at your convenience — mornings, evenings, and weekends available.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I control everything from my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Vivint Smart Home app gives you full control of cameras, locks, sensors, thermostat, and garage from anywhere. Live HD camera feeds, instant alerts, and one-tap arming/disarming.',
      },
    },
    {
      '@type': 'Question',
      name: 'What equipment do I get?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Your custom system can include indoor/outdoor AI cameras, a video doorbell (free with qualifying systems), smart locks, door/window sensors, motion detectors, and a 7\" touchscreen control panel. Your advisor designs the system around your home's specific layout.",
      },
    },
    {
      '@type': 'Question',
      name: 'What does monitoring cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Plans start at $19.95/month for basic monitoring. Most homeowners choose a package in the $29–$45/month range depending on how many cameras and smart devices they want. Your advisor will build a custom quote — you only pay for what you actually need.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is ShieldHome Pro the same as Vivint?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "ShieldHome Pro is a Vivint Smart Home marketing partner. We help homeowners get set up with Vivint's #1-rated security system. Once your system is set up, you're a full Vivint customer with 24/7 monitoring, support, the app, and all warranties.",
      },
    },
  ],
}

// HowTo Schema
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Get Free Home Security Setup with Vivint',
  description: 'Get a free custom home security quote and professional installation in 3 simple steps.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Tell us about your home',
      text: 'Enter your ZIP code and a few details about your home to get a custom recommendation. Takes about 30 seconds.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Get your custom plan',
      text: 'A Vivint Smart Home Pro will call you with a personalized security package and pricing — no obligation.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Free professional installation in 24-48 hours',
      text: 'A certified Vivint technician comes to your home, installs everything, connects your app, and walks you through the system — at no cost.',
    },
  ],
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {children}
    </>
  )
}

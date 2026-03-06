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

// JSON-LD Structured Data - LocalBusiness
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'ShieldHome Pro',
  description: 'Authorized Vivint Smart Home Dealer providing free home security quotes and expert setup.',
  telephone: '+18775550199',
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

// FAQ Schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a Vivint system cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every home is different, so we give free custom quotes. Most homeowners pay $0 upfront for equipment with free expert setup. Monthly monitoring starts around $1.33/day (about $39.99/month). Your Smart Home Pro will build a package based on your home\'s size and needs — so you only pay for what you need.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is expert setup really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — 100% free. Vivint sends a certified tech to your home at no charge. They\'ll set up all equipment, connect everything to your WiFi, set up your app, and walk you through how it all works. Most setups take 2-4 hours. No hidden fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a landline or internet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No landline needed. Vivint systems use a built-in cell connection, so your system stays connected even if your WiFi goes down. WiFi is used for camera streaming and smart home features, but the core security works over cellular. This is more reliable than old landline systems.',
      },
    },
    {
      '@type': 'Question',
      name: "What's the contract length?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vivint offers plans from month-to-month to multi-year. Longer plans often come with better equipment pricing and promos (like the free doorbell camera). Your Smart Home Pro will walk you through all options so you can pick what works best for your budget.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I keep my smart home devices?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Usually, yes. Vivint works with Google Assistant, Amazon Alexa, Philips Hue, Kwikset locks, Nest thermostats, and many other popular devices. Your tech can connect them during setup. If you have an existing security system, Vivint can often use existing wiring.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if the power goes out?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vivint systems have battery backup that keeps security running during outages — usually 24+ hours. Since the system uses cell signal (not just WiFi), monitoring continues even if your internet goes down. You\'ll get a phone alert if power is lost.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if I move?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Vivint makes moving easy. They'll send a pro to take down your equipment and set it up at your new home. Many customers use this as a chance to upgrade or add new equipment too.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is ShieldHome Pro the same as Vivint?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "ShieldHome Pro is an authorized dealer of Vivint Smart Home. We help homeowners get set up with Vivint's #1-rated security system. Once your system is set up, you're a full Vivint customer with 24/7 monitoring, support, the app, and all warranties.",
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
      name: 'Take the 60-Second Quiz',
      text: 'Answer a few quick questions about your home and security needs to get a custom recommendation.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Get Your Free Custom Quote',
      text: 'A Vivint Smart Home Pro will call you with a personalized security package and pricing — no obligation.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Free Expert Setup in 24-48 Hours',
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

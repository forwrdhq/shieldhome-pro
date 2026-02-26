import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ShieldHome Pro — Vivint Authorized Dealer | Free Home Security Quote',
  description: 'Get a free custom home security quote from an authorized Vivint dealer. Professional installation included. 24/7 monitoring from $1.33/day.',
  openGraph: {
    title: 'ShieldHome Pro — Free Home Security Quote',
    description: 'Professional Vivint security systems. Free installation. Free doorbell camera.',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      name: 'ShieldHome Pro',
      description: 'Authorized Vivint Smart Home dealer providing professional home security installation and 24/7 monitoring.',
      url: process.env.NEXT_PUBLIC_APP_URL || 'https://shieldhomepro.com',
      telephone: process.env.NEXT_PUBLIC_PHONE_NUMBER || '',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '58000',
        bestRating: '5',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does a Vivint system cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every home is different, which is why we provide free custom quotes. Most homeowners pay $0 upfront for equipment with professional installation included. Monthly monitoring starts at around $1.33/day (roughly $39.99/month).',
          },
        },
        {
          '@type': 'Question',
          name: 'Is professional installation really free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes — 100% free. Vivint sends a certified Smart Home Pro technician to your home at no charge. Most installations are completed in 2-4 hours with no hidden installation fees.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need a landline or internet connection?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No landline is needed. Vivint systems use a built-in cellular connection as the primary communication method, so your system stays connected even if your WiFi goes down.',
          },
        },
        {
          '@type': 'Question',
          name: "What's the contract length?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Vivint offers service agreements ranging from month-to-month to multi-year plans. Longer agreements often come with better equipment pricing and promotions.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is ShieldHome Pro the same as Vivint?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "ShieldHome Pro is an independently operated authorized dealer of Vivint Smart Home products and services. Once your system is installed, you're a full Vivint customer with access to their 24/7 monitoring, customer support, app, and all service warranties.",
          },
        },
      ],
    },
  ],
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

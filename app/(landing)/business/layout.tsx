import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Security Systems | No Commercial Markup | ShieldHome Pro',
  description:
    'Professional business security systems with zero commercial markup. Same Vivint AI hardware. Free installation. Up to $1,000 contract buyout. Call (801) 348-6050.',
  keywords:
    'business security system, commercial security system, small business security cameras, business security monitoring, Vivint business security, ADT business alternative',
  openGraph: {
    title: 'Get Vivint AI Security Installed FREE — We\'ll Buy Out Your Current Contract Up to $1,000',
    description:
      'Professional commercial security from $39.99/mo. No commercial markup. Free professional installation. Contract buyout up to $1,000. 30-Day Satisfaction Guarantee. Get a free quote.',
    type: 'website',
    url: 'https://shieldhome.pro/business',
    siteName: 'ShieldHome Pro',
  },
  twitter: {
    title: 'Business Security Systems | No Commercial Markup | ShieldHome Pro',
    description:
      'Vivint-powered business security from $39.99/mo. Free professional installation. Contract buyout up to $1,000. 30-Day Satisfaction Guarantee.',
  },
  alternates: {
    canonical: 'https://shieldhome.pro/business',
  },
}

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ShieldHome Pro — Commercial Security',
  description:
    'Authorized Vivint dealer providing commercial and business security systems with no commercial markup. AI cameras, smart locks, 8-second monitoring response.',
  telephone: '+18013486050',
  url: 'https://shieldhome.pro/business',
  priceRange: '$39.99 - $200/mo',
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
      name: 'Does Vivint actually charge businesses the same as homes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Equipment and installation are identical — same 4K cameras, same smart locks, same AI hardware. Business monitoring starts at $39.99/mo, comparable to residential Smart Home plans. There is no commercial surcharge on hardware the way most competitors structure their business pricing.',
      },
    },
    {
      '@type': 'Question',
      name: "What's your 30-Day Guarantee exactly?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Simple and unconditional. If you're not completely satisfied within 30 days of installation — for any reason — we'll send a technician back out, adjust the system to your needs, or refund your first month's monitoring fee. No arguments. No conditions.",
      },
    },
    {
      '@type': 'Question',
      name: "I'm locked into a contract with my current provider. What happens?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We cover contract buyouts up to $1,000 regardless of your current provider. Your ShieldHome Pro will assess your exact situation on the quote call. In most cases, the monitoring savings plus the buyout means you're financially ahead from Month 1.",
      },
    },
    {
      '@type': 'Question',
      name: 'I have multiple locations. Can you manage that?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Vivint supports multiple locations under one account and one app. Your ShieldHome Pro will quote each location individually. Multi-location customers typically see larger total savings because the markup compounds across every site.',
      },
    },
    {
      '@type': 'Question',
      name: "Is installation actually free — what's the catch?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "100% free. Certified Vivint technician. No hidden fees. The arrangement is that you become a Vivint monitoring customer — the free installation is tied to the monitoring plan. Your ShieldHome Pro will be completely transparent about the full cost structure on the call. No surprises.",
      },
    },
    {
      '@type': 'Question',
      name: 'Will this qualify me for an insurance discount?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In almost every case, yes. We provide the documentation your carrier needs to apply the monitored security discount — typically 5–20% on your annual premium. Most business owners save $500–$2,000/yr.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the contract options?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Month-to-month through to multi-year. Longer plans include better equipment promotions. No pressure to commit to any term — your ShieldHome Pro will walk you through what makes financial sense for your specific situation.",
      },
    },
    {
      '@type': 'Question',
      name: 'How is ShieldHome different from calling Vivint directly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "ShieldHome Pro works directly with Vivint Smart Home professionals to bring you exclusive promotions — like the current free AI camera upgrade — that aren't always available direct. You're still a full Vivint customer with all warranties, monitoring, and support. We just get you better entry deals.",
      },
    },
    {
      '@type': 'Question',
      name: 'What if something malfunctions after installation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "All Vivint equipment carries a manufacturer warranty. Vivint's monitoring center also runs remote diagnostics. If something needs an on-site fix, a technician is dispatched. ShieldHome customers have a direct line to our team for the lifetime of the account.",
      },
    },
  ],
}

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}

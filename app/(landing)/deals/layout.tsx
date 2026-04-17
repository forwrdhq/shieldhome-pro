import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '$2,847 Vivint Smart Security System for $0 Down | ShieldHome Pro',
  description:
    'Authorized Vivint Dealer — Total Shield Package: $2,847 system for $0 down. Free professional installation, 60-day money-back guarantee. See if you qualify in 60 seconds.',
  // noindex: this is a paid-traffic / A/B variant of the homepage; avoid duplicate content.
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Get a $2,847 Vivint Smart Security System for $0 Down',
    description:
      'Authorized Vivint Dealer pricing. Free professional installation. Install this week. See if you qualify in 60 seconds.',
    type: 'website',
    url: 'https://shieldhome.pro/deals',
    siteName: 'ShieldHome Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get a $2,847 Vivint Smart Security System for $0 Down',
    description: 'Authorized Vivint Dealer pricing. Free pro install. See if you qualify in 60 seconds.',
  },
  alternates: {
    canonical: 'https://shieldhome.pro/deals',
  },
}

export default function DealsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

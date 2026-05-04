import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Smartest Home Security in America — Now $0 Down | ShieldHome Pro',
  description:
    "Smart Home Security Specialists — PCMag's 2026 #1-rated smart security system at partner pricing. $0 down, free professional installation. Most homes protected within 48 hours.",
  // noindex: this is a paid-traffic / A/B variant of the homepage; avoid duplicate content.
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'The Smartest Home Security in America — Now $0 Down',
    description:
      'Best Security, Best Plan — At The Right Price. Free professional installation. Most homes protected within 48 hours. See if you qualify in 60 seconds.',
    type: 'website',
    url: 'https://shieldhome.pro/deals',
    siteName: 'ShieldHome Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Smartest Home Security in America — Now $0 Down',
    description: 'Best Security, Best Plan — At The Right Price. Free pro install. Protected in 48 hours.',
  },
  alternates: {
    canonical: 'https://shieldhome.pro/deals',
  },
}

export default function DealsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

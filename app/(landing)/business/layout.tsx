import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commercial Security at Residential Rates — Vivint Authorized Dealer | ShieldHome Pro',
  description: 'Smart commercial security systems starting at ~$40/mo. 8-second response time, 0% financing, no contract required. Get a free security assessment for your business.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Smart Commercial Security at Residential Rates',
    description: 'Most businesses overpay by 30–40% for outdated monitoring. Get a free security assessment and see how much you could save.',
    type: 'website',
    url: 'https://shieldhome.pro/business',
    siteName: 'ShieldHome Pro',
  },
}

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

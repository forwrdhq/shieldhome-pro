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

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

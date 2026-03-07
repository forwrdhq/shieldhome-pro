import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home Security Cost Calculator — Get Your Estimate | ShieldHome Pro',
  description: 'Calculate the cost of a home security system for your home. Customize cameras, sensors, smart locks, and monitoring. Get an instant estimate and free quote.',
  alternates: {
    canonical: 'https://shieldhome.pro/home-security-cost-calculator',
  },
  openGraph: {
    title: 'Home Security Cost Calculator',
    description: 'Calculate home security costs for your home. Instant estimates, free quotes.',
    url: 'https://shieldhome.pro/home-security-cost-calculator',
  },
}

export default function CostCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

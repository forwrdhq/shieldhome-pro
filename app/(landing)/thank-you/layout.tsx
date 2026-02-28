import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thank You! — ShieldHome Pro',
  description: 'Your free home security quote request has been received.',
}

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

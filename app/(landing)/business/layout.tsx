import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commercial Security Systems for Business — ShieldHome Pro',
  description: 'Smart commercial security at residential rates. Professional monitoring, AI cameras, and access control for your business. Free assessment, no obligation.',
  robots: 'noindex, nofollow',
}

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

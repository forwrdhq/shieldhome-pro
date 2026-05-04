import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Home Security Quote — Vivint Smart Home Partner',
  description: 'Get a free home security quote in 60 seconds. Free expert setup + free doorbell camera.',
  robots: 'noindex, nofollow',
}

export default function FacebookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

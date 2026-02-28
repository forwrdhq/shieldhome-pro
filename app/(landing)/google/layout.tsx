import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Home Security Systems — Free Setup | ShieldHome Pro',
  description: 'Get a free home security quote from a Vivint authorized dealer. Expert setup, 24/7 monitoring, AI-powered cameras. Free doorbell camera included.',
}

export default function GoogleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

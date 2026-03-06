import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: 'index, follow',
  openGraph: {
    siteName: 'ShieldHome Pro',
    type: 'website',
  },
}

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: 'index, follow',
  openGraph: {
    siteName: 'ShieldHome Pro',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'ShieldHome Pro — Free Home Security Quote',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
}

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

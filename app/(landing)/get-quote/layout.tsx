import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Home Security Quote — $0 Down, Free Setup | ShieldHome',
  description:
    'Get your free home security quote. Professional Vivint installation, 24/7 monitoring, $0 down. Most homes protected within 48 hours.',
  openGraph: {
    title: 'Free Home Security Quote — $0 Down, Free Setup | ShieldHome',
    description:
      'Professional Vivint smart home security. Free installation, free doorbell camera, $0 down. Get your custom quote in 60 seconds.',
    type: 'website',
    url: 'https://shieldhome.pro/get-quote',
    images: [
      {
        url: 'https://shieldhome.pro/og-get-quote.jpg',
        width: 1200,
        height: 630,
        alt: 'ShieldHome Pro — Free Home Security Quote',
      },
    ],
  },
  alternates: {
    canonical: 'https://shieldhome.pro/get-quote',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Home Security Quote — $0 Down | ShieldHome',
    description:
      'Professional Vivint installation, 24/7 monitoring, $0 down. Get your custom quote.',
  },
}

export default function GetQuoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

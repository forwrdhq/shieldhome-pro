import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Switch Home Security Providers — Up to $1,000 Contract Buyout | ShieldHome',
  description:
    "Stuck in a security contract? ShieldHome will pay up to $1,000 to buy out your contract and switch you to Vivint's #1-rated smart home system. Free installation, no long-term commitment.",
  openGraph: {
    title: 'Switch Home Security Providers — Up to $1,000 Contract Buyout',
    description:
      "We'll pay up to $1,000 to buy out your security contract. Free professional installation, latest smart home technology, no long-term commitment.",
    url: 'https://shieldhome.pro/switch',
    type: 'website',
  },
}

export default function SwitchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

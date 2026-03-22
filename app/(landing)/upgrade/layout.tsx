import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upgrade Your Vivint System — Buy 2 Cameras Get 1 Free | ShieldHome',
  description:
    'Exclusive offer for Vivint customers. Buy 2 cameras get 1 free, plus save up to $500 on new equipment. Professional installation included.',
  openGraph: {
    title: 'Upgrade Your Vivint System — Buy 2 Cameras Get 1 Free',
    description:
      'Exclusive upgrade offer for existing Vivint customers. Buy 2 cameras get 1 free. Save up to $500 on new equipment. Professional installation included.',
    url: 'https://shieldhome.pro/upgrade',
    type: 'website',
  },
}

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

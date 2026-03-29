import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Protected Is Your Home? | Free Security Assessment — ShieldHome Pro',
  description: 'Take the 90-second Home Security Assessment. Get your personalized Security Score and see what protection your home qualifies for.',
  robots: 'noindex, nofollow',
}

export default function MetaFunnelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {children}
    </div>
  )
}

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Home Security Assessment | ShieldHome',
  description:
    'Take the 60-second home security assessment and get a personalized security recommendation. Free, no obligation.',
  robots: 'noindex, nofollow',
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

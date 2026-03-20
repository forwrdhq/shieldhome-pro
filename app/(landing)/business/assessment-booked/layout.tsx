import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assessment Confirmed — ShieldHome Pro Commercial Security',
  description: 'Your commercial security assessment has been booked. A specialist will meet with you at the scheduled time.',
}

export default function AssessmentBookedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

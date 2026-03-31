import type { Metadata } from 'next'
import MetaQuizFunnel from './components/MetaQuizFunnel'

export const metadata: Metadata = {
  title: 'Is Your Home Secure? | Free 90-Second Security Score — ShieldHome Pro',
  description:
    'Answer 7 quick questions and get your personalized Home Security Score. Find out exactly where your home is vulnerable — free, no obligation.',
}

export default function MetaQuizPage() {
  return (
    <main className="min-h-screen">
      <MetaQuizFunnel />
    </main>
  )
}

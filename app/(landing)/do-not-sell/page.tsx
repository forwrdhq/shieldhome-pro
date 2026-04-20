import Link from 'next/link'
import { Shield } from 'lucide-react'
import { PHONE_NUMBER, COMPANY_NAME, COMPANY_ADDRESS } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Do Not Sell or Share My Personal Information | ShieldHome Pro',
  description: 'Submit a request to opt out of the sale or sharing of your personal information.',
  robots: { index: false },
}

export default function DoNotSellPage() {
  const contactEmail = 'privacy@shieldhomepro.com'

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-slate-900 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield size={20} className="text-emerald-500" />
            <span className="text-white font-bold text-lg">{COMPANY_NAME}</span>
          </Link>
          <Link href="/" className="text-gray-400 text-sm hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Do Not Sell or Share My Personal Information</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <section>
              <p>
                {COMPANY_NAME} <strong>does not sell</strong> your personal information, and we <strong>do not share</strong> your information with third parties for cross-context behavioral advertising.
              </p>
              <p>
                We also do not share, rent, or sell mobile phone opt-in data, SMS consent data, or any text-messaging-related information with any third parties or affiliates for any purpose. See our <Link href="/privacy" className="text-emerald-500 underline">Privacy Policy</Link> for details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Submit a Privacy Request</h2>
              <p>
                If you are a California resident (or a resident of another state with a comprehensive consumer-privacy law) and would like to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Opt out of the sale or sharing of your personal information</li>
                <li>Request a copy of personal information we have collected about you</li>
                <li>Request deletion of your personal information</li>
                <li>Correct inaccurate personal information</li>
                <li>Limit the use or disclosure of any sensitive personal information</li>
              </ul>
              <p>
                Submit your request to <a href={`mailto:${contactEmail}`} className="text-emerald-500 underline">{contactEmail}</a> or call <a href={`tel:${PHONE_NUMBER}`} className="text-emerald-500">{PHONE_NUMBER}</a>. Please include your full name, phone number, and email address so we can verify your identity. We will respond within 45 days as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Authorized Agents</h2>
              <p>
                You may designate an authorized agent to submit a request on your behalf. We will require written, signed proof of authorization and may need to verify your identity directly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Contact</h2>
              <div className="bg-gray-50 rounded-xl p-6 mt-3 space-y-2">
                <p><strong>{COMPANY_NAME}</strong></p>
                {COMPANY_ADDRESS ? <p>{COMPANY_ADDRESS}</p> : null}
                <p>Email: <a href={`mailto:${contactEmail}`} className="text-emerald-500 underline">{contactEmail}</a></p>
                <p>Phone: <a href={`tel:${PHONE_NUMBER}`} className="text-emerald-500">{PHONE_NUMBER}</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-xs">
        <p>ShieldHome Pro — Authorized Vivint Smart Home Dealer</p>
        <p className="mt-1">© {new Date().getFullYear()} ShieldHome Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}

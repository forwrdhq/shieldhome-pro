import Link from 'next/link'
import { Shield } from 'lucide-react'
import { PHONE_NUMBER, APP_URL, COMPANY_NAME, COMPANY_ADDRESS } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | ShieldHome Pro',
  description: 'ShieldHome Pro Privacy Policy — how we collect, use, and protect your personal information.',
  robots: { index: false },
}

export default function PrivacyPage() {
  const lastUpdated = 'March 14, 2026'
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. About This Policy</h2>
              <p>
                ShieldHome Pro ("we," "us," or "our") is a marketing partner for Vivint Smart Home products and services. This Privacy Policy describes how we collect, use, disclose, and protect your personal information when you visit our website at <a href={APP_URL} className="text-emerald-500 underline">{APP_URL}</a> or submit a quote request through our lead capture forms.
              </p>
              <p>
                By using our website or submitting your information, you agree to the practices described in this Privacy Policy. If you do not agree, please do not use our site or submit your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
              <p>We collect information you voluntarily provide when you request a quote, including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Contact information:</strong> First name, last name, email address, phone number, ZIP code</li>
                <li><strong>Property information:</strong> Property type (house, condo, etc.), homeownership status</li>
                <li><strong>Security preferences:</strong> Security concerns, number of entry points, installation timeline</li>
                <li><strong>Consent records:</strong> Date and time you provided consent to be contacted</li>
              </ul>
              <p className="mt-4">We also automatically collect certain technical information when you visit our site:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Device and browser information:</strong> Device type, browser type and version</li>
                <li><strong>Traffic source data:</strong> UTM parameters, Google Click ID (gclid), Facebook Click ID (fbclid), referring URL, landing page</li>
                <li><strong>IP address</strong> (used for fraud prevention and rate limiting)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Contact you via phone, SMS text message, and email to follow up on your quote request</li>
                <li>Connect you with an authorized Vivint Smart Home representative in your area</li>
                <li>Send automated follow-up messages and educational content about home security</li>
                <li>Measure the effectiveness of our advertising campaigns and website performance</li>
                <li>Prevent fraud, spam, and abuse of our contact form</li>
                <li>Maintain records required by applicable law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. TCPA Consent and Communications</h2>
              <p>
                By submitting your phone number and checking the consent box on our quote form, you expressly consent to receive autodialed or prerecorded calls and SMS text messages from ShieldHome Pro and/or Vivint Smart Home at the phone number you provided. This consent is not a condition of any purchase.
              </p>
              <p>
                <strong>Message and data rates may apply.</strong> Message frequency varies. You may opt out of SMS messages at any time by replying STOP. For help, reply HELP or contact us at <a href={`tel:${PHONE_NUMBER}`} className="text-emerald-500">{PHONE_NUMBER}</a>.
              </p>
              <p>
                We record the date, time, and IP address associated with your consent as part of our compliance records.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. How We Share Your Information</h2>
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Vivint Smart Home:</strong> As a Vivint partner, we share lead information with Vivint and their representatives to fulfill your quote request</li>
                <li><strong>Service providers:</strong> We use SendGrid (email delivery), Twilio (SMS), and similar third-party services to communicate with you. These providers are contractually bound to use your data only to provide services to us</li>
                <li><strong>Analytics providers:</strong> We use Meta (Facebook) Pixel and Google Analytics/Ads to measure advertising performance. These providers may use cookies and tracking technologies</li>
                <li><strong>Legal requirements:</strong> We may disclose your information if required by law, court order, or to protect our rights</li>
              </ul>
              <p className="mt-3">
                <strong>We do not sell your personal information to third parties.</strong>
              </p>
              <p className="mt-3">
                <strong>SMS opt-in data and consent.</strong> No mobile information — including phone numbers, SMS opt-in data, or consent records — will be shared with third parties or affiliates for marketing or promotional purposes. Information sharing with subcontractors who support our internal operations (such as our SMS delivery provider Twilio or our CRM platform) is permitted, and those subcontractors are contractually prohibited from using mobile opt-in data for their own marketing. All other categories of personal information may be shared as described elsewhere in this policy, but the categories of text-messaging originator opt-in data and consent will not be shared with any third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Cookies and Tracking Technologies</h2>
              <p>
                Our website uses cookies and similar tracking technologies including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Meta Pixel:</strong> Tracks ad conversions and enables retargeting on Facebook and Instagram</li>
                <li><strong>Google Analytics / Google Ads:</strong> Tracks website traffic and ad conversion performance</li>
                <li><strong>Microsoft Clarity (optional):</strong> Session recording for UX analysis</li>
                <li><strong>Session storage:</strong> We use your browser's session storage to preserve UTM tracking parameters during your visit</li>
              </ul>
              <p className="mt-3">
                You can control cookies through your browser settings. Disabling cookies may affect your experience on our site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes described in this policy, including to communicate with you about your quote, track sales activity, and comply with legal obligations. Lead records are typically retained for a minimum of 3 years for compliance purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">8. Your Rights</h2>
              <p>Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Request access to the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information (subject to certain exceptions)</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Opt out of the sale of personal information (we do not sell your data)</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at <a href={`mailto:${contactEmail}`} className="text-emerald-500 underline">{contactEmail}</a> or <a href={`tel:${PHONE_NUMBER}`} className="text-emerald-500">{PHONE_NUMBER}</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">9. California Residents (CCPA)</h2>
              <p>
                California residents have additional rights under the California Consumer Privacy Act (CCPA). You have the right to know what personal information we collect, the right to delete it, and the right to opt out of the sale of personal information. We do not sell personal information. To submit a CCPA request, contact us at <a href={`mailto:${contactEmail}`} className="text-emerald-500 underline">{contactEmail}</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">10. Security</h2>
              <p>
                We use reasonable administrative, technical, and physical safeguards to protect your personal information, including encrypted data transmission (HTTPS/TLS) and access controls on our internal systems. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">11. Children's Privacy</h2>
              <p>
                Our website is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">12. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised "Last updated" date. Continued use of our site after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">13. Contact Us</h2>
              <p>If you have questions about this Privacy Policy or how we handle your information:</p>
              <div className="bg-gray-50 rounded-xl p-6 mt-3 space-y-2">
                <p><strong>{COMPANY_NAME}</strong></p>
                <p>Vivint Smart Home Marketing Partner</p>
                {COMPANY_ADDRESS ? <p>{COMPANY_ADDRESS}</p> : null}
                <p>Email: <a href={`mailto:${contactEmail}`} className="text-emerald-500 underline">{contactEmail}</a></p>
                <p>Phone: <a href={`tel:${PHONE_NUMBER}`} className="text-emerald-500">{PHONE_NUMBER}</a></p>
                <p>Website: <a href={APP_URL} className="text-emerald-500 underline">{APP_URL}</a></p>
              </div>
            </section>

          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-xs">
        <p>ShieldHome Pro — Vivint Smart Home Marketing Partner</p>
        <p className="mt-1">© {new Date().getFullYear()} ShieldHome Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}

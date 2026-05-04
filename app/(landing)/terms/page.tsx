import Link from 'next/link'
import { Shield } from 'lucide-react'
import { PHONE_NUMBER, APP_URL, COMPANY_NAME, COMPANY_ADDRESS } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | ShieldHome Pro',
  description: 'ShieldHome Pro Terms of Service — terms governing your use of our website and services.',
  robots: { index: false },
}

export default function TermsPage() {
  const lastUpdated = 'April 19, 2026'
  const contactEmail = 'support@shieldhomepro.com'

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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-gray-400 text-sm mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                These Terms of Service ("Terms") govern your access to and use of the website located at <a href={APP_URL} className="text-emerald-500 underline">{APP_URL}</a> and any related services (collectively, the "Services") provided by {COMPANY_NAME} ("we," "us," or "our"), a marketing partner for Vivint Smart Home products and services.
              </p>
              <p>
                By accessing the Services, requesting a quote, or otherwise interacting with us, you agree to be bound by these Terms. If you do not agree, do not use the Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Eligibility</h2>
              <p>
                You must be at least 18 years of age and a legal resident of the United States to use the Services or submit a quote request. By submitting your information, you represent and warrant that you meet these requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Quote Requests and Communications</h2>
              <p>
                When you submit a quote request, you authorize {COMPANY_NAME} and its authorized representatives to contact you by phone, SMS text message, and email to follow up regarding your inquiry. Communications may include autodialed and prerecorded calls and SMS messages.
              </p>
              <p>
                <strong>Consent to be contacted is not a condition of any purchase.</strong> Message and data rates may apply. Message frequency varies based on your engagement (typically 2–6 messages per month). You may opt out of SMS at any time by replying <strong>STOP</strong>; for help reply <strong>HELP</strong> or contact us at <a href={`tel:${PHONE_NUMBER}`} className="text-emerald-500">{PHONE_NUMBER}</a>.
              </p>
              <p>
                A quote request does not constitute a contract, an offer, or a guarantee of pricing or service availability. All system pricing, equipment availability, and monitoring fees are subject to credit approval, qualification, and applicable Vivint Smart Home agreements at the time of installation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Independent Dealer Disclosure</h2>
              <p>
                {COMPANY_NAME} is an independently owned and operated Vivint Smart Home marketing partner. We are not Vivint Smart Home, Inc. and do not act as its agent for purposes of these Terms. Vivint® is a registered trademark of Vivint Smart Home, Inc. Use of the Vivint name and trademarks on this site is permitted under our marketing partner agreement.
              </p>
              <p>
                Any monitoring services, equipment warranties, or installation services purchased are provided directly by Vivint Smart Home, Inc. or its affiliates pursuant to separate agreements between you and Vivint. Those agreements — and not these Terms — govern the equipment and monitoring services themselves.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Submit false, inaccurate, or fraudulent information through any form on the Services</li>
                <li>Submit information for any phone number or email address that is not your own or that you are not authorized to provide</li>
                <li>Use the Services to transmit spam, malware, or any harmful or unlawful content</li>
                <li>Attempt to gain unauthorized access to any portion of the Services, our systems, or any user account</li>
                <li>Use any automated means (bots, scrapers, etc.) to access the Services or harvest information from them</li>
                <li>Reverse engineer, decompile, or disassemble any portion of the Services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Intellectual Property</h2>
              <p>
                All content on the Services — including text, graphics, logos, images, and software — is the property of {COMPANY_NAME}, its licensors, or Vivint Smart Home, Inc., and is protected by United States and international copyright, trademark, and other intellectual property laws. You may not copy, reproduce, distribute, or create derivative works without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">7. Disclaimers</h2>
              <p>
                THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, {COMPANY_NAME.toUpperCase()} DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                We do not warrant that the Services will be uninterrupted, error-free, or secure. Pricing, promotions, and equipment specifications shown on the site are illustrative and may change without notice. Final pricing is established by Vivint at the time of contract.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">8. Limitation of Liability</h2>
              <p>
                TO THE FULLEST EXTENT PERMITTED BY LAW, {COMPANY_NAME.toUpperCase()} AND ITS OFFICERS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL AGGREGATE LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES SHALL NOT EXCEED ONE HUNDRED U.S. DOLLARS ($100).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">9. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless {COMPANY_NAME}, its affiliates, officers, employees, and agents from and against any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising out of or related to your use of the Services, your violation of these Terms, or your violation of any rights of another party.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">10. Privacy</h2>
              <p>
                Your use of the Services is also governed by our <Link href="/privacy" className="text-emerald-500 underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">11. Modifications</h2>
              <p>
                We may revise these Terms at any time by posting the updated version on this page and updating the "Last updated" date. Your continued use of the Services after changes are posted constitutes your acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">12. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms are governed by the laws of the State of Utah, without regard to its conflict of laws principles. Any dispute arising out of or relating to these Terms or the Services shall be brought exclusively in the state or federal courts located in Salt Lake County, Utah, and you consent to the personal jurisdiction of those courts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">13. Contact Us</h2>
              <p>If you have questions about these Terms:</p>
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

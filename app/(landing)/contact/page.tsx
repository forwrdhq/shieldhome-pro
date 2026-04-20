import Link from 'next/link'
import Script from 'next/script'
import { Shield, Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW, COMPANY_NAME, COMPANY_ADDRESS } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact ShieldHome Pro | Authorized Vivint Smart Home Dealer',
  description: 'Get in touch with ShieldHome Pro by phone, email, or live chat. Authorized Vivint Smart Home dealer serving customers nationwide.',
  robots: { index: true },
}

// IMPORTANT — A2P 10DLC compliance:
// The GoHighLevel chat widget below is the ONLY SMS opt-in mechanism on this
// page by design. Do NOT add any phone-collecting forms (lead form, contact
// form, newsletter signup with SMS opt-in, etc.) to this page. GHL's carrier
// validation auto-fails any chat-widget page that also collects SMS consent
// through a form. Use other pages (/, /quiz, /deals, etc.) for lead capture.

const GHL_CHAT_WIDGET_ID = process.env.NEXT_PUBLIC_GHL_CHAT_WIDGET_ID || '69e59449051861c1c18c1c88'

export default function ContactPage() {
  const supportEmail = 'support@shieldhomepro.com'

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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Contact Us</h1>
          <p className="text-gray-600 leading-relaxed mb-10">
            Questions about a Vivint Smart Home system, an existing quote, or want to talk to a Smart Home Pro? Reach us any of these ways. For an instant free quote, use our <Link href="/" className="text-emerald-600 underline">homepage quote tool</Link>.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <a
              href={`tel:${PHONE_NUMBER_RAW}`}
              className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors group"
            >
              <Phone size={24} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Call us</div>
                <div className="text-lg font-bold text-slate-900 group-hover:text-emerald-700">{PHONE_NUMBER}</div>
                <div className="text-sm text-gray-500 mt-1">Mon–Fri 8am–8pm MT · Sat 9am–5pm MT</div>
              </div>
            </a>

            <a
              href={`mailto:${supportEmail}`}
              className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors group"
            >
              <Mail size={24} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Email us</div>
                <div className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 break-all">{supportEmail}</div>
                <div className="text-sm text-gray-500 mt-1">We reply within one business day</div>
              </div>
            </a>

            <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 sm:col-span-1">
              <MapPin size={24} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Mailing address</div>
                <div className="text-base font-semibold text-slate-900">{COMPANY_NAME}</div>
                {COMPANY_ADDRESS ? (
                  <div className="text-sm text-gray-600 mt-1">{COMPANY_ADDRESS}</div>
                ) : null}
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 sm:col-span-1">
              <Clock size={24} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Business hours</div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  Mon–Fri: 8am – 8pm MT<br />
                  Sat: 9am – 5pm MT<br />
                  Sun: Closed
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-start gap-4">
            <MessageCircle size={28} className="text-emerald-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Live chat with a Smart Home Pro</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Use the chat bubble in the lower-right corner of this page to message us directly. If you provide your phone number in the chat, we may send follow-up SMS messages — message and data rates may apply, reply STOP to opt out, reply HELP for help. See our <Link href="/privacy" className="text-emerald-600 underline">Privacy Policy</Link> and <Link href="/terms" className="text-emerald-600 underline">Terms of Service</Link>.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 text-xs text-gray-500 leading-relaxed">
            <p>
              <strong>{COMPANY_NAME}</strong> is an independently operated authorized dealer of Vivint Smart Home, Inc. Vivint® is a registered trademark of Vivint Smart Home, Inc.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-xs">
        <p>{COMPANY_NAME} — Authorized Vivint Smart Home Dealer</p>
        <p className="mt-1">© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
      </footer>

      {/* GoHighLevel chat widget — scoped to this page only via next/script.
          Do NOT promote to the global layout: every other page on this site
          collects phone numbers via lead forms, which would auto-fail GHL's
          A2P 10DLC compliance check. */}
      <Script
        id="ghl-chat-widget"
        src="https://widgets.leadconnectorhq.com/loader.js"
        data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
        data-widget-id={GHL_CHAT_WIDGET_ID}
        strategy="afterInteractive"
      />
    </div>
  )
}

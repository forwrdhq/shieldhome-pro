import { CheckCircle, Phone, MessageSquare, Home } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thank You! — ShieldHome Pro',
  description: 'Your free home security quote request has been received.',
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Pixel fires - handled client-side via script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof fbq !== 'undefined') {
              fbq('track', 'Lead', { content_name: 'security_quote', value: 850, currency: 'USD' });
              fbq('track', 'CompleteRegistration');
            }
            if (typeof gtag !== 'undefined') {
              gtag('event', 'conversion', { send_to: '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${process.env.NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL}', value: 850.0, currency: 'USD' });
              gtag('event', 'generate_lead', { event_category: 'form_submission', event_label: 'quiz_funnel', value: 850 });
            }
          `
        }}
      />

      <div className="max-w-2xl mx-auto px-4 py-16 flex-1">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="text-[#00C853]" size={40} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
            Your Free Quote Request Has Been Submitted!
          </h1>
          <p className="text-gray-600 text-lg">Here's what happens next:</p>
        </div>

        <div className="space-y-4 mb-10">
          {[
            {
              icon: <MessageSquare className="text-[#00C853]" size={24} />,
              title: '1. Check Your Phone',
              desc: "You'll receive a confirmation text in the next 60 seconds.",
            },
            {
              icon: <Phone className="text-[#00C853]" size={24} />,
              title: '2. Expect a Call',
              desc: "A Vivint Smart Home Pro will call you within 5 minutes during business hours (or first thing tomorrow morning) to discuss your custom security solution.",
            },
            {
              icon: <Home className="text-[#00C853]" size={24} />,
              title: '3. Free In-Home Consultation',
              desc: "If you'd like to move forward, we'll schedule a free in-home consultation at a time that works for you. The visit typically takes 30-45 minutes.",
            },
          ].map(step => (
            <div key={step.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                {step.icon}
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A2E] mb-1">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-gray-600 mb-4">Questions? We're here to help.</p>
          <a
            href={`tel:${PHONE_NUMBER_RAW}`}
            className="inline-flex items-center gap-2 bg-[#00C853] hover:bg-[#00A846] text-white px-8 py-3 rounded-xl font-bold text-lg transition-colors"
          >
            <Phone size={20} />
            Call/Text Us: {PHONE_NUMBER}
          </a>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-xs">
        <p>ShieldHome Pro — Authorized Vivint Smart Home Dealer</p>
        <p className="mt-1">© {new Date().getFullYear()} ShieldHome Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}

import type { Metadata } from 'next'
import ContentHeader from '@/components/content/ContentHeader'
import ContentFooter from '@/components/content/ContentFooter'
import Breadcrumbs from '@/components/content/Breadcrumbs'
import QuizFunnel from '@/components/landing/QuizFunnel'
import { Shield, Check, Star, Users, Clock, Phone } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Free Home Security Quiz — Get Your Custom Quote in 60 Seconds | ShieldHome Pro',
  description: 'Take our 60-second home security quiz to get a free custom quote. Find out your home\'s security risk score and get matched with the perfect Vivint system. $0 down, free setup.',
  alternates: {
    canonical: 'https://shieldhome.pro/home-security-quiz',
  },
  openGraph: {
    title: 'Free Home Security Quiz — Get Your Custom Quote',
    description: 'Take our 60-second quiz to get a free custom Vivint home security quote.',
    url: 'https://shieldhome.pro/home-security-quiz',
  },
}

export default function QuizPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How long does the home security quiz take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The quiz takes about 60 seconds. You\'ll answer 5 quick questions about your home and security needs, then provide your contact info for a free custom quote.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the security quote really free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, 100% free with no obligation. A Vivint Smart Home Pro will call you with a personalized recommendation and pricing based on your quiz answers.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens after I complete the quiz?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You\'ll see your home security risk score immediately. Then a Vivint Smart Home Pro will call you (usually within 2 minutes) to discuss your custom security package and answer any questions.',
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ContentHeader />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Security Quiz', url: '/home-security-quiz' }]} />
            <div className="mt-8">
              <div className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-500 px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Clock size={16} />
                <span>Takes 60 seconds</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                What&apos;s Your Home&apos;s Security Risk Score?
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                Answer 5 quick questions to get your personalized risk assessment and a free custom home security quote. No obligation.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span>4.8/5 from 58,000+ reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-emerald-500" />
                  <span>#1 Rated Smart Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-emerald-500" />
                  <span>2M+ homes protected</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz */}
        <section className="py-12 bg-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
              <QuizFunnel />

              {/* Sidebar benefits */}
              <div className="hidden lg:block space-y-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-slate-900 mb-4">What You Get</h3>
                  <ul className="space-y-3">
                    {[
                      'Personalized security risk score',
                      'Custom system recommendation',
                      'Exact pricing for your home',
                      'Free doorbell camera offer',
                      'No obligation, no pressure',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-slate-900 mb-3">Recent Quotes</h3>
                  <div className="space-y-3 text-sm">
                    {[
                      { name: 'Sarah M.', location: 'Austin, TX', time: '3 min ago' },
                      { name: 'James R.', location: 'Phoenix, AZ', time: '7 min ago' },
                      { name: 'Maria L.', location: 'Orlando, FL', time: '12 min ago' },
                    ].map((person) => (
                      <div key={person.name} className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center text-xs font-bold text-emerald-500">
                          {person.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-medium text-slate-900">{person.name}</span>
                          <span className="text-gray-400"> — {person.location}</span>
                          <div className="text-xs text-gray-400">{person.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <a href={`tel:${PHONE_NUMBER_RAW}`} className="flex items-center justify-center gap-2 text-gray-500 hover:text-slate-900 transition-colors text-sm">
                    <Phone size={16} />
                    <span>Prefer to call? {PHONE_NUMBER}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How Our Home Security Quiz Works</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Our free home security assessment takes just 60 seconds and helps you understand exactly what level of protection your home needs. Based on your property type, number of entry points, security concerns, and timeline, we calculate a personalized risk score and match you with the ideal Vivint Smart Home system.
              </p>
              <p>
                After completing the quiz, a Vivint Smart Home Pro will call you — usually within 2 minutes — to walk you through your custom quote. They&apos;ll explain exactly what equipment is recommended for your home, the monthly monitoring cost, and any current promotions you qualify for. There&apos;s absolutely no obligation or pressure.
              </p>
              <p>
                Vivint&apos;s security systems include AI-powered outdoor cameras with Smart Sentry technology, a free doorbell camera with 180-degree view, 24/7 professional monitoring, and seamless smart home integration. Most homes qualify for $0 down equipment financing and free professional installation within 24-48 hours.
              </p>
            </div>
          </div>
        </section>
      </main>

      <ContentFooter />
    </div>
  )
}

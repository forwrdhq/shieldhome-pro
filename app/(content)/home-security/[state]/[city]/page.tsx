import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { states, getState, getCity, getCityDescription, getCityFAQs } from '@/lib/city-data'
import ContentHeader from '@/components/content/ContentHeader'
import ContentFooter from '@/components/content/ContentFooter'
import Breadcrumbs from '@/components/content/Breadcrumbs'
import CTABanner from '@/components/content/CTABanner'
import { MapPin, Shield, AlertTriangle, Home, Phone, ChevronDown, Check, Clock, Wifi, Camera, Bell } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

interface Props {
  params: Promise<{ state: string; city: string }>
}

export async function generateStaticParams() {
  const params: { state: string; city: string }[] = []
  for (const state of states) {
    for (const city of state.cities) {
      params.push({ state: state.slug, city: city.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  const state = getState(stateSlug)
  if (!state) return {}
  const city = getCity(stateSlug, citySlug)
  if (!city) return {}

  return {
    title: `Home Security Systems in ${city.name}, ${state.abbreviation} | Free Setup | ShieldHome Pro`,
    description: `Get a free home security quote in ${city.name}, ${state.abbreviation}. Crime rate: ${city.crimeRate}/1K. Free Vivint installation, 24/7 monitoring, AI cameras. $0 down.`,
    alternates: {
      canonical: `https://shieldhome.pro/home-security/${state.slug}/${city.slug}`,
    },
    openGraph: {
      title: `Home Security Systems in ${city.name}, ${state.abbreviation}`,
      description: `Professional home security in ${city.name}. Free setup + 24/7 monitoring.`,
      url: `https://shieldhome.pro/home-security/${state.slug}/${city.slug}`,
    },
  }
}

export default async function CityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params
  const state = getState(stateSlug)
  if (!state) notFound()
  const city = getCity(stateSlug, citySlug)
  if (!city) notFound()

  const faqs = getCityFAQs(state, city)
  const cityDesc = getCityDescription(state, city)

  const crimeLevel = city.crimeRate > 40 ? 'High' : city.crimeRate > 25 ? 'Moderate' : 'Low'
  const crimeLevelColor = city.crimeRate > 40 ? 'text-red-600' : city.crimeRate > 25 ? 'text-yellow-600' : 'text-green-600'

  // Schema markup
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `ShieldHome Pro — ${city.name}, ${state.abbreviation}`,
    description: `Smart Home Security Specialists serving ${city.name}, ${state.abbreviation}. Free home security installation and 24/7 monitoring.`,
    telephone: '+18013486050',
    url: `https://shieldhome.pro/home-security/${state.slug}/${city.slug}`,
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: { '@type': 'State', name: state.name },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      reviewCount: '58000',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://shieldhome.pro' },
      { '@type': 'ListItem', position: 2, name: 'Home Security', item: 'https://shieldhome.pro/home-security' },
      { '@type': 'ListItem', position: 3, name: state.name, item: `https://shieldhome.pro/home-security/${state.slug}` },
      { '@type': 'ListItem', position: 4, name: city.name, item: `https://shieldhome.pro/home-security/${state.slug}/${city.slug}` },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ContentHeader />

      <main>
        {/* Hero */}
        <section className="bg-slate-900 py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { name: 'Home', url: '/' },
                { name: 'Home Security', url: '/home-security' },
                { name: state.name, url: `/home-security/${state.slug}` },
                { name: city.name, url: `/home-security/${state.slug}/${city.slug}` },
              ]}
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mt-6 mb-4">
              Home Security Systems in {city.name}, {state.abbreviation}
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Professional Vivint installation in {city.name}. Free expert setup, 24/7 monitoring, and AI-powered smart security — starting at $0 down.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/home-security-quiz"
                className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
              >
                Get Free Quote for {city.name}
              </Link>
              <a
                href={`tel:${PHONE_NUMBER_RAW}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                <Phone size={18} />
                <span>Call {PHONE_NUMBER}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Crime Stats for City */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{city.name} Crime & Security Overview</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-100 rounded-xl p-5 text-center">
                <AlertTriangle size={24} className={`mx-auto mb-2 ${crimeLevelColor}`} />
                <div className={`text-2xl font-bold ${crimeLevelColor}`}>{crimeLevel}</div>
                <div className="text-xs text-gray-500 mt-1">Overall Crime Level</div>
              </div>
              <div className="bg-slate-100 rounded-xl p-5 text-center">
                <Shield size={24} className="text-emerald-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{city.crimeRate}</div>
                <div className="text-xs text-gray-500 mt-1">Crimes per 1,000 Residents</div>
              </div>
              <div className="bg-slate-100 rounded-xl p-5 text-center">
                <Home size={24} className="text-emerald-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{city.propertyCrimeRate}</div>
                <div className="text-xs text-gray-500 mt-1">Property Crimes per 1,000</div>
              </div>
              <div className="bg-slate-100 rounded-xl p-5 text-center">
                <MapPin size={24} className="text-emerald-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">{city.population.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Population</div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-12 bg-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What {city.name} Homeowners Get with Vivint</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <Camera size={24} />, title: 'AI-Powered Outdoor Cameras', desc: 'Smart Sentry technology detects people, animals, and vehicles. Get real-time alerts on your phone.' },
                { icon: <Bell size={24} />, title: 'Free Doorbell Camera', desc: '180° field of view, two-way talk, package detection, and HD video. Included free with your system.' },
                { icon: <Shield size={24} />, title: '24/7 Professional Monitoring', desc: 'Trained security professionals watching your home around the clock, with instant police/fire dispatch.' },
                { icon: <Wifi size={24} />, title: 'Smart Home Integration', desc: 'Works with Google, Alexa, smart locks, lights, thermostats. Control everything from one app.' },
                { icon: <Clock size={24} />, title: 'Setup in 24-48 Hours', desc: `A certified Vivint technician comes to your ${city.name} home. Free installation, no DIY required.` },
                { icon: <Check size={24} />, title: '$0 Down Financing', desc: 'No upfront equipment costs. Free professional installation. Affordable monthly monitoring plans.' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-emerald-500 mb-3">{item.icon}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* City-specific content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why {city.name} Residents Choose Vivint Home Security</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {cityDesc.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>

        <CTABanner variant="quiz" title={`Get a Free Security Quote for ${city.name}, ${state.abbreviation}`} />

        {/* FAQs */}
        <section className="py-12 bg-slate-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Home Security FAQ — {city.name}, {state.abbreviation}
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-white rounded-xl border border-gray-200 group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                    <ChevronDown size={20} className="text-gray-500 flex-shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed text-sm">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Other cities in state */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Other Cities in {state.name}</h2>
            <div className="flex flex-wrap gap-3">
              {state.cities
                .filter((c) => c.slug !== city.slug)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/home-security/${state.slug}/${c.slug}`}
                    className="px-4 py-2 bg-gray-100 hover:bg-emerald-600/10 hover:text-emerald-500 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>

        <CTABanner variant="phone" />
      </main>

      <ContentFooter />
    </div>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { states, getState } from '@/lib/city-data'
import ContentHeader from '@/components/content/ContentHeader'
import ContentFooter from '@/components/content/ContentFooter'
import Breadcrumbs from '@/components/content/Breadcrumbs'
import CTABanner from '@/components/content/CTABanner'
import { MapPin, ChevronRight, Shield, AlertTriangle, Users, Home } from 'lucide-react'

interface Props {
  params: Promise<{ state: string }>
}

export async function generateStaticParams() {
  return states.map((s) => ({ state: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params
  const state = getState(stateSlug)
  if (!state) return {}

  return {
    title: `Home Security Systems in ${state.name} | Free Installation | ShieldHome Pro`,
    description: `Get a free home security quote in ${state.name}. Professional Vivint installation, 24/7 monitoring, and AI-powered cameras. Compare crime rates across ${state.name} cities.`,
    alternates: {
      canonical: `https://shieldhome.pro/home-security/${state.slug}`,
    },
    openGraph: {
      title: `Home Security Systems in ${state.name}`,
      description: `Professional home security installation in ${state.name}. Free setup and 24/7 monitoring.`,
      url: `https://shieldhome.pro/home-security/${state.slug}`,
    },
  }
}

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params
  const state = getState(stateSlug)
  if (!state) notFound()

  const avgCrimeRate = (state.cities.reduce((sum, c) => sum + c.crimeRate, 0) / state.cities.length).toFixed(1)
  const highestCrime = [...state.cities].sort((a, b) => b.crimeRate - a.crimeRate)[0]
  const totalPop = state.cities.reduce((sum, c) => sum + c.population, 0)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://shieldhome.pro' },
      { '@type': 'ListItem', position: 2, name: 'Home Security', item: 'https://shieldhome.pro/home-security' },
      { '@type': 'ListItem', position: 3, name: state.name, item: `https://shieldhome.pro/home-security/${state.slug}` },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ContentHeader />

      <main>
        <section className="bg-slate-900 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { name: 'Home', url: '/' },
                { name: 'Home Security', url: '/home-security' },
                { name: state.name, url: `/home-security/${state.slug}` },
              ]}
            />
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-6 mb-4">
              Home Security Systems in {state.name}
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Professional Vivint smart home security installation across {state.name}. Free setup, 24/7 monitoring, and AI-powered cameras.
            </p>

            {/* State stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 max-w-xl">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <AlertTriangle size={20} className="text-yellow-400 mx-auto mb-1" />
                <div className="text-white font-bold text-lg">{avgCrimeRate}</div>
                <div className="text-gray-400 text-xs">Avg Crime Rate/1K</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <Users size={20} className="text-emerald-500 mx-auto mb-1" />
                <div className="text-white font-bold text-lg">{(totalPop / 1000000).toFixed(1)}M+</div>
                <div className="text-gray-400 text-xs">Population Covered</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <MapPin size={20} className="text-emerald-500 mx-auto mb-1" />
                <div className="text-white font-bold text-lg">{state.cities.length}</div>
                <div className="text-gray-400 text-xs">Cities Served</div>
              </div>
            </div>
          </div>
        </section>

        {/* City Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Cities in {state.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/home-security/${state.slug}/${city.slug}`}
                  className="group block bg-white rounded-xl border border-gray-200 hover:border-emerald-600 hover:shadow-lg transition-all p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-500 transition-colors text-lg">
                        {city.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Pop. {city.population.toLocaleString()}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-emerald-500 mt-1 transition-colors" />
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs">
                      <span className="text-gray-500">Crime Rate: </span>
                      <span className={`font-bold ${city.crimeRate > 40 ? 'text-red-600' : city.crimeRate > 25 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {city.crimeRate}/1K
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500">Median Home: </span>
                      <span className="font-semibold text-slate-900">${(city.medianHomeValue / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-12 bg-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Home Security in {state.name}: What You Need to Know</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                {state.name} homeowners face unique security challenges. With an average crime rate of {avgCrimeRate} incidents per 1,000 residents across major cities, having a reliable home security system is more important than ever. {highestCrime.name} has the highest crime rate in the state at {highestCrime.crimeRate} per 1,000 residents.
              </p>
              <p>
                Vivint Smart Home offers professional installation throughout {state.name}, with certified technicians available in all major metropolitan areas. Every system includes 24/7 professional monitoring, AI-powered outdoor cameras, a smart hub with built-in voice assistant, and seamless integration with Google Home and Amazon Alexa.
              </p>
              <p>
                {state.name} residents who choose Vivint through ShieldHome Pro receive exclusive benefits including $0 down equipment financing, a free doorbell camera with 180-degree view, and complimentary professional installation. Whether you live in {state.cities[0]?.name || 'a major city'} or a smaller community, expert setup is available within 24-48 hours of your initial consultation.
              </p>
            </div>
          </div>
        </section>

        <CTABanner variant="quiz" />
      </main>

      <ContentFooter />
    </div>
  )
}

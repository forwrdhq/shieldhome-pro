import type { Metadata } from 'next'
import Link from 'next/link'
import { states } from '@/lib/city-data'
import ContentHeader from '@/components/content/ContentHeader'
import ContentFooter from '@/components/content/ContentFooter'
import Breadcrumbs from '@/components/content/Breadcrumbs'
import CTABanner from '@/components/content/CTABanner'
import { MapPin, ChevronRight, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Home Security Systems by State & City | ShieldHome Pro',
  description: 'Find home security systems and free installation in your area. Get local crime data and a free custom security quote from a Vivint authorized dealer.',
  alternates: {
    canonical: 'https://shieldhome.pro/home-security',
  },
  openGraph: {
    title: 'Home Security Systems by State & City',
    description: 'Find home security systems and free installation in your area.',
    url: 'https://shieldhome.pro/home-security',
  },
}

export default function HomeSecurityIndex() {
  return (
    <div className="min-h-screen bg-white">
      <ContentHeader />

      <main>
        <section className="bg-[#1A1A2E] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Home Security by Location', url: '/home-security' }]} />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-6 mb-4">
              Home Security Systems Near You
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Find local crime statistics and get a free home security quote for your city. Professional installation available nationwide.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-8">Browse by State</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {states.map((state) => (
                <Link
                  key={state.slug}
                  href={`/home-security/${state.slug}`}
                  className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-[#00C853] hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-[#00C853]" />
                    <div>
                      <div className="font-semibold text-[#1A1A2E] group-hover:text-[#00C853] transition-colors">
                        {state.name}
                      </div>
                      <div className="text-xs text-gray-500">{state.cities.length} cities</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-[#00C853] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-12 bg-[#F8F9FA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">Professional Home Security Installation Nationwide</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                ShieldHome Pro connects homeowners with Vivint Smart Home, the #1-rated home security provider in America. Whether you live in a major metropolitan area or a quiet suburban neighborhood, professional home security installation is available in your area with free expert setup.
              </p>
              <p>
                Every community has unique security challenges. Urban areas may face higher property crime rates, while suburban and rural homes can be targets due to isolation and longer police response times. Our local security assessments take your specific neighborhood into account, using real crime data to recommend the right level of protection for your home.
              </p>
              <p>
                With Vivint, you get 24/7 professional monitoring, AI-powered cameras, smart home integration, and a dedicated Smart Home Pro who understands the security needs of your area. Find your state above to see local crime statistics and get started with a free quote.
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

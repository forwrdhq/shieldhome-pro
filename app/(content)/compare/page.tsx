import type { Metadata } from 'next'
import Link from 'next/link'
import { comparisons } from '@/lib/comparison-data'
import ContentHeader from '@/components/content/ContentHeader'
import ContentFooter from '@/components/content/ContentFooter'
import Breadcrumbs from '@/components/content/Breadcrumbs'
import CTABanner from '@/components/content/CTABanner'
import { Star, ArrowRight, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Compare Home Security Systems — Vivint vs ADT vs SimpliSafe | ShieldHome Pro',
  description: 'Side-by-side comparisons of the top home security systems. Compare Vivint, ADT, SimpliSafe, Ring, Frontpoint, and Brinks. Find the best system for your home.',
  alternates: {
    canonical: 'https://shieldhome.pro/compare',
  },
  openGraph: {
    title: 'Compare Home Security Systems — Vivint vs ADT vs SimpliSafe',
    description: 'Side-by-side comparisons of the top home security systems.',
    url: 'https://shieldhome.pro/compare',
  },
}

export default function CompareIndex() {
  return (
    <div className="min-h-screen bg-white">
      <ContentHeader />

      <main>
        <section className="bg-[#1A1A2E] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Compare Systems', url: '/compare' }]} />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-6 mb-4">
              Compare Home Security Systems
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Honest, side-by-side comparisons to help you pick the right security system for your home and budget.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparisons.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="group block bg-white rounded-xl border border-gray-200 hover:border-[#00C853] hover:shadow-lg transition-all p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#00C853]/10 flex items-center justify-center">
                      <Shield size={20} className="text-[#00C853]" />
                    </div>
                    <div className="flex items-center gap-2">
                      {comp.competitors.slice(0, 2).map((c, i) => (
                        <span key={c.name}>
                          {i > 0 && <span className="text-gray-400 mx-1 text-xs font-bold">VS</span>}
                          <span className="font-semibold text-[#1A1A2E] text-sm">{c.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-[#1A1A2E] mb-2 group-hover:text-[#00C853] transition-colors">
                    {comp.heroTitle}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">{comp.heroSubtitle}</p>
                  <div className="flex items-center gap-2 text-[#00C853] font-semibold text-sm">
                    <span>Read Comparison</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CTABanner variant="quiz" />
      </main>

      <ContentFooter />
    </div>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { comparisons, getComparison } from '@/lib/comparison-data'
import ContentHeader from '@/components/content/ContentHeader'
import ContentFooter from '@/components/content/ContentFooter'
import Breadcrumbs from '@/components/content/Breadcrumbs'
import CTABanner from '@/components/content/CTABanner'
import { Star, Check, X, Crown, Shield, Phone } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const comp = getComparison(slug)
  if (!comp) return {}

  return {
    title: comp.metaTitle,
    description: comp.metaDescription,
    alternates: {
      canonical: `https://shieldhome.pro/compare/${comp.slug}`,
    },
    openGraph: {
      title: comp.metaTitle,
      description: comp.metaDescription,
      type: 'article',
      url: `https://shieldhome.pro/compare/${comp.slug}`,
    },
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={16}
          className={s <= Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
        />
      ))}
      <span className="text-sm font-bold text-gray-700 ml-1">{rating}</span>
    </div>
  )
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params
  const comp = getComparison(slug)
  if (!comp) notFound()

  const comparisonSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: comp.title,
    description: comp.metaDescription,
    author: { '@type': 'Organization', name: 'ShieldHome Pro' },
    publisher: { '@type': 'Organization', name: 'ShieldHome Pro', url: 'https://shieldhome.pro' },
    mainEntityOfPage: `https://shieldhome.pro/compare/${comp.slug}`,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://shieldhome.pro' },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://shieldhome.pro/compare' },
      { '@type': 'ListItem', position: 3, name: comp.heroTitle, item: `https://shieldhome.pro/compare/${comp.slug}` },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ContentHeader />

      <main>
        {/* Hero */}
        <section className="bg-slate-900 py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { name: 'Home', url: '/' },
                { name: 'Compare', url: '/compare' },
                { name: comp.heroTitle, url: `/compare/${comp.slug}` },
              ]}
            />
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-6 mb-4">
              {comp.heroTitle}
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">{comp.heroSubtitle}</p>

            {/* Competitor badges */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              {comp.competitors.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3">
                  {i > 0 && <span className="text-2xl font-bold text-gray-500">VS</span>}
                  <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
                    <div className="text-white font-bold text-lg">{c.name}</div>
                    <StarRating rating={c.rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Comparison Table */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Comparison</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-4 text-left text-gray-600 font-semibold bg-gray-50">Feature</th>
                    {comp.competitors.map((c, i) => (
                      <th
                        key={c.name}
                        className={`p-4 text-center font-bold ${i === 0 ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-600'}`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          {i === 0 && <Crown size={14} className="text-yellow-400" />}
                          <span>{c.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="p-4 text-sm font-medium text-gray-700">Monthly Price</td>
                    {comp.competitors.map((c, i) => (
                      <td key={c.name} className={`p-4 text-center text-sm ${i === 0 ? 'bg-green-50/50 border-x border-emerald-600/20 font-bold text-slate-900' : 'text-gray-600'}`}>
                        {c.monthlyPrice}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="p-4 text-sm font-medium text-gray-700">Setup Fee</td>
                    {comp.competitors.map((c, i) => (
                      <td key={c.name} className={`p-4 text-center text-sm ${i === 0 ? 'bg-green-50/50 border-x border-emerald-600/20 font-bold text-slate-900' : 'text-gray-600'}`}>
                        {c.setupFee}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="p-4 text-sm font-medium text-gray-700">Contract Required</td>
                    {comp.competitors.map((c, i) => (
                      <td key={c.name} className={`p-4 text-center ${i === 0 ? 'bg-green-50/50 border-x border-emerald-600/20' : ''}`}>
                        {c.contractRequired ? <span className="text-gray-500 text-sm">Yes</span> : <span className="text-emerald-500 font-semibold text-sm">Flexible</span>}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-gray-100 bg-gray-50/50">
                    <td className="p-4 text-sm font-medium text-gray-700">Rating</td>
                    {comp.competitors.map((c, i) => (
                      <td key={c.name} className={`p-4 text-center ${i === 0 ? 'bg-green-50/50 border-x border-emerald-600/20' : ''}`}>
                        <div className="flex justify-center"><StarRating rating={c.rating} /></div>
                      </td>
                    ))}
                  </tr>
                  {comp.competitors[0].features.map((feature, fi) => (
                    <tr key={feature} className={`border-t border-gray-100 ${fi % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="p-4 text-sm font-medium text-gray-700">{feature}</td>
                      {comp.competitors.map((c, i) => (
                        <td key={c.name} className={`p-4 text-center ${i === 0 ? 'bg-green-50/50 border-x border-emerald-600/20' : ''}`}>
                          <Check size={18} className={i === 0 ? 'text-emerald-500 mx-auto' : 'text-gray-400 mx-auto'} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Pros & Cons */}
        <section className="py-12 bg-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Pros & Cons</h2>
            <div className={`grid gap-6 ${comp.competitors.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
              {comp.competitors.map((c, i) => (
                <div key={c.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className={`p-4 ${i === 0 ? 'bg-slate-900' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2">
                      {i === 0 && <Crown size={16} className="text-yellow-400" />}
                      <h3 className={`font-bold text-lg ${i === 0 ? 'text-white' : 'text-slate-900'}`}>{c.name}</h3>
                    </div>
                    <div className="mt-1"><StarRating rating={c.rating} /></div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <h4 className="font-semibold text-emerald-500 text-sm uppercase tracking-wider mb-2">Pros</h4>
                      <ul className="space-y-2">
                        {c.pros.map((pro) => (
                          <li key={pro} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-500 text-sm uppercase tracking-wider mb-2">Cons</h4>
                      <ul className="space-y-2">
                        {c.cons.map((con) => (
                          <li key={con} className="flex items-start gap-2 text-sm text-gray-700">
                            <X size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Sections */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {comp.detailedSections.map((section, i) => (
              <div key={i} className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.heading}</h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {section.content.split('\n\n').map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
                {i === 1 && (
                  <div className="mt-8">
                    <CTABanner variant="quiz" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Verdict */}
        <section className="py-12 bg-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border-2 border-emerald-600 p-8 text-center">
              <Crown size={40} className="text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Our Verdict</h2>
              <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto mb-6">{comp.verdict}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/home-security-quiz"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
                >
                  Get Your Free Vivint Quote
                </Link>
                <a href={`tel:${PHONE_NUMBER_RAW}`} className="flex items-center gap-2 text-gray-500 hover:text-slate-900 transition-colors text-sm">
                  <Phone size={16} />
                  <span>Or call {PHONE_NUMBER}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <CTABanner variant="phone" />
      </main>

      <ContentFooter />
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import ContentHeader from '@/components/content/ContentHeader'
import ContentFooter from '@/components/content/ContentFooter'
import Breadcrumbs from '@/components/content/Breadcrumbs'
import CTABanner from '@/components/content/CTABanner'
import { Shield, AlertTriangle, Home, Clock, DollarSign, Lock, Camera, TrendingDown, Users, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Home Security Statistics 2026 — Burglary Rates, Crime Data & Trends | ShieldHome Pro',
  description: 'Comprehensive home security statistics for 2026. Burglary rates, crime trends, security system effectiveness data, and property crime facts every homeowner should know.',
  alternates: {
    canonical: 'https://shieldhome.pro/home-security-statistics',
  },
  openGraph: {
    title: 'Home Security Statistics 2026 — Burglary Rates & Crime Data',
    description: 'Comprehensive home security statistics: burglary rates, crime trends, and security system effectiveness.',
    url: 'https://shieldhome.pro/home-security-statistics',
  },
}

const stats = {
  burglary: [
    { stat: '1 Every 25.7 Seconds', label: 'A burglary occurs in the U.S.', source: 'FBI UCR' },
    { stat: '1.4 Million', label: 'Burglaries reported annually in the U.S.', source: 'FBI Crime Statistics' },
    { stat: '300%', label: 'Homes without security are 3x more likely to be burglarized', source: 'University of North Carolina' },
    { stat: '$2,661', label: 'Average loss per residential burglary', source: 'FBI UCR' },
    { stat: '65%', label: 'Of burglaries happen during daylight hours (6am-6pm)', source: 'Department of Justice' },
    { stat: '34%', label: 'Of burglars enter through the front door', source: 'Department of Justice' },
    { stat: '23%', label: 'Enter through a first-floor window', source: 'Department of Justice' },
    { stat: '22%', label: 'Enter through a back door', source: 'Department of Justice' },
  ],
  deterrence: [
    { stat: '60%', label: 'Of convicted burglars said a security system would make them seek another target', source: 'University of North Carolina' },
    { stat: '67%', label: 'Of burglars would avoid homes with visible security cameras', source: 'Rutgers University' },
    { stat: '83%', label: 'Would check for a security system before attempting a break-in', source: 'UNC Charlotte Study' },
    { stat: '50%', label: 'Reduction in crime in neighborhoods with security cameras', source: 'Urban Institute' },
    { stat: '6 Minutes', label: 'Average police response time to a monitored alarm vs 58 min for unmonitored', source: 'PPVAR Study' },
  ],
  packageTheft: [
    { stat: '49 Million', label: 'Americans had at least one package stolen in the last 12 months', source: 'C+R Research' },
    { stat: '$2.4 Billion', label: 'Estimated annual cost of package theft in the U.S.', source: 'Security.org' },
    { stat: '64%', label: 'Of Americans have been a victim of package theft', source: 'Security.org Survey' },
    { stat: '53%', label: 'Reduction in package theft with a doorbell camera installed', source: 'Ring Neighborhood Data' },
  ],
  smartHome: [
    { stat: '47 Million', label: 'U.S. households with smart home security devices', source: 'Statista' },
    { stat: '$5.7 Billion', label: 'U.S. residential security market size in 2026', source: 'Fortune Business Insights' },
    { stat: '72%', label: 'Of homeowners say security cameras give them peace of mind', source: 'SafeHome.org Survey' },
    { stat: '93%', label: 'Customer satisfaction rate for professionally monitored systems', source: 'Parks Associates' },
  ],
}

function StatCard({ stat, label, source }: { stat: string; label: string; source: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="text-3xl font-extrabold text-emerald-500 mb-2">{stat}</div>
      <p className="text-gray-700 font-medium mb-2">{label}</p>
      <p className="text-xs text-gray-400">Source: {source}</p>
    </div>
  )
}

export default function StatisticsPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Home Security Statistics 2026',
    description: 'Comprehensive home security statistics including burglary rates, crime trends, and security system effectiveness data.',
    author: { '@type': 'Organization', name: 'ShieldHome Pro' },
    publisher: { '@type': 'Organization', name: 'ShieldHome Pro', url: 'https://shieldhome.pro' },
    datePublished: '2026-01-15',
    dateModified: '2026-03-01',
    mainEntityOfPage: 'https://shieldhome.pro/home-security-statistics',
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <ContentHeader />

      <main>
        {/* Hero */}
        <section className="bg-slate-900 py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Home Security Statistics', url: '/home-security-statistics' }]} />
            <div className="mt-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/20 text-emerald-500 uppercase tracking-wider mb-4">
                Updated March 2026
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Home Security Statistics 2026
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl">
                The most comprehensive collection of home security statistics, burglary data, and crime trends. Every stat is sourced from government agencies, university research, and industry reports.
              </p>
            </div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="py-10 bg-emerald-600">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-white mb-4">Key Takeaways</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { value: '1.4M', label: 'Burglaries per year in the U.S.' },
                { value: '300%', label: 'Higher risk without a security system' },
                { value: '60%', label: 'Of burglars avoid homes with security' },
                { value: '$2,661', label: 'Average loss per burglary' },
              ].map((item) => (
                <div key={item.label} className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-extrabold text-white">{item.value}</div>
                  <div className="text-sm text-white/80 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Burglary Statistics */}
        <section className="py-12" id="burglary-statistics">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Burglary Statistics</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.burglary.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </div>
        </section>

        {/* Deterrence Statistics */}
        <section className="py-12 bg-slate-100" id="security-system-effectiveness">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Shield size={20} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Security System Effectiveness</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.deterrence.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </div>
        </section>

        <CTABanner variant="quiz" title="Protect Your Home Based on Real Data" subtitle="Get a free custom security quote in 60 seconds." />

        {/* Package Theft */}
        <section className="py-12" id="package-theft-statistics">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Home size={20} className="text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Package Theft Statistics</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.packageTheft.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </div>
        </section>

        {/* Smart Home Security */}
        <section className="py-12 bg-slate-100" id="smart-home-security">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Smart Home Security Market</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.smartHome.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Sources & Methodology</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                All statistics on this page are sourced from reputable government agencies, academic research institutions, and established industry organizations. Primary sources include the FBI Uniform Crime Reporting (UCR) program, the Bureau of Justice Statistics, the University of North Carolina at Charlotte Department of Criminal Justice and Criminology, and Rutgers University School of Criminal Justice.
              </p>
              <p>
                Industry data is sourced from Parks Associates, Statista, Fortune Business Insights, SafeHome.org, Security.org, and the Electronic Security Association (ESA). Package theft data comes from C+R Research consumer surveys and Ring Neighborhood community reports.
              </p>
              <p>
                This page is updated regularly to reflect the latest available data. Some statistics represent the most recent available reporting period, which may lag by 1-2 years due to government data collection timelines. If you are a journalist or researcher and would like to cite these statistics, please link back to this page.
              </p>
            </div>
          </div>
        </section>

        <CTABanner variant="phone" />
      </main>

      <ContentFooter />
    </div>
  )
}

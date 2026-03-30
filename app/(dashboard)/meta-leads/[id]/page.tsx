import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { formatPhone } from '@/lib/utils'
import Card from '@/components/ui/Card'
import { Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import MetaLeadActions from './MetaLeadActions'

const CONCERN_LABELS: Record<string, string> = {
  breakins: 'Break-ins / Burglary',
  package_theft: 'Package Theft',
  fire_co: 'Fire / Smoke / CO',
  kids_alone: 'Watching Kids / Pets',
  vacation: 'Vacation Home',
}

const PACKAGE_LABELS: Record<string, string> = {
  total_shield: 'Total Shield',
  essential: 'Essential',
  starter: 'Starter',
}

export default async function MetaLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const lead = await prisma.metaQuizLead.findUnique({ where: { id } })
  if (!lead) notFound()

  const quizAnswers = lead.quizAnswers as Record<string, any> | null

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/meta-leads" className="text-sm text-gray-400 hover:text-emerald-500 transition-colors">← Meta Leads</Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {[lead.firstName, lead.lastName].filter(Boolean).join(' ')}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
              {lead.status}
            </span>
            <span className={`text-sm px-3 py-1 rounded-full border font-semibold ${lead.priority === 'HOT' ? 'border-red-300 text-red-700' : lead.priority === 'HIGH' ? 'border-orange-300 text-orange-700' : 'border-gray-300 text-gray-700'}`}>
              {lead.priority}
            </span>
            <span className="text-sm font-bold text-gray-700">Security Score: {lead.securityScore}/100</span>
          </div>
        </div>
        <div className="flex gap-3">
          <a href={`tel:${lead.phone}`} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
            <Phone size={16} /> Call
          </a>
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              <Mail size={16} /> Email
            </a>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security Score */}
          <Card>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Security Assessment</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-emerald-600">{lead.securityScore}</p>
                <p className="text-xs text-gray-500 mt-1">Security Score</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900 capitalize">{lead.riskLevel}</p>
                <p className="text-xs text-gray-500 mt-1">Risk Level</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{PACKAGE_LABELS[lead.recommendedPackage] || lead.recommendedPackage}</p>
                <p className="text-xs text-gray-500 mt-1">Recommended</p>
              </div>
            </div>
          </Card>

          {/* Quiz Answers */}
          <Card>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quiz Answers</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">Property Type:</span>
                <span className="font-medium capitalize">{lead.propertyType || '—'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Homeowner:</span>
                <span className="font-medium">{lead.isHomeowner ? 'Yes' : 'No (Renter)'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Top Concern:</span>
                <span className="font-medium">{lead.topConcern ? CONCERN_LABELS[lead.topConcern] || lead.topConcern : '—'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Current System:</span>
                <span className="font-medium capitalize">{lead.hasCurrentSystem?.replace(/_/g, ' ') || '—'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Urgency:</span>
                <span className="font-medium capitalize">{lead.urgencyLevel.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Lead Score:</span>
                <span className="font-medium">{lead.leadScore}/100</span>
              </div>
            </div>
            {quizAnswers?.features && (
              <div className="mt-4">
                <span className="text-gray-500 text-sm block mb-2">Features Interested:</span>
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(quizAnswers.features) ? quizAnswers.features : []).map((f: string) => (
                    <span key={f} className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full capitalize">
                      {f.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Funnel Timeline */}
          <Card>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Funnel Timeline</h2>
            <div className="space-y-3 text-sm">
              {([
                ['Quiz Started', lead.quizStartedAt],
                ['Quiz Completed', lead.quizCompletedAt],
                ['Contact Submitted', lead.contactSubmittedAt],
                ['Results Viewed', lead.resultsViewedAt],
              ] as [string, Date | null][]).map(([label, date]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}:</span>
                  <span className="font-medium">
                    {date ? date.toLocaleString() : '—'}
                  </span>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="text-gray-500">Guide Downloaded:</span>
                <span className="font-medium">{lead.guideDownloaded ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column: Actions + Info */}
        <div className="space-y-4">
          {/* Lead Actions — editable */}
          <MetaLeadActions
            lead={{
              id: lead.id,
              status: lead.status,
              priority: lead.priority,
              notes: lead.notes,
            }}
          />

          {/* Contact Info */}
          <Card>
            <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Contact Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={14} className="text-emerald-500" />
                <a href={`tel:${lead.phone}`} className="hover:text-emerald-500">{formatPhone(lead.phone)}</a>
              </div>
              {lead.email && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={14} className="text-emerald-500" />
                  <a href={`mailto:${lead.email}`} className="hover:text-emerald-500 truncate">{lead.email}</a>
                </div>
              )}
              {lead.zipCode && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={14} className="text-emerald-500" />
                  <span>ZIP: {lead.zipCode}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Attribution */}
          <Card>
            <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Attribution</h3>
            <div className="space-y-2 text-sm">
              {[
                ['Source', lead.utmSource],
                ['Medium', lead.utmMedium],
                ['Campaign', lead.utmCampaign],
                ['Ad Set', lead.utmAdset],
                ['Device', lead.deviceType],
                ['Landing Page', lead.landingPage],
              ].map(([label, value]) => value ? (
                <div key={label as string} className="flex justify-between">
                  <span className="text-gray-500">{label}:</span>
                  <span className="font-medium text-xs max-w-[120px] truncate">{value}</span>
                </div>
              ) : null)}
            </div>
          </Card>

          {/* Notifications */}
          <Card>
            <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Notifications</h3>
            <div className="space-y-2 text-sm">
              {[
                ['SMS to Lead', lead.smsToLeadSent],
                ['SMS to Rep', lead.smsToRepSent],
                ['Email to Lead', lead.emailToLeadSent],
                ['Slack Notif', lead.slackNotifSent],
              ].map(([label, sent]) => (
                <div key={label as string} className="flex justify-between">
                  <span className="text-gray-500">{label}:</span>
                  <span className={`font-medium ${sent ? 'text-green-600' : 'text-gray-400'}`}>
                    {sent ? 'Sent' : 'Not sent'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { formatPhone, formatCurrency, getStatusColor, getPriorityColor } from '@/lib/utils'
import { LEAD_STATUS_LABELS, PROPERTY_TYPE_LABELS, TIMELINE_LABELS } from '@/lib/constants'
import ActivityTimeline from '@/components/dashboard/ActivityTimeline'
import Card from '@/components/ui/Card'
import { Phone, Mail, MapPin, Calendar, User, Target, ExternalLink } from 'lucide-react'

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      activities: {
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
      },
      assignedRep: { select: { id: true, name: true, email: true, phone: true } },
      commissions: true,
      emailLogs: { orderBy: { sentAt: 'desc' }, take: 5 },
      smsLogs: { orderBy: { sentAt: 'desc' }, take: 5 },
    }
  })

  if (!lead) notFound()

  const statusClass = getStatusColor(lead.status)
  const priorityClass = getPriorityColor(lead.priority)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{lead.fullName}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-sm px-3 py-1 rounded-full font-semibold ${statusClass}`}>
              {LEAD_STATUS_LABELS[lead.status]}
            </span>
            <span className={`text-sm px-3 py-1 rounded-full border font-semibold ${priorityClass}`}>
              {lead.priority}
            </span>
            <span className="text-sm font-bold text-gray-700">Score: {lead.leadScore}/100</span>
          </div>
        </div>
        <div className="flex gap-3">
          <a href={`tel:${lead.phone}`} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
            <Phone size={16} /> Call
          </a>
          <a href={`mailto:${lead.email}`} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Mail size={16} /> Email
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Activity Timeline</h2>
            <ActivityTimeline activities={lead.activities.map(a => ({
              ...a,
              createdAt: a.createdAt.toISOString()
            }))} />
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Contact Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={14} className="text-emerald-500" />
                <a href={`tel:${lead.phone}`} className="hover:text-emerald-500">{formatPhone(lead.phone)}</a>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={14} className="text-emerald-500" />
                <a href={`mailto:${lead.email}`} className="hover:text-emerald-500 truncate">{lead.email}</a>
              </div>
              {lead.zipCode && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={14} className="text-emerald-500" />
                  <span>ZIP: {lead.zipCode}</span>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Quiz Answers</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Property:</span>
                <span className="font-medium">{lead.propertyType ? PROPERTY_TYPE_LABELS[lead.propertyType] : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ownership:</span>
                <span className="font-medium">{lead.homeownership || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Timeline:</span>
                <span className="font-medium">{lead.timeline ? TIMELINE_LABELS[lead.timeline] : '—'}</span>
              </div>
              <div>
                <span className="text-gray-500">Interested in:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {lead.productsInterested.map(p => (
                    <span key={p} className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Attribution</h3>
            <div className="space-y-2 text-sm">
              {[
                ['Source', lead.source],
                ['Medium', lead.medium],
                ['Campaign', lead.campaign],
                ['Keyword', lead.keyword],
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

          <Card>
            <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Metrics</h3>
            <div className="space-y-2 text-sm">
              {[
                ['Lead Score', `${lead.leadScore}/100`],
                ['Emails Sent', lead.emailsSent],
                ['SMS Sent', lead.smsSent],
                ['Calls Made', lead.callsMade],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between">
                  <span className="text-gray-500">{label}:</span>
                  <span className="font-bold">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {lead.notes && (
            <Card>
              <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">Notes</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

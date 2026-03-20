import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { formatPhone, formatCurrency } from '@/lib/utils'
import { B2B_STAGE_COLORS, B2B_BUSINESS_TYPE_COLORS } from '@/lib/constants'
import ActivityTimeline from '@/components/dashboard/ActivityTimeline'
import Card from '@/components/ui/Card'
import { Phone, Mail, Building2, MapPin, Calendar, Target, Shield } from 'lucide-react'
import B2BLeadActions from '@/components/dashboard/B2BLeadActions'

export default async function B2BLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      activities: {
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
      },
      assignedRep: { select: { id: true, name: true, email: true, phone: true } },
    },
  })

  if (!lead || lead.leadType !== 'B2B') notFound()

  const stageColor = B2B_STAGE_COLORS[lead.b2bPipelineStage || 'New Lead'] || 'bg-gray-100 text-gray-700'
  const typeColor = B2B_BUSINESS_TYPE_COLORS[lead.businessType || ''] || 'bg-gray-100 text-gray-700'

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400'
    if (score >= 8) return 'text-green-600'
    if (score >= 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">{lead.businessName || lead.fullName}</h1>
          <p className="text-gray-500 mt-0.5">{lead.fullName} — {lead.businessType || 'Business'}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-sm px-3 py-1 rounded-full font-semibold ${stageColor}`}>
              {lead.b2bPipelineStage || 'New Lead'}
            </span>
            {lead.businessType && (
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${typeColor}`}>
                {lead.businessType}
              </span>
            )}
            {lead.qualificationScore && (
              <span className={`text-sm font-bold ${getScoreColor(lead.qualificationScore)}`}>
                Score: {lead.qualificationScore}/10
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <a href={`tel:${lead.phone}`} className="flex items-center gap-2 bg-[#00C853] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00A846]">
            <Phone size={16} /> Call
          </a>
          <a href={`mailto:${lead.email}`} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Mail size={16} /> Email
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column — Activity + Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <B2BLeadActions
            leadId={lead.id}
            currentStage={lead.b2bPipelineStage || 'New Lead'}
            currentScore={lead.qualificationScore}
            currentDealValue={lead.estimatedDealValue}
            currentNotes={lead.notes}
            currentAssessmentDate={lead.assessmentDate?.toISOString() || null}
          />

          {/* Activity Timeline */}
          <Card>
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">Activity Timeline</h2>
            <ActivityTimeline activities={lead.activities.map(a => ({
              ...a,
              createdAt: a.createdAt.toISOString(),
            }))} />
          </Card>
        </div>

        {/* Right Column — Info Cards */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-bold text-[#1A1A2E] mb-3 text-sm uppercase tracking-wide">Contact Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={14} className="text-[#00C853]" />
                <a href={`tel:${lead.phone}`} className="hover:text-[#00C853]">{formatPhone(lead.phone)}</a>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={14} className="text-[#00C853]" />
                <a href={`mailto:${lead.email}`} className="hover:text-[#00C853] truncate">{lead.email}</a>
              </div>
              {lead.zipCode && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={14} className="text-[#00C853]" />
                  <span>ZIP: {lead.zipCode}</span>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-[#1A1A2E] mb-3 text-sm uppercase tracking-wide">Business Info</h3>
            <div className="space-y-2 text-sm">
              {[
                ['Business', lead.businessName],
                ['Type', lead.businessType],
                ['Locations', lead.numberOfLocations],
                ['Current Provider', lead.currentProvider],
                ['Biggest Concern', lead.biggestConcern],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between">
                  <span className="text-gray-500">{label}:</span>
                  <span className="font-medium text-right max-w-[160px] truncate">{(value as string) || '—'}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-[#1A1A2E] mb-3 text-sm uppercase tracking-wide">Deal Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Pipeline Stage:</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stageColor}`}>
                  {lead.b2bPipelineStage || 'New Lead'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Qualification:</span>
                <span className={`font-bold ${getScoreColor(lead.qualificationScore)}`}>
                  {lead.qualificationScore ? `${lead.qualificationScore}/10` : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Est. Deal Value:</span>
                <span className="font-bold">{lead.estimatedDealValue ? formatCurrency(lead.estimatedDealValue) : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assessment Date:</span>
                <span className="font-medium">
                  {lead.assessmentDate ? new Date(lead.assessmentDate).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-[#1A1A2E] mb-3 text-sm uppercase tracking-wide">Attribution</h3>
            <div className="space-y-2 text-sm">
              {[
                ['Source', lead.source],
                ['Medium', lead.medium],
                ['Campaign', lead.campaign],
              ].map(([label, value]) => value ? (
                <div key={label as string} className="flex justify-between">
                  <span className="text-gray-500">{label}:</span>
                  <span className="font-medium text-xs">{value}</span>
                </div>
              ) : null)}
            </div>
          </Card>

          {lead.notes && (
            <Card>
              <h3 className="font-bold text-[#1A1A2E] mb-2 text-sm uppercase tracking-wide">Notes</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

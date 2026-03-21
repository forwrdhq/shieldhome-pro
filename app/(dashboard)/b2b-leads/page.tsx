import { prisma } from '@/lib/db'
import { formatCurrency, timeAgo } from '@/lib/utils'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Phone, Mail, Building2 } from 'lucide-react'

const B2B_STAGES = [
  'New Lead', 'Contacted', 'Replied / Engaged', 'Qualified',
  'Assessment Scheduled', 'Assessment Complete', 'Proposal Sent',
  'Negotiation', 'Won', 'Lost',
]

const BUSINESS_TYPES = [
  'Dental/Medical Office', 'Retail Store', 'Restaurant/Food Service',
  'Warehouse/Distribution', 'Cannabis Dispensary', 'Property Management',
  'Auto Dealership', 'Corporate Office', 'Daycare/Childcare', 'Gym/Fitness Center', 'Other',
]

function stageColor(stage: string | null) {
  switch (stage) {
    case 'New Lead': return 'default'
    case 'Contacted': return 'info'
    case 'Replied / Engaged': return 'info'
    case 'Qualified': return 'info'
    case 'Assessment Scheduled': return 'warning'
    case 'Assessment Complete': return 'purple'
    case 'Proposal Sent': return 'purple'
    case 'Negotiation': return 'warning'
    case 'Won': return 'success'
    case 'Lost': return 'danger'
    default: return 'default'
  }
}

function scoreColor(score: number | null) {
  if (!score) return 'text-gray-400'
  if (score >= 8) return 'text-green-600 font-bold'
  if (score >= 5) return 'text-yellow-600 font-semibold'
  return 'text-red-500'
}

export default async function B2BLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    stage?: string
    businessType?: string
    source?: string
    from?: string
    to?: string
  }>
}) {
  const params = await searchParams

  const where: Record<string, any> = { leadType: 'B2B' }
  if (params.stage) where.b2bPipelineStage = params.stage
  if (params.businessType) where.businessType = params.businessType
  if (params.source) where.source = params.source
  if (params.from || params.to) {
    where.createdAt = {
      ...(params.from ? { gte: new Date(params.from) } : {}),
      ...(params.to ? { lte: new Date(params.to) } : {}),
    }
  }

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [leads, totalThisMonth, assessmentCount, proposalCount, wonLeads] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, firstName: true, lastName: true, fullName: true,
        email: true, phone: true, businessName: true, businessType: true,
        numberOfLocations: true, b2bPipelineStage: true, source: true,
        qualificationScore: true, estimatedDealValue: true, createdAt: true,
        submittedAt: true,
      },
    }),
    prisma.lead.count({ where: { leadType: 'B2B', createdAt: { gte: monthStart } } }),
    prisma.lead.count({ where: { leadType: 'B2B', b2bPipelineStage: 'Assessment Scheduled', createdAt: { gte: monthStart } } }),
    prisma.lead.count({ where: { leadType: 'B2B', b2bPipelineStage: 'Proposal Sent', createdAt: { gte: monthStart } } }),
    prisma.lead.findMany({
      where: { leadType: 'B2B', b2bPipelineStage: 'Won', createdAt: { gte: monthStart } },
      select: { estimatedDealValue: true },
    }),
  ])

  const wonRevenue = wonLeads.reduce((sum, l) => sum + (l.estimatedDealValue || 0), 0)

  const stats = [
    { label: 'B2B Leads This Month', value: totalThisMonth },
    { label: 'Assessments Scheduled', value: assessmentCount },
    { label: 'Proposals Sent', value: proposalCount },
    { label: `Deals Won (${wonLeads.length})`, value: formatCurrency(wonRevenue) },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#00C853]" />
            B2B Leads
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Commercial security pipeline</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Card key={s.label} padding="sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-[#1A1A2E]">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <form className="flex flex-wrap gap-3">
          <select
            name="stage"
            defaultValue={params.stage || ''}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white"
          >
            <option value="">All Stages</option>
            {B2B_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            name="businessType"
            defaultValue={params.businessType || ''}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white"
          >
            <option value="">All Business Types</option>
            {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            name="source"
            defaultValue={params.source || ''}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white"
          >
            <option value="">All Sources</option>
            {['website', 'cold-email', 'linkedin', 'referral', 'phone'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#1A1A2E]"
          >
            Filter
          </button>
          {(params.stage || params.businessType || params.source) && (
            <Link
              href="/b2b-leads"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 bg-white"
            >
              Clear
            </Link>
          )}
        </form>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Business', 'Contact', 'Type', 'Locations', 'Stage', 'Source', 'Score', 'Phone', 'Created', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400 text-sm">
                    No B2B leads found. {params.stage || params.businessType ? 'Try clearing filters.' : 'Leads will appear here once your outbound campaigns go live.'}
                  </td>
                </tr>
              )}
              {leads.map(lead => (
                <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link href={`/b2b-leads/${lead.id}`} className="font-semibold text-[#1A1A2E] hover:text-[#00C853]">
                      {lead.businessName || '—'}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{lead.fullName}</td>
                  <td className="py-3 px-4">
                    {lead.businessType ? (
                      <Badge variant="info" size="sm">{lead.businessType.split('/')[0]}</Badge>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-xs">{lead.numberOfLocations || '—'}</td>
                  <td className="py-3 px-4">
                    <Badge variant={stageColor(lead.b2bPipelineStage)} size="sm">
                      {lead.b2bPipelineStage || 'New Lead'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-gray-500">{lead.source || 'direct'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm ${scoreColor(lead.qualificationScore)}`}>
                      {lead.qualificationScore ? `${lead.qualificationScore}/10` : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <a href={`tel:${lead.phone}`} className="text-[#00C853] hover:underline text-xs flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {lead.phone}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
                    {timeAgo(lead.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/b2b-leads/${lead.id}`}
                      className="text-xs text-[#00C853] hover:underline font-medium"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

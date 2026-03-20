import { prisma } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import { B2B_STAGE_COLORS, B2B_BUSINESS_TYPE_COLORS, B2B_PIPELINE_STAGE_LIST } from '@/lib/constants'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const BUSINESS_TYPES = ['Retail', 'Office', 'Warehouse', 'Restaurant', 'Healthcare', 'Education', 'Manufacturing', 'Hospitality', 'Construction', 'Other']
const SOURCES = ['Cold Email', 'b2b-website', 'Referral', 'Google', 'LinkedIn']

export default async function B2BLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    stage?: string
    businessType?: string
    source?: string
    search?: string
    sort?: string
    order?: string
    page?: string
  }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 25
  const sort = params.sort || 'createdAt'
  const order = (params.order || 'desc') as 'asc' | 'desc'

  const where: any = { leadType: 'B2B' }
  if (params.stage) where.b2bPipelineStage = params.stage
  if (params.businessType) where.businessType = params.businessType
  if (params.source) where.source = params.source
  if (params.search) {
    where.OR = [
      { businessName: { contains: params.search, mode: 'insensitive' } },
      { firstName: { contains: params.search, mode: 'insensitive' } },
      { lastName: { contains: params.search, mode: 'insensitive' } },
      { email: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [leads, total, monthLeads, assessmentRate, proposalsSent, dealsWon] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sort]: order },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        fullName: true,
        email: true,
        phone: true,
        businessName: true,
        businessType: true,
        numberOfLocations: true,
        b2bPipelineStage: true,
        source: true,
        qualificationScore: true,
        estimatedDealValue: true,
        createdAt: true,
      },
    }),
    prisma.lead.count({ where }),
    // Stats
    prisma.lead.count({ where: { leadType: 'B2B', createdAt: { gte: monthStart } } }),
    prisma.lead.count({ where: { leadType: 'B2B', b2bPipelineStage: { in: ['Assessment Scheduled', 'Assessment Complete', 'Proposal Sent', 'Negotiation', 'Won'] } } }),
    prisma.lead.count({ where: { leadType: 'B2B', b2bPipelineStage: 'Proposal Sent', createdAt: { gte: monthStart } } }),
    prisma.lead.findMany({
      where: { leadType: 'B2B', b2bPipelineStage: 'Won', createdAt: { gte: monthStart } },
      select: { estimatedDealValue: true },
    }),
  ])

  const totalB2B = await prisma.lead.count({ where: { leadType: 'B2B' } })
  const assessmentPct = totalB2B > 0 ? Math.round((assessmentRate / totalB2B) * 100) : 0
  const wonRevenue = dealsWon.reduce((sum, d) => sum + (d.estimatedDealValue || 0), 0)
  const pages = Math.ceil(total / limit)

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400'
    if (score >= 8) return 'text-green-600 font-bold'
    if (score >= 5) return 'text-yellow-600 font-semibold'
    return 'text-red-600'
  }

  const buildSortUrl = (col: string) => {
    const newOrder = sort === col && order === 'desc' ? 'asc' : 'desc'
    const p = new URLSearchParams()
    if (params.stage) p.set('stage', params.stage)
    if (params.businessType) p.set('businessType', params.businessType)
    if (params.source) p.set('source', params.source)
    if (params.search) p.set('search', params.search)
    p.set('sort', col)
    p.set('order', newOrder)
    return `/b2b-leads?${p.toString()}`
  }

  const sortIndicator = (col: string) => sort === col ? (order === 'desc' ? ' ↓' : ' ↑') : ''

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">B2B Leads</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card padding="sm">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">B2B Leads This Month</p>
          <p className="text-2xl font-bold text-[#1A1A2E]">{monthLeads}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Assessment Rate</p>
          <p className="text-2xl font-bold text-[#1A1A2E]">{assessmentPct}%</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Proposals Sent</p>
          <p className="text-2xl font-bold text-[#1A1A2E]">{proposalsSent}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Deals Won This Month</p>
          <p className="text-2xl font-bold text-[#1A1A2E]">{dealsWon.length}</p>
          {wonRevenue > 0 && <p className="text-xs text-green-600 mt-0.5">{formatCurrency(wonRevenue)}</p>}
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          href="/b2b-leads"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!params.stage && !params.businessType && !params.source ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-600 border'}`}
        >
          All
        </Link>
        {B2B_PIPELINE_STAGE_LIST.map(stage => (
          <Link
            key={stage}
            href={`/b2b-leads?stage=${encodeURIComponent(stage)}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${params.stage === stage ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-600 border'}`}
          >
            {stage}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {BUSINESS_TYPES.map(type => (
          <Link
            key={type}
            href={`/b2b-leads?businessType=${encodeURIComponent(type)}${params.stage ? `&stage=${params.stage}` : ''}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${params.businessType === type ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-600 border'}`}
          >
            {type}
          </Link>
        ))}
      </div>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  { key: 'businessName', label: 'Business Name' },
                  { key: 'fullName', label: 'Contact Name' },
                  { key: 'businessType', label: 'Type' },
                  { key: 'numberOfLocations', label: '# Loc' },
                  { key: 'b2bPipelineStage', label: 'Pipeline Stage' },
                  { key: 'source', label: 'Source' },
                  { key: 'qualificationScore', label: 'Score' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'email', label: 'Email' },
                  { key: 'createdAt', label: 'Created' },
                ].map(col => (
                  <th key={col.key} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <Link href={buildSortUrl(col.key)} className="hover:text-[#1A1A2E]">
                      {col.label}{sortIndicator(col.key)}
                    </Link>
                  </th>
                ))}
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link href={`/b2b-leads/${lead.id}`} className="font-medium text-[#1A1A2E] hover:text-[#00C853]">
                      {lead.businessName || '—'}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{lead.fullName}</td>
                  <td className="py-3 px-4">
                    {lead.businessType ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${B2B_BUSINESS_TYPE_COLORS[lead.businessType] || 'bg-gray-100 text-gray-700'}`}>
                        {lead.businessType}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-center">{lead.numberOfLocations || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${B2B_STAGE_COLORS[lead.b2bPipelineStage || 'New Lead'] || 'bg-gray-100 text-gray-700'}`}>
                      {lead.b2bPipelineStage || 'New Lead'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="default" size="sm">{lead.source || 'direct'}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className={getScoreColor(lead.qualificationScore)}>
                      {lead.qualificationScore ? `${lead.qualificationScore}/10` : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <a href={`tel:${lead.phone}`} className="text-gray-600 hover:text-[#00C853]">{lead.phone}</a>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-xs max-w-[150px] truncate">{lead.email}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <Link href={`/b2b-leads/${lead.id}`} className="text-xs text-[#00C853] hover:underline font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-400">
                    No B2B leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(pages, 10) }, (_, i) => i + 1).map(p => (
                <Link
                  key={p}
                  href={`/b2b-leads?page=${p}${params.stage ? `&stage=${params.stage}` : ''}${params.sort ? `&sort=${params.sort}&order=${params.order}` : ''}`}
                  className={`px-3 py-1 rounded text-xs font-medium ${p === page ? 'bg-[#1A1A2E] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

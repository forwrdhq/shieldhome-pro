import { prisma } from '@/lib/db'
import { LEAD_STATUS_LABELS, PIPELINE_COLUMNS } from '@/lib/constants'
import LeadCard from '@/components/dashboard/LeadCard'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'

export default async function LeadsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; source?: string; view?: string }>
}) {
  const params = await searchParams
  const view = params.view || 'pipeline'

  const leads = await prisma.lead.findMany({
    where: {
      ...(params.status ? { status: params.status as any } : {}),
      ...(params.source ? { source: params.source } : {}),
    },
    orderBy: { submittedAt: 'desc' },
    include: { assignedRep: { select: { name: true } } }
  })

  const byStatus = PIPELINE_COLUMNS.reduce((acc, col) => {
    acc[col] = leads.filter(l => l.status === col)
    return acc
  }, {} as Record<string, typeof leads>)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Lead Pipeline</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/leads?view=pipeline"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'pipeline' ? 'bg-slate-900 text-white' : 'bg-white text-gray-600 border'}`}
          >
            Pipeline
          </Link>
          <Link
            href="/leads?view=table"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'table' ? 'bg-slate-900 text-white' : 'bg-white text-gray-600 border'}`}
          >
            Table
          </Link>
        </div>
      </div>

      {view === 'pipeline' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_COLUMNS.map(col => (
            <div key={col} className="flex-shrink-0 w-72">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-gray-700 text-sm">{LEAD_STATUS_LABELS[col]}</h3>
                <Badge variant="default" size="sm">{byStatus[col]?.length || 0}</Badge>
              </div>
              <div className="space-y-2">
                {byStatus[col]?.map(lead => (
                  <LeadCard key={lead.id} lead={{ ...lead, submittedAt: lead.submittedAt.toISOString() }} />
                ))}
                {(!byStatus[col] || byStatus[col].length === 0) && (
                  <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
                    <p className="text-xs text-gray-400">No leads</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name', 'Phone', 'Email', 'Source', 'Score', 'Priority', 'Status', 'Submitted', 'Rep'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link href={`/leads/${lead.id}`} className="font-medium text-slate-900 hover:text-emerald-500">{lead.fullName}</Link>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{lead.phone}</td>
                  <td className="py-3 px-4 text-gray-600 text-xs">{lead.email}</td>
                  <td className="py-3 px-4"><Badge variant={lead.source === 'facebook' ? 'info' : 'default'} size="sm">{lead.source || 'direct'}</Badge></td>
                  <td className="py-3 px-4 font-semibold">{lead.leadScore}</td>
                  <td className="py-3 px-4"><span className={`text-xs font-semibold ${lead.priority === 'HOT' ? 'text-red-600' : lead.priority === 'HIGH' ? 'text-orange-600' : 'text-gray-600'}`}>{lead.priority}</span></td>
                  <td className="py-3 px-4"><span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">{LEAD_STATUS_LABELS[lead.status]}</span></td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{new Date(lead.submittedAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-gray-600 text-xs">{lead.assignedRep?.name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

import { prisma } from '@/lib/db'
import MetaLeadCard from '@/components/dashboard/MetaLeadCard'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

const PIPELINE_COLUMNS = ['NEW', 'CONTACTED', 'APPOINTMENT_SET', 'APPOINTMENT_SAT', 'QUOTED', 'CLOSED_WON']

const STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  APPOINTMENT_SET: 'Appt Set',
  APPOINTMENT_SAT: 'Appt Sat',
  QUOTED: 'Quoted',
  CLOSED_WON: 'Closed Won',
}

export default async function MetaLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; q?: string }>
}) {
  const params = await searchParams
  const view = params.view || 'pipeline'
  const q = params.q || ''

  const leads = await prisma.metaQuizLead.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q, mode: 'insensitive' } },
            { phone: { contains: q } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {},
    orderBy: { createdAt: 'desc' },
  })

  const byStatus = PIPELINE_COLUMNS.reduce((acc, col) => {
    acc[col] = leads.filter(l => l.status === col)
    return acc
  }, {} as Record<string, typeof leads>)

  // Count other statuses for the "Other" bucket
  const otherLeads = leads.filter(l => !PIPELINE_COLUMNS.includes(l.status))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meta Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Quiz funnel leads from Facebook/Instagram ads</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/meta-leads?view=pipeline"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'pipeline' ? 'bg-slate-900 text-white' : 'bg-white text-gray-600 border'}`}
          >
            Pipeline
          </Link>
          <Link
            href="/meta-leads?view=table"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'table' ? 'bg-slate-900 text-white' : 'bg-white text-gray-600 border'}`}
          >
            Table
          </Link>
        </div>
      </div>

      {/* Search */}
      <form className="mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, phone, or email..."
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
        />
      </form>

      {view === 'pipeline' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_COLUMNS.map(col => (
            <div key={col} className="flex-shrink-0 w-72">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-gray-700 text-sm">{STATUS_LABELS[col]}</h3>
                <Badge variant="default" size="sm">{byStatus[col]?.length || 0}</Badge>
              </div>
              <div className="space-y-2">
                {byStatus[col]?.map(lead => (
                  <MetaLeadCard
                    key={lead.id}
                    lead={{
                      ...lead,
                      lastName: lead.lastName,
                      email: lead.email,
                      topConcern: lead.topConcern,
                      createdAt: lead.createdAt.toISOString(),
                    }}
                  />
                ))}
                {(!byStatus[col] || byStatus[col].length === 0) && (
                  <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
                    <p className="text-xs text-gray-400">No leads</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {otherLeads.length > 0 && (
            <div className="flex-shrink-0 w-72">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-gray-700 text-sm">Other</h3>
                <Badge variant="default" size="sm">{otherLeads.length}</Badge>
              </div>
              <div className="space-y-2">
                {otherLeads.map(lead => (
                  <MetaLeadCard
                    key={lead.id}
                    lead={{
                      ...lead,
                      lastName: lead.lastName,
                      email: lead.email,
                      topConcern: lead.topConcern,
                      createdAt: lead.createdAt.toISOString(),
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name', 'Phone', 'Email', 'Score', 'Priority', 'Status', 'Concern', 'Urgency', 'Submitted'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link href={`/meta-leads/${lead.id}`} className="font-medium text-slate-900 hover:text-emerald-500">
                      {[lead.firstName, lead.lastName].filter(Boolean).join(' ')}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{lead.phone}</td>
                  <td className="py-3 px-4 text-gray-600 text-xs">{lead.email || '—'}</td>
                  <td className="py-3 px-4 font-semibold">{lead.securityScore}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold ${lead.priority === 'HOT' ? 'text-red-600' : lead.priority === 'HIGH' ? 'text-orange-600' : 'text-gray-600'}`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      {STATUS_LABELS[lead.status] || lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-600">{lead.topConcern || '—'}</td>
                  <td className="py-3 px-4 text-xs text-gray-600">{lead.urgencyLevel}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

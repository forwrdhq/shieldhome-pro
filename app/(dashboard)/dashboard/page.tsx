import { prisma } from '@/lib/db'
import { formatCurrency, formatSpeedToContact, getSpeedColor } from '@/lib/utils'
import { LEAD_STATUS_LABELS } from '@/lib/constants'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default async function DashboardPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  const [
    todayLeads, yesterdayLeads, monthLeads, openLeads,
    avgSpeed, recentLeads, monthlySales
  ] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: today } } }),
    prisma.lead.count({ where: { createdAt: { gte: yesterday, lt: today } } }),
    prisma.lead.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.lead.count({ where: { status: { in: ['NEW', 'CONTACTED'] } } }),
    prisma.lead.aggregate({ _avg: { speedToContact: true } }),
    prisma.lead.findMany({
      take: 10,
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true, fullName: true, phone: true, source: true,
        leadScore: true, status: true, submittedAt: true, priority: true,
        speedToContact: true
      }
    }),
    prisma.commission.aggregate({
      where: { createdAt: { gte: monthStart } },
      _sum: { ourShare: true, netProfit: true }
    })
  ])

  const avgSpeedSecs = Math.round(avgSpeed._avg.speedToContact || 0)
  const monthRevenue = monthlySales._sum.ourShare || 0
  const netProfit = monthlySales._sum.netProfit || 0

  const stats = [
    { label: "Today's Leads", value: todayLeads, trend: yesterdayLeads > 0 ? Math.round(((todayLeads - yesterdayLeads) / yesterdayLeads) * 100) : 0 },
    { label: 'This Month', value: monthLeads },
    { label: 'Open Leads', value: openLeads },
    { label: 'Avg Speed', value: avgSpeedSecs > 0 ? formatSpeedToContact(avgSpeedSecs) : 'N/A', speedColor: getSpeedColor(avgSpeedSecs) },
    { label: 'Month Revenue', value: formatCurrency(monthRevenue) },
    { label: 'Net Profit MTD', value: formatCurrency(netProfit) },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map(s => (
          <Card key={s.label} padding="sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.speedColor || 'text-slate-900'}`}>{s.value}</p>
            {s.trend !== undefined && (
              <p className={`text-xs mt-1 ${s.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {s.trend >= 0 ? '+' : ''}{s.trend}% vs yesterday
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* Recent Leads */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Leads</h2>
          <Link href="/leads" className="text-sm text-emerald-500 hover:underline font-medium">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name', 'Phone', 'Source', 'Score', 'Status', 'Submitted', 'Speed'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLeads.map(lead => (
                <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-3">
                    <Link href={`/leads/${lead.id}`} className="font-medium text-slate-900 hover:text-emerald-500">
                      {lead.fullName}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-gray-600">{lead.phone}</td>
                  <td className="py-3 px-3">
                    <Badge variant={lead.source === 'facebook' ? 'info' : lead.source === 'google' ? 'danger' : 'default'} size="sm">
                      {lead.source || 'direct'}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-semibold">{lead.leadScore}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-700' : lead.status === 'CLOSED_WON' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {LEAD_STATUS_LABELS[lead.status]}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-500 text-xs">
                    {new Date(lead.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3">
                    {lead.speedToContact ? (
                      <span className={`text-xs font-medium ${getSpeedColor(lead.speedToContact)}`}>
                        {formatSpeedToContact(lead.speedToContact)}
                      </span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
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

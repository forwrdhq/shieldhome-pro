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
    avgSpeed, recentLeads, monthlySales,
    // Meta quiz lead stats
    metaTodayLeads, metaMonthLeads, metaOpenLeads, metaRecentLeads,
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
        speedToContact: true,
      },
    }),
    prisma.commission.aggregate({
      where: { createdAt: { gte: monthStart } },
      _sum: { ourShare: true, netProfit: true },
    }),
    // Meta quiz leads
    prisma.metaQuizLead.count({ where: { createdAt: { gte: today } } }),
    prisma.metaQuizLead.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.metaQuizLead.count({ where: { status: { in: ['NEW', 'CONTACTED'] } } }),
    prisma.metaQuizLead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, firstName: true, lastName: true, phone: true,
        securityScore: true, status: true, priority: true, createdAt: true,
        topConcern: true, urgencyLevel: true,
      },
    }),
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

  const metaStats = [
    { label: 'Meta Today', value: metaTodayLeads },
    { label: 'Meta This Month', value: metaMonthLeads },
    { label: 'Meta Open', value: metaOpenLeads },
    { label: 'Total Pipeline', value: openLeads + metaOpenLeads },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      {/* Lead Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
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

      {/* Meta Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metaStats.map(s => (
          <Card key={s.label} padding="sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
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
                  {['Name', 'Phone', 'Source', 'Score', 'Status', 'Speed'].map(h => (
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

        {/* Recent Meta Leads */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Meta Leads</h2>
            <Link href="/meta-leads" className="text-sm text-emerald-500 hover:underline font-medium">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Name', 'Phone', 'Score', 'Priority', 'Status', 'Submitted'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metaRecentLeads.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-400 text-sm">No meta leads yet</td></tr>
                ) : (
                  metaRecentLeads.map(lead => (
                    <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <Link href={`/meta-leads/${lead.id}`} className="font-medium text-slate-900 hover:text-emerald-500">
                          {[lead.firstName, lead.lastName].filter(Boolean).join(' ')}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-gray-600">{lead.phone}</td>
                      <td className="py-3 px-3 font-semibold">{lead.securityScore}</td>
                      <td className="py-3 px-3">
                        <span className={`text-xs font-semibold ${lead.priority === 'HOT' ? 'text-red-600' : lead.priority === 'HIGH' ? 'text-orange-600' : 'text-gray-600'}`}>
                          {lead.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-xs">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

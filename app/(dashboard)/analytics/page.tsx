import { getAnalyticsData } from '@/lib/analytics'
import { formatCurrency } from '@/lib/utils'
import Card from '@/components/ui/Card'

export default async function AnalyticsPage() {
  const endDate = new Date()
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const data = await getAnalyticsData(startDate, endDate)
  const o = data.overview

  const kpis = [
    { label: 'Total Leads', value: o.totalLeads },
    { label: 'Total Sales', value: o.totalSales },
    { label: 'Conversion Rate', value: `${o.conversionRate.toFixed(1)}%` },
    { label: 'Avg CPL', value: formatCurrency(o.avgCPL) },
    { label: 'CPA', value: formatCurrency(o.avgCPA) },
    { label: 'ROAS', value: `${o.roas.toFixed(2)}x` },
    { label: 'Net Profit', value: formatCurrency(o.netProfit) },
    { label: 'Avg Lead Score', value: o.avgLeadScore },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <a
          href="/api/analytics/export"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
        >
          Export CSV
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map(kpi => (
          <Card key={kpi.label} padding="sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
          </Card>
        ))}
      </div>

      {/* Funnel */}
      <Card className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Conversion Funnel</h2>
        <div className="space-y-3">
          {[
            { label: 'Lead → Contact', value: data.funnelMetrics.leadToContact },
            { label: 'Contact → Appointment', value: data.funnelMetrics.contactToAppointment },
            { label: 'Appointment → Sat', value: data.funnelMetrics.appointmentToSat },
            { label: 'Sat → Close', value: data.funnelMetrics.satToClose },
            { label: 'Lead → Close (Overall)', value: data.funnelMetrics.leadToClose },
          ].map(f => (
            <div key={f.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{f.label}</span>
                <span className="text-sm font-bold">{f.value.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-emerald-600 rounded-full"
                  style={{ width: `${Math.min(f.value, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Source Breakdown */}
      <Card>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Source Performance</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['Source', 'Leads', 'Sales', 'Conv Rate', 'CPL'].map(h => (
                <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.bySource).map(([src, d]) => (
              <tr key={src} className="border-b border-gray-50">
                <td className="py-3 px-3 font-medium capitalize">{src}</td>
                <td className="py-3 px-3">{d.leads}</td>
                <td className="py-3 px-3">{d.sales}</td>
                <td className="py-3 px-3">{d.convRate.toFixed(1)}%</td>
                <td className="py-3 px-3">{d.cpl > 0 ? formatCurrency(d.cpl) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

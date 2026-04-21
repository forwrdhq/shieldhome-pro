import { prisma } from '@/lib/db'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { ourProjection } from '@/lib/kpi-math'
import WeekRow from './WeekRow'
import AddWeekToggle from './AddWeekToggle'

export const dynamic = 'force-dynamic'

export default async function WeeklyPage() {
  const weeks = await prisma.weeklyKpi.findMany({
    orderBy: { weekStart: 'desc' },
    include: { deals: { orderBy: { installDate: 'desc' } } },
  })

  // Enrich each week with computed metrics + lead count from Lead table
  const enriched = await Promise.all(
    weeks.map(async w => {
      const leadsInWeek = await prisma.lead.count({
        where: { createdAt: { gte: w.weekStart, lt: w.weekEnd } },
      })
      const totalSpend = w.metaSpend + w.googleSpend + w.otherSpend
      const totalUpfrontCommission = w.deals.reduce((s, d) => s + d.upfrontCommission, 0)
      const proj = ourProjection(totalUpfrontCommission, totalSpend)

      // Cash math uses actual amounts received (upfrontReceived/backendReceived),
      // falling back to computed-from-deals if nothing entered yet.
      const ourUpfront = w.upfrontReceived > 0 ? w.upfrontReceived * 0.5 : proj.ourUpfront
      const ourBackend = w.backendReceived * 0.5
      const totalAdSpendHalf = totalSpend * 0.5
      const ourNet = ourUpfront + ourBackend - totalAdSpendHalf

      return {
        ...w,
        computed: {
          totalSpend,
          totalAdSpendHalf,
          ourUpfront,
          ourBackend,
          ourTotal: ourUpfront + ourBackend,
          ourNet,
          roas: proj.roas,
          projectedBackend1: proj.ourBackend1 * 2,
          projectedBackend2: proj.ourBackend2 * 2,
          ourProjectedTotal: proj.ourTotal,
          ourProjectedNet: proj.ourNet,
          dealCount: w.deals.length,
          leadsInWeek,
          closeRate: leadsInWeek > 0 ? (w.deals.length / leadsInWeek) * 100 : 0,
        },
      }
    })
  )

  // Lifetime totals
  const totalLeads = await prisma.lead.count()
  const totalClosed = await prisma.lead.count({ where: { status: 'CLOSED_WON' } })
  const lifetimeCloseRate = totalLeads > 0 ? (totalClosed / totalLeads) * 100 : 0

  const ytdStats = enriched.reduce(
    (acc, w) => ({
      totalSpend: acc.totalSpend + w.computed.totalSpend,
      ourNet: acc.ourNet + w.computed.ourNet,
      ourProjectedNet: acc.ourProjectedNet + w.computed.ourProjectedNet,
      deals: acc.deals + w.computed.dealCount,
    }),
    { totalSpend: 0, ourNet: 0, ourProjectedNet: 0, deals: 0 }
  )

  const statCards = [
    { label: 'Weeks Logged', value: enriched.length.toString() },
    { label: 'Total Deals', value: ytdStats.deals.toString() },
    { label: 'Your Net Cash', value: formatCurrency(ytdStats.ourNet), color: ytdStats.ourNet >= 0 ? 'text-emerald-600' : 'text-red-600' },
    { label: 'Projected Net', value: formatCurrency(ytdStats.ourProjectedNet), color: 'text-slate-900' },
    { label: 'Lifetime Leads', value: totalLeads.toString() },
    { label: 'Lifetime Close %', value: `${lifetimeCloseRate.toFixed(2)}%` },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Weekly KPIs</h1>
          <p className="text-sm text-gray-500 mt-1">Track ad spend, closed deals, and profit week by week</p>
        </div>
        <AddWeekToggle />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map(s => (
          <Card key={s.label} padding="sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color || 'text-slate-900'}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {enriched.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-semibold text-slate-700 mb-2">No weeks logged yet</p>
            <p className="text-sm">Click "Log Week" to add your first week of ad spend + closed deals.</p>
          </div>
        </Card>
      ) : (
        <div>{enriched.map(w => <WeekRow key={w.id} week={w as any} />)}</div>
      )}
    </div>
  )
}

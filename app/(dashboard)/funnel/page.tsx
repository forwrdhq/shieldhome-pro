import { prisma } from '@/lib/db'
import Card from '@/components/ui/Card'
import { formatSpeedToContact, getSpeedColor } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getFunnelStats(since?: Date) {
  const where = since ? { createdAt: { gte: since } } : {}

  const leads = await prisma.lead.findMany({
    where,
    select: {
      status: true,
      firstContactAt: true,
      appointmentDate: true,
      appointmentSat: true,
      saleDate: true,
      speedToContact: true,
      source: true,
      utmContent: true,
      dispositionNote: true,
    },
  })

  const total = leads.length
  const contacted = leads.filter(l => l.firstContactAt).length
  const appt = leads.filter(l => l.appointmentDate).length
  const sat = leads.filter(l => l.appointmentSat).length
  const closed = leads.filter(l => l.saleDate || l.status === 'CLOSED_WON').length

  const speeds = leads.map(l => l.speedToContact).filter((s): s is number => typeof s === 'number').sort((a, b) => a - b)
  const medianSpeed = speeds.length > 0 ? speeds[Math.floor(speeds.length / 2)] : 0

  const bySourceMap: Record<string, { leads: number; contacted: number; closed: number }> = {}
  leads.forEach(l => {
    const src = l.source || 'direct'
    if (!bySourceMap[src]) bySourceMap[src] = { leads: 0, contacted: 0, closed: 0 }
    bySourceMap[src].leads++
    if (l.firstContactAt) bySourceMap[src].contacted++
    if (l.saleDate || l.status === 'CLOSED_WON') bySourceMap[src].closed++
  })

  const byAdsetMap: Record<string, { leads: number; contacted: number; closed: number }> = {}
  leads.forEach(l => {
    if (!l.utmContent) return
    const ad = l.utmContent
    if (!byAdsetMap[ad]) byAdsetMap[ad] = { leads: 0, contacted: 0, closed: 0 }
    byAdsetMap[ad].leads++
    if (l.firstContactAt) byAdsetMap[ad].contacted++
    if (l.saleDate || l.status === 'CLOSED_WON') byAdsetMap[ad].closed++
  })

  return {
    total,
    contacted,
    appt,
    sat,
    closed,
    medianSpeed,
    bySource: Object.entries(bySourceMap).map(([src, v]) => ({
      src,
      leads: v.leads,
      contacted: v.contacted,
      closed: v.closed,
      connectRate: v.leads > 0 ? (v.contacted / v.leads) * 100 : 0,
      closeRate: v.leads > 0 ? (v.closed / v.leads) * 100 : 0,
    })).sort((a, b) => b.leads - a.leads),
    byAdset: Object.entries(byAdsetMap).map(([ad, v]) => ({
      ad,
      leads: v.leads,
      contacted: v.contacted,
      closed: v.closed,
      connectRate: v.leads > 0 ? (v.contacted / v.leads) * 100 : 0,
      closeRate: v.leads > 0 ? (v.closed / v.leads) * 100 : 0,
    })).sort((a, b) => b.leads - a.leads),
  }
}

async function getAgentStats(since?: Date) {
  const where = since ? { startedAt: { gte: since } } : {}
  const calls = await prisma.call.findMany({
    where,
    select: {
      agentName: true,
      status: true,
      duration: true,
      lead: { select: { saleDate: true, appointmentDate: true } },
    },
  })

  const byAgent: Record<string, { calls: number; answered: number; talkSec: number; appts: number; sales: number }> = {}
  for (const c of calls) {
    const name = c.agentName || 'Unassigned'
    if (!byAgent[name]) byAgent[name] = { calls: 0, answered: 0, talkSec: 0, appts: 0, sales: 0 }
    byAgent[name].calls++
    const s = (c.status || '').toLowerCase()
    const answered = s.includes('answered') || s.includes('connected') || s.includes('completed') || s.includes('talked')
    if (answered) byAgent[name].answered++
    if (typeof c.duration === 'number') byAgent[name].talkSec += c.duration
    if (c.lead?.appointmentDate) byAgent[name].appts++
    if (c.lead?.saleDate) byAgent[name].sales++
  }

  return Object.entries(byAgent).map(([name, v]) => ({
    name,
    calls: v.calls,
    answered: v.answered,
    answerRate: v.calls > 0 ? (v.answered / v.calls) * 100 : 0,
    avgTalkSec: v.answered > 0 ? Math.round(v.talkSec / v.answered) : 0,
    appts: v.appts,
    sales: v.sales,
  })).sort((a, b) => b.calls - a.calls)
}

function pct(num: number, den: number): string {
  if (den === 0) return '0%'
  return `${((num / den) * 100).toFixed(1)}%`
}

function FunnelBar({ label, value, total, prev, colorClass }: { label: string; value: number; total: number; prev?: number; colorClass: string }) {
  const widthPct = total > 0 ? (value / total) * 100 : 0
  const dropoffPct = prev !== undefined && prev > 0 ? (value / prev) * 100 : 100
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-semibold text-slate-900">{label}</span>
        <span className="text-gray-600">
          <span className="font-bold text-slate-900">{value}</span>
          <span className="text-xs text-gray-500"> ({pct(value, total)} of top){prev !== undefined && ` · ${dropoffPct.toFixed(0)}% of prev`}</span>
        </span>
      </div>
      <div className="h-8 bg-slate-100 rounded-md overflow-hidden">
        <div className={`h-full ${colorClass} transition-all`} style={{ width: `${widthPct}%` }} />
      </div>
    </div>
  )
}

export default async function FunnelPage() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000)

  const [allTime, month, last30, agents30] = await Promise.all([
    getFunnelStats(),
    getFunnelStats(monthStart),
    getFunnelStats(thirtyDaysAgo),
    getAgentStats(thirtyDaysAgo),
  ])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Lead Funnel</h1>
      <p className="text-sm text-gray-500 mb-6">Where leads drop off on the way to closed-won</p>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Last 30 Days', stats: last30 },
          { title: 'Month to Date', stats: month },
          { title: 'All Time', stats: allTime },
        ].map(({ title, stats }) => (
          <Card key={title}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">{title}</h2>
              <span className={`text-xs font-semibold ${getSpeedColor(stats.medianSpeed || 9999)}`}>
                Med. speed: {stats.medianSpeed > 0 ? formatSpeedToContact(stats.medianSpeed) : 'N/A'}
              </span>
            </div>
            <FunnelBar label="Leads" value={stats.total} total={stats.total} colorClass="bg-slate-400" />
            <FunnelBar label="Contacted" value={stats.contacted} total={stats.total} prev={stats.total} colorClass="bg-blue-500" />
            <FunnelBar label="Appt. Set" value={stats.appt} total={stats.total} prev={stats.contacted} colorClass="bg-indigo-500" />
            <FunnelBar label="Appt. Sat" value={stats.sat} total={stats.total} prev={stats.appt} colorClass="bg-purple-500" />
            <FunnelBar label="Closed Won" value={stats.closed} total={stats.total} prev={stats.sat} colorClass="bg-emerald-600" />
            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between text-sm">
              <span className="text-gray-600">Close rate (lead → sold)</span>
              <span className="font-bold text-emerald-600">{pct(stats.closed, stats.total)}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-lg font-bold text-slate-900 mb-4">By Source (All Time)</h2>
        {allTime.bySource.length === 0 ? (
          <p className="text-sm text-gray-400">No data yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-gray-500">
                <th className="text-left py-2 font-semibold">Source</th>
                <th className="text-right py-2 font-semibold">Leads</th>
                <th className="text-right py-2 font-semibold">Connect %</th>
                <th className="text-right py-2 font-semibold">Closed</th>
                <th className="text-right py-2 font-semibold">Close Rate</th>
              </tr>
            </thead>
            <tbody>
              {allTime.bySource.map(s => (
                <tr key={s.src} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 font-medium text-slate-900 capitalize">{s.src}</td>
                  <td className="py-2 text-right text-slate-700">{s.leads}</td>
                  <td className="py-2 text-right text-slate-700">{s.connectRate.toFixed(0)}%</td>
                  <td className="py-2 text-right text-slate-700">{s.closed}</td>
                  <td className="py-2 text-right font-semibold text-emerald-600">{s.closeRate.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Connection Rate by Adset (Last 30d)</h2>
        <p className="text-xs text-gray-500 mb-4">Which adsets bring leads our reps actually reach</p>
        {last30.byAdset.length === 0 ? (
          <p className="text-sm text-gray-400">No adset data yet — UTM content tags arrive with Meta-tracked leads</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-gray-500">
                <th className="text-left py-2 font-semibold">Adset</th>
                <th className="text-right py-2 font-semibold">Leads</th>
                <th className="text-right py-2 font-semibold">Contacted</th>
                <th className="text-right py-2 font-semibold">Connect %</th>
                <th className="text-right py-2 font-semibold">Closed</th>
              </tr>
            </thead>
            <tbody>
              {last30.byAdset.slice(0, 25).map(s => (
                <tr key={s.ad} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 font-medium text-slate-900 truncate max-w-[300px]" title={s.ad}>{s.ad}</td>
                  <td className="py-2 text-right text-slate-700">{s.leads}</td>
                  <td className="py-2 text-right text-slate-700">{s.contacted}</td>
                  <td className="py-2 text-right font-semibold text-blue-600">{s.connectRate.toFixed(0)}%</td>
                  <td className="py-2 text-right text-slate-700">{s.closed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Per-Rep Performance (Last 30d)</h2>
        <p className="text-xs text-gray-500 mb-4">Calls from Callingly · use to compare reps before/after the second hire</p>
        {agents30.length === 0 ? (
          <p className="text-sm text-gray-400">No call data yet — Callingly sync runs every 15 min</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-gray-500">
                <th className="text-left py-2 font-semibold">Rep</th>
                <th className="text-right py-2 font-semibold">Calls</th>
                <th className="text-right py-2 font-semibold">Answered</th>
                <th className="text-right py-2 font-semibold">Answer %</th>
                <th className="text-right py-2 font-semibold">Avg Talk</th>
                <th className="text-right py-2 font-semibold">Appts</th>
                <th className="text-right py-2 font-semibold">Sales</th>
              </tr>
            </thead>
            <tbody>
              {agents30.map(a => (
                <tr key={a.name} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 font-medium text-slate-900">{a.name}</td>
                  <td className="py-2 text-right text-slate-700">{a.calls}</td>
                  <td className="py-2 text-right text-slate-700">{a.answered}</td>
                  <td className="py-2 text-right text-slate-700">{a.answerRate.toFixed(0)}%</td>
                  <td className="py-2 text-right text-slate-700">{a.avgTalkSec > 0 ? `${Math.floor(a.avgTalkSec/60)}m ${a.avgTalkSec%60}s` : '—'}</td>
                  <td className="py-2 text-right text-slate-700">{a.appts}</td>
                  <td className="py-2 text-right font-semibold text-emerald-600">{a.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}

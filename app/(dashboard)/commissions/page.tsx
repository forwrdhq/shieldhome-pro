import { prisma } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default async function CommissionsPage() {
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [commissions, summary] = await Promise.all([
    prisma.commission.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        lead: { select: { fullName: true } },
        rep: { select: { name: true } }
      }
    }),
    prisma.commission.groupBy({
      by: ['status'],
      _sum: { ourShare: true, netProfit: true }
    })
  ])

  const totals = {
    pending: commissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + c.ourShare, 0),
    approved: commissions.filter(c => c.status === 'APPROVED').reduce((s, c) => s + c.ourShare, 0),
    paid: commissions.filter(c => c.status === 'PAID').reduce((s, c) => s + c.ourShare, 0),
    all: commissions.reduce((s, c) => s + c.ourShare, 0),
  }

  const statusColor: Record<string, string> = {
    PENDING: 'warning',
    APPROVED: 'info',
    PAID: 'success',
    CLAWBACK: 'danger',
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Commissions</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending', value: totals.pending },
          { label: 'Approved', value: totals.approved },
          { label: 'Paid (All Time)', value: totals.paid },
          { label: 'Total All Time', value: totals.all },
        ].map(s => (
          <Card key={s.label} padding="sm">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(s.value)}</p>
          </Card>
        ))}
      </div>

      {/* Commission Table */}
      <Card padding="none">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-slate-900">All Commissions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Date', 'Lead', 'Rep', 'Sale Amount', 'Gross Commission', 'Our Share (50%)', 'Rep Share', 'Ad Spend', 'Net', 'Status'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {commissions.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-medium">{c.lead.fullName}</td>
                  <td className="py-3 px-4 text-gray-600">{c.rep.name}</td>
                  <td className="py-3 px-4 font-semibold">{formatCurrency(c.saleAmount)}</td>
                  <td className="py-3 px-4">{formatCurrency(c.grossCommission)}</td>
                  <td className="py-3 px-4 font-bold text-green-700">{formatCurrency(c.ourShare)}</td>
                  <td className="py-3 px-4">{formatCurrency(c.repShare)}</td>
                  <td className="py-3 px-4">{c.adSpend ? formatCurrency(c.adSpend) : '—'}</td>
                  <td className="py-3 px-4 font-bold">{c.netProfit ? formatCurrency(c.netProfit) : '—'}</td>
                  <td className="py-3 px-4">
                    <Badge variant={(statusColor[c.status] as any) || 'default'} size="sm">{c.status}</Badge>
                  </td>
                </tr>
              ))}
              {commissions.length === 0 && (
                <tr><td colSpan={10} className="py-8 text-center text-gray-400">No commissions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import WeekForm from './WeekForm'
import { deleteWeek } from './actions'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronRight, Edit2, Trash2 } from 'lucide-react'

interface Deal {
  id: string
  customerName: string
  vivintAccountIds: string[]
  product: string | null
  upfrontCommission: number
  installDate: Date | null
  notes: string | null
}

interface Week {
  id: string
  weekStart: Date
  weekEnd: Date
  metaSpend: number
  googleSpend: number
  otherSpend: number
  upfrontReceived: number
  backendReceived: number
  notes: string | null
  metaCampaigns: any
  deals: Deal[]
  computed: {
    totalSpend: number
    totalAdSpendHalf: number
    ourUpfront: number
    ourBackend: number
    ourTotal: number
    ourNet: number
    roas: number
    projectedBackend1: number
    projectedBackend2: number
    ourProjectedTotal: number
    ourProjectedNet: number
    dealCount: number
    leadsInWeek: number
    closeRate: number
  }
}

export default function WeekRow({ week }: { week: Week }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const router = useRouter()
  const c = week.computed

  const dateRange = `${new Date(week.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(new Date(week.weekEnd).getTime() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`

  if (editing) {
    return (
      <div className="border border-emerald-500 rounded-lg p-6 mb-3 bg-emerald-50/30">
        <WeekForm
          initial={{
            id: week.id,
            weekStart: new Date(week.weekStart).toISOString(),
            metaSpend: week.metaSpend,
            googleSpend: week.googleSpend,
            otherSpend: week.otherSpend,
            upfrontReceived: week.upfrontReceived,
            backendReceived: week.backendReceived,
            notes: week.notes ?? '',
            metaCampaigns: Array.isArray(week.metaCampaigns) ? week.metaCampaigns : undefined,
            deals: week.deals,
          }}
          onDone={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="border border-slate-200 rounded-lg mb-3 bg-white">
      <div className="grid grid-cols-[auto_180px_120px_100px_120px_120px_120px_80px] items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="text-gray-400">
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
        <div>
          <div className="font-semibold text-slate-900 text-sm">{dateRange}</div>
          <div className="text-xs text-gray-500">{c.dealCount} deal{c.dealCount !== 1 ? 's' : ''} · {c.leadsInWeek} leads</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Ad Spend</div>
          <div className="font-semibold text-slate-900 text-sm">{formatCurrency(c.totalSpend)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Close %</div>
          <div className="font-semibold text-slate-900 text-sm">{c.closeRate.toFixed(1)}%</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Your Upfront</div>
          <div className="font-semibold text-emerald-600 text-sm">{formatCurrency(c.ourUpfront)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Your Net Now</div>
          <div className={`font-semibold text-sm ${c.ourNet >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(c.ourNet)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Proj. Total</div>
          <div className="font-semibold text-slate-900 text-sm">{formatCurrency(c.ourProjectedNet)}</div>
        </div>
        <div className="flex gap-1 justify-end" onClick={e => e.stopPropagation()}>
          <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-emerald-600 p-1">
            <Edit2 size={14} />
          </button>
          <button
            onClick={async () => {
              if (confirm(`Delete week ${dateRange}?`)) {
                await deleteWeek(week.id)
                router.refresh()
              }
            }}
            className="text-gray-400 hover:text-red-600 p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-4 bg-slate-50/50">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Money breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Profitability</h4>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-slate-200"><td className="py-1 text-gray-600">Total ad spend</td><td className="py-1 text-right font-semibold">{formatCurrency(c.totalSpend)}</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-1 text-gray-600">Your half of ad spend</td><td className="py-1 text-right font-semibold text-red-600">-{formatCurrency(c.totalAdSpendHalf)}</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-1 text-gray-600">Upfront received (your half)</td><td className="py-1 text-right font-semibold text-emerald-600">+{formatCurrency(c.ourUpfront)}</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-1 text-gray-600">Backends received (your half)</td><td className="py-1 text-right font-semibold text-emerald-600">+{formatCurrency(c.ourBackend)}</td></tr>
                  <tr className="border-b-2 border-slate-300"><td className="py-2 font-bold text-slate-900">Your net (cash today)</td><td className={`py-2 text-right font-bold ${c.ourNet >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(c.ourNet)}</td></tr>
                  <tr><td className="py-1 text-gray-600 text-xs">Projected Oct backend (your ½)</td><td className="py-1 text-right text-xs text-gray-600">+{formatCurrency(c.projectedBackend1 / 2)}</td></tr>
                  <tr><td className="py-1 text-gray-600 text-xs">Projected Jan backend (your ½)</td><td className="py-1 text-right text-xs text-gray-600">+{formatCurrency(c.projectedBackend2 / 2)}</td></tr>
                  <tr className="border-t-2 border-slate-300"><td className="py-2 font-bold text-slate-900">Projected total net</td><td className="py-2 text-right font-bold text-slate-900">{formatCurrency(c.ourProjectedNet)}</td></tr>
                </tbody>
              </table>
              {c.roas > 0 && <div className="mt-3 text-sm text-gray-600">ROAS (gross commission / ad spend): <span className="font-bold text-slate-900">{c.roas.toFixed(2)}x</span></div>}
            </div>

            {/* Deals */}
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Deals</h4>
              {week.deals.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No deals logged</p>
              ) : (
                <div className="space-y-2">
                  {week.deals.map(d => (
                    <div key={d.id} className="border border-slate-200 rounded p-3 bg-white">
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-semibold text-sm text-slate-900">{d.customerName}</div>
                        <div className="text-sm font-semibold text-emerald-600">{formatCurrency(d.upfrontCommission)}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {d.vivintAccountIds.length > 0 && <span>{d.vivintAccountIds.join(', ')}</span>}
                        {d.product && <span> · {d.product}</span>}
                        {d.installDate && <span> · installed {new Date(d.installDate).toLocaleDateString()}</span>}
                      </div>
                      {d.notes && <div className="text-xs text-gray-600 mt-1">{d.notes}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Campaigns */}
              {Array.isArray(week.metaCampaigns) && week.metaCampaigns.length > 0 && (
                <>
                  <h4 className="text-xs font-bold uppercase text-gray-500 mt-4 mb-2">Meta Campaigns</h4>
                  <table className="w-full text-xs">
                    <thead><tr className="text-left text-gray-500"><th className="py-1">Campaign</th><th className="py-1 text-right">Spend</th><th className="py-1 text-right">Leads</th><th className="py-1 text-right">CPL</th></tr></thead>
                    <tbody>
                      {(week.metaCampaigns as any[]).map((camp, i) => (
                        <tr key={i} className="border-t border-slate-200">
                          <td className="py-1 text-slate-700">{camp.name}</td>
                          <td className="py-1 text-right">{formatCurrency(camp.spend)}</td>
                          <td className="py-1 text-right">{camp.leads}</td>
                          <td className="py-1 text-right">{camp.cpl ? formatCurrency(camp.cpl) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
          {week.notes && <div className="mt-4 text-sm text-gray-600 italic">{week.notes}</div>}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { upsertWeek } from './actions'
import { Plus, Trash2 } from 'lucide-react'

type Deal = {
  customerName: string
  vivintAccountIds: string
  product: string
  upfrontCommission: string
  installDate: string
  notes: string
}

type Campaign = { name: string; spend: string; leads: string }

interface Props {
  initial?: {
    id?: string
    weekStart?: string
    metaSpend?: number
    googleSpend?: number
    otherSpend?: number
    upfrontReceived?: number
    backendReceived?: number
    notes?: string
    metaCampaigns?: Array<{ name: string; spend: number; leads: number }>
    deals?: Array<{
      customerName: string
      vivintAccountIds: string[]
      product: string | null
      upfrontCommission: number
      installDate: Date | null
      notes: string | null
    }>
  }
  onDone?: () => void
}

function getMondayIso(d: Date = new Date()) {
  const out = new Date(d)
  out.setHours(0, 0, 0, 0)
  const day = out.getDay()
  out.setDate(out.getDate() + (day === 0 ? -6 : 1 - day))
  return out.toISOString().slice(0, 10)
}

export default function WeekForm({ initial, onDone }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [weekStart, setWeekStart] = useState(
    initial?.weekStart ? new Date(initial.weekStart).toISOString().slice(0, 10) : getMondayIso()
  )
  const [metaSpend, setMetaSpend] = useState(String(initial?.metaSpend ?? ''))
  const [googleSpend, setGoogleSpend] = useState(String(initial?.googleSpend ?? ''))
  const [otherSpend, setOtherSpend] = useState(String(initial?.otherSpend ?? ''))
  const [upfrontReceived, setUpfrontReceived] = useState(String(initial?.upfrontReceived ?? ''))
  const [backendReceived, setBackendReceived] = useState(String(initial?.backendReceived ?? ''))
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [campaigns, setCampaigns] = useState<Campaign[]>(
    initial?.metaCampaigns?.map(c => ({ name: c.name, spend: String(c.spend), leads: String(c.leads) })) ?? []
  )
  const [deals, setDeals] = useState<Deal[]>(
    initial?.deals?.map(d => ({
      customerName: d.customerName,
      vivintAccountIds: d.vivintAccountIds.join(', '),
      product: d.product ?? '',
      upfrontCommission: String(d.upfrontCommission),
      installDate: d.installDate ? new Date(d.installDate).toISOString().slice(0, 10) : '',
      notes: d.notes ?? '',
    })) ?? []
  )

  function submit() {
    startTransition(async () => {
      await upsertWeek({
        weekStart,
        metaSpend: parseFloat(metaSpend) || 0,
        googleSpend: parseFloat(googleSpend) || 0,
        otherSpend: parseFloat(otherSpend) || 0,
        upfrontReceived: parseFloat(upfrontReceived) || 0,
        backendReceived: parseFloat(backendReceived) || 0,
        notes: notes || undefined,
        metaCampaigns: campaigns.map(c => {
          const spend = parseFloat(c.spend) || 0
          const leads = parseInt(c.leads) || 0
          return { name: c.name, spend, leads, cpl: leads > 0 ? spend / leads : null }
        }),
        deals: deals.map(d => ({
          customerName: d.customerName,
          vivintAccountIds: d.vivintAccountIds.split(',').map(s => s.trim()).filter(Boolean),
          product: d.product || undefined,
          upfrontCommission: parseFloat(d.upfrontCommission) || 0,
          installDate: d.installDate || undefined,
          notes: d.notes || undefined,
        })),
      })
      router.refresh()
      onDone?.()
    })
  }

  const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500'
  const labelClass = 'block text-xs font-semibold text-gray-600 uppercase mb-1'

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>Week Starting (Monday)</label>
        <input type="date" value={weekStart} onChange={e => setWeekStart(e.target.value)} className={inputClass} />
      </div>

      <div>
        <h3 className="font-bold text-slate-900 mb-3">Ad Spend</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Meta ($)</label>
            <input type="number" step="0.01" value={metaSpend} onChange={e => setMetaSpend(e.target.value)} className={inputClass} placeholder="0.00" />
          </div>
          <div>
            <label className={labelClass}>Google ($)</label>
            <input type="number" step="0.01" value={googleSpend} onChange={e => setGoogleSpend(e.target.value)} className={inputClass} placeholder="0.00" />
          </div>
          <div>
            <label className={labelClass}>Other ($)</label>
            <input type="number" step="0.01" value={otherSpend} onChange={e => setOtherSpend(e.target.value)} className={inputClass} placeholder="0.00" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900">Meta Campaign Breakdown (optional)</h3>
          <button onClick={() => setCampaigns([...campaigns, { name: '', spend: '', leads: '' }])} className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
            <Plus size={14} /> Add campaign
          </button>
        </div>
        {campaigns.map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_120px_100px_auto] gap-2 mb-2">
            <input value={c.name} onChange={e => { const next = [...campaigns]; next[i].name = e.target.value; setCampaigns(next) }} placeholder="Campaign name" className={inputClass} />
            <input type="number" step="0.01" value={c.spend} onChange={e => { const next = [...campaigns]; next[i].spend = e.target.value; setCampaigns(next) }} placeholder="Spend $" className={inputClass} />
            <input type="number" value={c.leads} onChange={e => { const next = [...campaigns]; next[i].leads = e.target.value; setCampaigns(next) }} placeholder="Leads" className={inputClass} />
            <button onClick={() => setCampaigns(campaigns.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 px-2">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-bold text-slate-900 mb-3">Commissions Received This Week</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Upfront $ (from Vivint)</label>
            <input type="number" step="0.01" value={upfrontReceived} onChange={e => setUpfrontReceived(e.target.value)} className={inputClass} placeholder="0.00" />
          </div>
          <div>
            <label className={labelClass}>Backend $ (Oct/Jan)</label>
            <input type="number" step="0.01" value={backendReceived} onChange={e => setBackendReceived(e.target.value)} className={inputClass} placeholder="0.00" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900">Closed Deals This Week</h3>
          <button onClick={() => setDeals([...deals, { customerName: '', vivintAccountIds: '', product: '', upfrontCommission: '', installDate: '', notes: '' }])} className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
            <Plus size={14} /> Add deal
          </button>
        </div>
        {deals.map((d, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-3 mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Deal {i + 1}</span>
              <button onClick={() => setDeals(deals.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input value={d.customerName} onChange={e => { const next = [...deals]; next[i].customerName = e.target.value; setDeals(next) }} placeholder="Customer name" className={inputClass} />
              <input value={d.vivintAccountIds} onChange={e => { const next = [...deals]; next[i].vivintAccountIds = e.target.value; setDeals(next) }} placeholder="A-22731400, A-22731872" className={inputClass} />
              <input value={d.product} onChange={e => { const next = [...deals]; next[i].product = e.target.value; setDeals(next) }} placeholder="Product (Vivint Pulse / GM)" className={inputClass} />
              <input type="number" step="0.01" value={d.upfrontCommission} onChange={e => { const next = [...deals]; next[i].upfrontCommission = e.target.value; setDeals(next) }} placeholder="Upfront commission $" className={inputClass} />
              <input type="date" value={d.installDate} onChange={e => { const next = [...deals]; next[i].installDate = e.target.value; setDeals(next) }} className={inputClass} />
              <input value={d.notes} onChange={e => { const next = [...deals]; next[i].notes = e.target.value; setDeals(next) }} placeholder="Notes" className={inputClass} />
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className={inputClass} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        {onDone && <button onClick={onDone} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>}
        <button onClick={submit} disabled={pending} className="px-6 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50">
          {pending ? 'Saving…' : 'Save Week'}
        </button>
      </div>
    </div>
  )
}

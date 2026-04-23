'use client'

import { useState } from 'react'
import { AbTestStatus } from '@prisma/client'
import { updateAbTest } from './actions'

const STATUS_LABELS: Record<AbTestStatus, string> = {
  RUNNING: 'Running',
  WINNER_A: 'Winner: A',
  WINNER_B: 'Winner: B',
  INCONCLUSIVE: 'Inconclusive',
}

const STATUS_COLORS: Record<AbTestStatus, string> = {
  RUNNING: 'bg-blue-100 text-blue-700',
  WINNER_A: 'bg-emerald-100 text-emerald-700',
  WINNER_B: 'bg-emerald-100 text-emerald-700',
  INCONCLUSIVE: 'bg-slate-100 text-slate-600',
}

interface Props {
  test: {
    id: string
    name: string
    hypothesis: string
    variantA: string
    variantB: string
    metric: string
    status: AbTestStatus
    winner: string | null
    result: string | null
    notes: string | null
    startDate: Date
    endDate: Date | null
  }
}

export default function ExperimentRow({ test }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(test.result ?? '')
  const [notes, setNotes] = useState(test.notes ?? '')
  const [status, setStatus] = useState<AbTestStatus>(test.status)

  async function save() {
    setSaving(true)
    await updateAbTest(test.id, {
      status,
      result: result || undefined,
      notes: notes || undefined,
      endDate: status !== 'RUNNING' ? new Date() : undefined,
      winner: status === 'WINNER_A' ? 'A' : status === 'WINNER_B' ? 'B' : undefined,
    })
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900 text-[14px]">{test.name}</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[test.status]}`}>
              {STATUS_LABELS[test.status]}
            </span>
          </div>
          <p className="text-[12px] text-slate-500 mt-0.5">{test.metric} · Started {new Date(test.startDate).toLocaleDateString()}</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-xs text-slate-400 hover:text-slate-700 transition-colors shrink-0">
            Update
          </button>
        )}
      </div>

      <p className="text-[13px] text-slate-600 italic">&ldquo;{test.hypothesis}&rdquo;</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">A — Control</p>
          <p className="text-[13px] text-slate-700">{test.variantA}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">B — Challenger</p>
          <p className="text-[13px] text-slate-700">{test.variantB}</p>
        </div>
      </div>

      {test.result && !editing && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
          <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide mb-1">Result</p>
          <p className="text-[13px] text-slate-700">{test.result}</p>
        </div>
      )}

      {test.notes && !editing && (
        <p className="text-[12px] text-slate-500">{test.notes}</p>
      )}

      {editing && (
        <div className="space-y-3 pt-1 border-t border-slate-100">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as AbTestStatus)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="RUNNING">Running</option>
              <option value="WINNER_A">Winner: A (Control)</option>
              <option value="WINNER_B">Winner: B (Challenger)</option>
              <option value="INCONCLUSIVE">Inconclusive</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Result / Data</label>
            <input value={result} onChange={e => setResult(e.target.value)} placeholder="e.g. B lifted completion 22% (38% → 46%)" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={save} disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

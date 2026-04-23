'use client'

import { useState } from 'react'
import { closeBlockAndStartNew } from './actions'

interface Props {
  blockId: string
}

export default function CloseBlockForm({ blockId }: Props) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [changes, setChanges] = useState([''])

  function addChange() { setChanges(c => [...c, '']) }
  function updateChange(i: number, val: string) {
    setChanges(c => c.map((v, idx) => idx === i ? val : v))
  }
  function removeChange(i: number) {
    setChanges(c => c.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    const validChanges = changes.filter(c => c.trim())
    await closeBlockAndStartNew({
      closeId: blockId,
      optInRate: parseFloat(fd.get('optInRate') as string),
      formStarts: parseInt(fd.get('formStarts') as string),
      generateLeads: parseInt(fd.get('generateLeads') as string),
      newName: fd.get('newName') as string,
      changes: validChanges,
      notes: (fd.get('notes') as string) || undefined,
    })
    setSaving(false)
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
      >
        Record Changes & Start New Block
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
      <h3 className="font-semibold text-slate-900 text-[15px]">Close Current Block & Start New One</h3>

      <div className="space-y-3">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-slate-400">Step 1 — Snapshot current opt-in rate from GA4</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Form Starts</label>
            <input name="formStarts" type="number" required placeholder="97" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Leads (generate_lead)</label>
            <input name="generateLeads" type="number" required placeholder="38" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Opt-in Rate %</label>
            <input name="optInRate" type="number" step="0.1" required placeholder="39.2" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        <p className="text-[11px] text-slate-400">Qual lead % and total lead count will be pulled from the DB automatically.</p>
      </div>

      <div className="space-y-3">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-slate-400">Step 2 — Name the new block</p>
        <input name="newName" required placeholder="e.g. May Optimizations" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-slate-400">Step 3 — What changed?</p>
        {changes.map((val, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={val}
              onChange={e => updateChange(i, e.target.value)}
              placeholder="Describe one change..."
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {changes.length > 1 && (
              <button type="button" onClick={() => removeChange(i)} className="text-slate-400 hover:text-red-500 text-sm px-2 transition-colors">✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addChange} className="text-xs text-emerald-600 hover:text-emerald-800 font-medium transition-colors">+ Add another change</button>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Notes (optional)</label>
        <textarea name="notes" rows={2} placeholder="Context, hypotheses, anything relevant..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
        <button type="submit" disabled={saving} className="bg-slate-900 hover:bg-slate-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          {saving ? 'Saving…' : 'Close Block & Start New'}
        </button>
      </div>
    </form>
  )
}

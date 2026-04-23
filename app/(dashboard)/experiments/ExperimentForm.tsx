'use client'

import { useState } from 'react'
import { createAbTest } from './actions'

export default function ExperimentForm() {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    await createAbTest({
      name: fd.get('name') as string,
      hypothesis: fd.get('hypothesis') as string,
      variantA: fd.get('variantA') as string,
      variantB: fd.get('variantB') as string,
      metric: fd.get('metric') as string,
      notes: (fd.get('notes') as string) || undefined,
    })
    setSaving(false)
    setOpen(false)
    ;(e.target as HTMLFormElement).reset()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
      >
        + Log New Test
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-slate-900 text-[15px]">New A/B Test</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Test Name</label>
          <input name="name" required placeholder="e.g. Credit pill order on Step 2" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Primary Metric</label>
          <input name="metric" required placeholder="e.g. Form completion rate" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Hypothesis</label>
          <input name="hypothesis" required placeholder="e.g. Moving credit score first will reduce drop-off by 20%" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Variant A (Control)</label>
          <input name="variantA" required placeholder="Current behavior" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Variant B (Challenger)</label>
          <input name="variantB" required placeholder="What we're testing" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
          <textarea name="notes" rows={2} placeholder="Context, links, observations..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
        <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          {saving ? 'Saving…' : 'Log Test'}
        </button>
      </div>
    </form>
  )
}

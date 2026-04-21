'use client'

import { useState } from 'react'
import WeekForm from './WeekForm'
import { Plus } from 'lucide-react'

export default function AddWeekToggle() {
  const [open, setOpen] = useState(false)
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700">
        <Plus size={16} /> Log Week
      </button>
    )
  }
  return (
    <div className="border border-emerald-500 rounded-lg p-6 bg-emerald-50/30 mb-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Log Weekly KPIs</h2>
      <WeekForm onDone={() => setOpen(false)} />
    </div>
  )
}

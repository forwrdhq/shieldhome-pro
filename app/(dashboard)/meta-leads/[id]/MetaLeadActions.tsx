'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import Card from '@/components/ui/Card'
import { Save, Loader2 } from 'lucide-react'

interface MetaLeadActionsProps {
  lead: {
    id: string
    status: string
    priority: string
    notes: string | null
  }
}

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'APPOINTMENT_SET', label: 'Appointment Set' },
  { value: 'APPOINTMENT_SAT', label: 'Appointment Sat' },
  { value: 'QUOTED', label: 'Quoted' },
  { value: 'CLOSED_WON', label: 'Closed Won' },
  { value: 'CLOSED_LOST', label: 'Closed Lost' },
  { value: 'NURTURE', label: 'Nurture' },
]

const PRIORITY_OPTIONS = [
  { value: 'HOT', label: 'Hot' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
]

const selectClass =
  'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500'

export default function MetaLeadActions({ lead }: MetaLeadActionsProps) {
  const router = useRouter()
  const { addToast } = useToast()

  const [status, setStatus] = useState(lead.status)
  const [priority, setPriority] = useState(lead.priority)
  const [notes, setNotes] = useState(lead.notes || '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/meta-leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, priority, notes: notes || null }),
      })
      if (!res.ok) throw new Error('Update failed')
      addToast('Lead updated', 'success')
      router.refresh()
    } catch (err: any) {
      addToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Update Lead</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className={selectClass}>
              {PRIORITY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this lead..."
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 resize-none"
        />
      </Card>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}

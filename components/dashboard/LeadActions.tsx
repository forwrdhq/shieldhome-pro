'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { LEAD_STATUS_LABELS, PRIORITY_LABELS } from '@/lib/constants'
import Card from '@/components/ui/Card'
import {
  Phone, PhoneCall, MessageSquare, Calendar, Save, Loader2,
  CheckCircle, UserPlus, StickyNote,
} from 'lucide-react'

interface Rep {
  id: string
  name: string
}

interface LeadActionsProps {
  lead: {
    id: string
    status: string
    priority: string
    notes: string | null
    dispositionNote: string | null
    assignedRepId: string | null
    appointmentDate: string | null
    callsMade: number
    smsSent: number
    firstContactAt: string | null
    speedToContact: number | null
    submittedAt: string
  }
  reps: Rep[]
}

const selectClass =
  'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500'

export default function LeadActions({ lead, reps }: LeadActionsProps) {
  const router = useRouter()
  const { addToast } = useToast()

  const [status, setStatus] = useState(lead.status)
  const [priority, setPriority] = useState(lead.priority)
  const [assignedRepId, setAssignedRepId] = useState(lead.assignedRepId || '')
  const [appointmentDate, setAppointmentDate] = useState(
    lead.appointmentDate ? lead.appointmentDate.slice(0, 16) : ''
  )
  const [notes, setNotes] = useState(lead.notes || '')
  const [saving, setSaving] = useState(false)
  const [quickLoading, setQuickLoading] = useState('')

  async function patchLead(data: Record<string, unknown>, successMsg: string) {
    const res = await fetch(`/api/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Update failed')
    }
    addToast(successMsg, 'success')
    router.refresh()
  }

  async function handleSave() {
    setSaving(true)
    try {
      await patchLead(
        {
          status,
          priority,
          notes: notes || null,
          assignedRepId: assignedRepId || null,
          ...(appointmentDate ? { appointmentDate: new Date(appointmentDate).toISOString() } : {}),
        },
        'Lead updated'
      )
    } catch (err: any) {
      addToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  function formatSpeed(secs: number): string {
    if (secs < 60) return `${secs}s`
    if (secs < 3600) return `${Math.floor(secs / 60)}m ${secs % 60}s`
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    return `${h}h ${m}m`
  }

  async function quickAction(action: string) {
    setQuickLoading(action)
    try {
      if (action === 'called') {
        await patchLead({ callsMade: lead.callsMade + 1 }, 'Call logged')
      } else if (action === 'contacted') {
        setStatus('CONTACTED')
        await patchLead({ status: 'CONTACTED' }, 'Marked as Contacted')
      } else if (action === 'sms') {
        await patchLead({ smsSent: lead.smsSent + 1 }, 'SMS logged')
      }
    } catch (err: any) {
      addToast(err.message, 'error')
    } finally {
      setQuickLoading('')
    }
  }

  return (
    <div className="space-y-4">
      {/* Speed to Contact KPI */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Speed to Contact</p>
            {lead.speedToContact !== null ? (
              <p className={`text-xl font-bold ${lead.speedToContact < 300 ? 'text-green-600' : lead.speedToContact < 900 ? 'text-yellow-600' : 'text-red-600'}`}>
                {formatSpeed(lead.speedToContact)}
              </p>
            ) : (
              <p className="text-xl font-bold text-gray-300">Not yet</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">First Contact</p>
            <p className="text-sm font-medium text-gray-700">
              {lead.firstContactAt ? new Date(lead.firstContactAt).toLocaleString() : '—'}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => quickAction('called')}
            disabled={quickLoading === 'called'}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-center disabled:opacity-50"
          >
            {quickLoading === 'called' ? <Loader2 size={18} className="animate-spin text-emerald-600" /> : <PhoneCall size={18} className="text-emerald-600" />}
            <span className="text-[11px] font-semibold text-gray-700">Log Call</span>
          </button>
          <button
            onClick={() => quickAction('contacted')}
            disabled={quickLoading === 'contacted'}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-center disabled:opacity-50"
          >
            {quickLoading === 'contacted' ? <Loader2 size={18} className="animate-spin text-blue-600" /> : <CheckCircle size={18} className="text-blue-600" />}
            <span className="text-[11px] font-semibold text-gray-700">Contacted</span>
          </button>
          <button
            onClick={() => quickAction('sms')}
            disabled={quickLoading === 'sms'}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-center disabled:opacity-50"
          >
            {quickLoading === 'sms' ? <Loader2 size={18} className="animate-spin text-purple-600" /> : <MessageSquare size={18} className="text-purple-600" />}
            <span className="text-[11px] font-semibold text-gray-700">Log SMS</span>
          </button>
        </div>
      </Card>

      {/* Status & Priority */}
      <Card>
        <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Update Lead</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
              {Object.entries(LEAD_STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className={selectClass}>
              {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Assigned Rep</label>
            <select value={assignedRepId} onChange={(e) => setAssignedRepId(e.target.value)} className={selectClass}>
              <option value="">Unassigned</option>
              {reps.map((rep) => (
                <option key={rep.id} value={rep.id}>{rep.name}</option>
              ))}
            </select>
          </div>

          {(status === 'APPOINTMENT_SET' || appointmentDate) && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Appointment Date</label>
              <input
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className={selectClass}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Notes */}
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

      {/* Save */}
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

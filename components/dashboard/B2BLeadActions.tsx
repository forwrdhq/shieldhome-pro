'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import { B2B_PIPELINE_STAGE_LIST, B2B_STAGE_COLORS } from '@/lib/constants'
import { Flame, Send, Trophy, XCircle, Save } from 'lucide-react'

interface B2BLeadActionsProps {
  leadId: string
  currentStage: string
  currentScore: number | null
  currentDealValue: number | null
  currentNotes: string | null
  currentAssessmentDate: string | null
}

export default function B2BLeadActions({
  leadId,
  currentStage,
  currentScore,
  currentDealValue,
  currentNotes,
  currentAssessmentDate,
}: B2BLeadActionsProps) {
  const router = useRouter()
  const [stage, setStage] = useState(currentStage)
  const [score, setScore] = useState(currentScore?.toString() || '')
  const [dealValue, setDealValue] = useState(currentDealValue?.toString() || '')
  const [notes, setNotes] = useState(currentNotes || '')
  const [assessmentDate, setAssessmentDate] = useState(currentAssessmentDate?.split('T')[0] || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function updateLead(data: Record<string, any>) {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch(`/api/b2b-leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Update failed')
      setMessage('Saved')
      router.refresh()
      setTimeout(() => setMessage(''), 2000)
    } catch {
      setMessage('Error saving')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveAll() {
    const data: Record<string, any> = {}
    if (stage !== currentStage) data.b2bPipelineStage = stage
    if (score && parseInt(score) !== currentScore) data.qualificationScore = parseInt(score)
    if (dealValue && parseFloat(dealValue) !== currentDealValue) data.estimatedDealValue = parseFloat(dealValue)
    if (notes !== (currentNotes || '')) data.notes = notes
    if (assessmentDate !== (currentAssessmentDate?.split('T')[0] || '')) data.assessmentDate = assessmentDate || null
    if (Object.keys(data).length === 0) return
    await updateLead(data)
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#1A1A2E]">Manage Lead</h2>
        {message && (
          <span className={`text-xs font-medium ${message === 'Saved' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </span>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => updateLead({ b2bPipelineStage: 'Qualified', qualificationScore: 8 })}
          className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-xs font-semibold hover:bg-orange-100 transition-colors"
        >
          <Flame size={14} /> Mark as Hot Lead
        </button>
        <button
          onClick={() => updateLead({ b2bPipelineStage: 'Nurture' })}
          className="flex items-center gap-1.5 px-3 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-semibold hover:bg-cyan-100 transition-colors"
        >
          <Send size={14} /> Send to Nurture
        </button>
        <button
          onClick={() => updateLead({ b2bPipelineStage: 'Won' })}
          className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors"
        >
          <Trophy size={14} /> Mark Won
        </button>
        <button
          onClick={() => updateLead({ b2bPipelineStage: 'Lost' })}
          className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
        >
          <XCircle size={14} /> Mark Lost
        </button>
      </div>

      {/* Editable Fields */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Pipeline Stage</label>
          <select
            value={stage}
            onChange={e => setStage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent"
          >
            {B2B_PIPELINE_STAGE_LIST.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Qualification Score (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={score}
            onChange={e => setScore(e.target.value)}
            placeholder="1-10"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Est. Deal Value ($)</label>
          <input
            type="number"
            value={dealValue}
            onChange={e => setDealValue(e.target.value)}
            placeholder="e.g. 5000"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Assessment Date</label>
          <input
            type="date"
            value={assessmentDate}
            onChange={e => setAssessmentDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Add notes about this lead..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent resize-none"
        />
      </div>

      <button
        onClick={handleSaveAll}
        disabled={saving}
        className="flex items-center gap-2 bg-[#1A1A2E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2A2A4E] transition-colors disabled:opacity-50"
      >
        <Save size={14} />
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </Card>
  )
}

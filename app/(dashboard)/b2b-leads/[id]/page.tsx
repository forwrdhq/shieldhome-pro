'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Phone, Mail, Building2, ArrowLeft, Loader2, Save } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface B2BLead {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  businessName: string | null
  businessType: string | null
  numberOfLocations: string | null
  currentProvider: string | null
  biggestConcern: string | null
  b2bPipelineStage: string | null
  estimatedDealValue: number | null
  qualificationScore: number | null
  assessmentDate: string | null
  source: string | null
  notes: string | null
  createdAt: string
  activities?: Array<{ id: string; type: string; description: string; createdAt: string }>
}

const B2B_STAGES = [
  'New Lead', 'Contacted', 'Replied / Engaged', 'Qualified',
  'Assessment Scheduled', 'Assessment Complete', 'Proposal Sent',
  'Negotiation', 'Won', 'Lost',
]

function stageColor(stage: string | null): 'default' | 'info' | 'warning' | 'purple' | 'success' | 'danger' {
  switch (stage) {
    case 'Assessment Scheduled': return 'warning'
    case 'Assessment Complete': return 'purple'
    case 'Proposal Sent': return 'purple'
    case 'Negotiation': return 'warning'
    case 'Qualified': return 'info'
    case 'Won': return 'success'
    case 'Lost': return 'danger'
    default: return 'default'
  }
}

export default function B2BLeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [lead, setLead] = useState<B2BLead | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Editable fields
  const [stage, setStage] = useState('')
  const [score, setScore] = useState('')
  const [dealValue, setDealValue] = useState('')
  const [notes, setNotes] = useState('')
  const [assessmentDate, setAssessmentDate] = useState('')

  useEffect(() => {
    fetch(`/api/b2b-leads/${id}`)
      .then(r => r.json())
      .then(data => {
        setLead(data)
        setStage(data.b2bPipelineStage || 'New Lead')
        setScore(data.qualificationScore?.toString() || '')
        setDealValue(data.estimatedDealValue?.toString() || '')
        setNotes(data.notes || '')
        setAssessmentDate(data.assessmentDate ? data.assessmentDate.slice(0, 10) : '')
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load lead')
        setLoading(false)
      })
  }, [id])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch(`/api/b2b-leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          b2bPipelineStage: stage,
          qualificationScore: score ? parseInt(score) : null,
          estimatedDealValue: dealValue ? parseFloat(dealValue) : null,
          notes: notes || null,
          assessmentDate: assessmentDate || null,
        }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  async function quickAction(action: string) {
    const stageMap: Record<string, string> = {
      hot: 'Qualified',
      nurture: 'New Lead',
      won: 'Won',
      lost: 'Lost',
    }
    const newStage = stageMap[action] || stage
    setStage(newStage)
    await fetch(`/api/b2b-leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ b2bPipelineStage: newStage }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#00C853]" />
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error || 'Lead not found'}</p>
        <Link href="/b2b-leads" className="text-[#00C853] text-sm hover:underline mt-2 inline-block">← Back to B2B Leads</Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/b2b-leads" className="text-gray-400 hover:text-[#1A1A2E] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-[#1A1A2E]">{lead.businessName || lead.fullName}</h1>
            <Badge variant={stageColor(stage)}>{stage}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{lead.fullName} · {lead.businessType || 'B2B Lead'}</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-green-600 text-sm font-medium">Saved ✓</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold bg-[#00C853] disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — main editable fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pipeline controls */}
          <Card>
            <h2 className="font-bold text-[#1A1A2E] mb-4">Pipeline</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Pipeline Stage</label>
                <select
                  value={stage}
                  onChange={e => setStage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] focus:outline-none"
                >
                  {B2B_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Qualification Score (1–10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={score}
                  onChange={e => setScore(e.target.value)}
                  placeholder="—"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Estimated Deal Value ($)</label>
                <input
                  type="number"
                  value={dealValue}
                  onChange={e => setDealValue(e.target.value)}
                  placeholder="e.g. 1200"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Assessment Date</label>
                <input
                  type="date"
                  value={assessmentDate}
                  onChange={e => setAssessmentDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] focus:outline-none"
                />
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card>
            <h2 className="font-bold text-[#1A1A2E] mb-3">Notes</h2>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              placeholder="Add notes about this lead…"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] focus:outline-none"
            />
          </Card>

          {/* Quick actions */}
          <Card>
            <h2 className="font-bold text-[#1A1A2E] mb-3">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => quickAction('hot')} className="px-4 py-2 rounded-xl text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                ✅ Mark as Qualified
              </button>
              <button onClick={() => quickAction('nurture')} className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                📬 Send to Nurture
              </button>
              <button onClick={() => quickAction('won')} className="px-4 py-2 rounded-xl text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                🏆 Mark Won
              </button>
              <button onClick={() => quickAction('lost')} className="px-4 py-2 rounded-xl text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
                ❌ Mark Lost
              </button>
            </div>
          </Card>

          {/* Activity timeline */}
          {lead.activities && lead.activities.length > 0 && (
            <Card>
              <h2 className="font-bold text-[#1A1A2E] mb-4">Activity Timeline</h2>
              <div className="space-y-4">
                {lead.activities.map(a => (
                  <div key={a.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#00C853] mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-800">{a.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(a.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right — info cards */}
        <div className="space-y-4">
          {/* Contact info */}
          <Card padding="sm">
            <h3 className="font-semibold text-[#1A1A2E] text-sm mb-3">Contact Info</h3>
            <div className="space-y-2">
              <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-[#00C853] hover:underline">
                <Phone className="w-4 h-4 flex-shrink-0" />
                {lead.phone}
              </a>
              <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline break-all">
                <Mail className="w-4 h-4 flex-shrink-0" />
                {lead.email}
              </a>
            </div>
          </Card>

          {/* Business info */}
          <Card padding="sm">
            <h3 className="font-semibold text-[#1A1A2E] text-sm mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#00C853]" />
              Business Info
            </h3>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Business', value: lead.businessName },
                { label: 'Type', value: lead.businessType },
                { label: 'Locations', value: lead.numberOfLocations },
                { label: 'Current Provider', value: lead.currentProvider },
                { label: 'Top Concern', value: lead.biggestConcern },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-2">
                  <span className="text-gray-500 min-w-28 text-xs pt-0.5">{row.label}</span>
                  <span className="text-gray-800 font-medium text-xs">{row.value || '—'}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Lead metrics */}
          <Card padding="sm">
            <h3 className="font-semibold text-[#1A1A2E] text-sm mb-3">Lead Metrics</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Source', value: lead.source || 'Direct' },
                { label: 'Created', value: new Date(lead.createdAt).toLocaleDateString() },
                { label: 'Qual Score', value: lead.qualificationScore ? `${lead.qualificationScore}/10` : '—' },
                { label: 'Deal Value', value: lead.estimatedDealValue ? `$${lead.estimatedDealValue.toLocaleString()}` : '—' },
                { label: 'Assessment', value: lead.assessmentDate ? new Date(lead.assessmentDate).toLocaleDateString() : '—' },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-2">
                  <span className="text-gray-500 min-w-28 text-xs pt-0.5">{row.label}</span>
                  <span className="text-gray-800 font-medium text-xs">{row.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

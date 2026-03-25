'use client'

import { formatPhone, timeAgo, getPriorityColor, getStatusColor } from '@/lib/utils'
import { LEAD_STATUS_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

interface LeadCardProps {
  lead: {
    id: string
    fullName: string
    phone: string
    email?: string | null
    source?: string | null
    leadScore: number
    priority: string
    status: string
    submittedAt: string | Date
    zipCode?: string | null
    propertyType?: string | null
    speedToContact?: number | null
  }
  compact?: boolean
}

const sourceColors: Record<string, string> = {
  facebook: 'info',
  google: 'danger',
  organic: 'success',
}

export default function LeadCard({ lead, compact }: LeadCardProps) {
  const priorityColors = getPriorityColor(lead.priority)

  return (
    <Link href={`/leads/${lead.id}`}>
      <div className={`bg-white rounded-xl border-2 ${priorityColors} p-4 hover:shadow-md transition-all cursor-pointer`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-bold text-gray-900 text-sm">{lead.fullName}</p>
            {!compact && (
              <a href={`tel:${lead.phone}`} className="text-xs text-gray-500 flex items-center gap-1 hover:text-emerald-500" onClick={e => e.stopPropagation()}>
                <Phone size={10} /> {formatPhone(lead.phone)}
              </a>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${lead.priority === 'HOT' ? 'bg-red-100 text-red-700' : lead.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
              {lead.priority}
            </span>
            <span className="text-xs font-bold text-gray-700">{lead.leadScore}/100</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {lead.source && (
              <Badge variant={(sourceColors[lead.source] as any) || 'default'} size="sm">
                {lead.source}
              </Badge>
            )}
            <Badge variant="default" size="sm">{LEAD_STATUS_LABELS[lead.status] || lead.status}</Badge>
          </div>
          <span className="text-xs text-gray-400">{timeAgo(lead.submittedAt)}</span>
        </div>
      </div>
    </Link>
  )
}

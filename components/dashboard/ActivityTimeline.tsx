import React from 'react'
import { Mail, MessageSquare, Phone, Calendar, FileText, DollarSign, AlertCircle, User, Activity } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

const TYPE_CONFIG: Record<string, { icon: React.ReactElement; color: string }> = {
  LEAD_CREATED: { icon: <User size={14} />, color: 'bg-gray-100 text-gray-600' },
  STATUS_CHANGE: { icon: <Activity size={14} />, color: 'bg-orange-100 text-orange-600' },
  EMAIL_SENT: { icon: <Mail size={14} />, color: 'bg-blue-100 text-blue-600' },
  SMS_SENT: { icon: <MessageSquare size={14} />, color: 'bg-green-100 text-green-600' },
  CALL_MADE: { icon: <Phone size={14} />, color: 'bg-purple-100 text-purple-600' },
  CALL_RECEIVED: { icon: <Phone size={14} />, color: 'bg-purple-100 text-purple-600' },
  APPOINTMENT_SET: { icon: <Calendar size={14} />, color: 'bg-yellow-100 text-yellow-600' },
  APPOINTMENT_SAT: { icon: <Calendar size={14} />, color: 'bg-green-100 text-green-600' },
  NOTE_ADDED: { icon: <FileText size={14} />, color: 'bg-gray-100 text-gray-600' },
  SALE_CLOSED: { icon: <DollarSign size={14} />, color: 'bg-green-100 text-green-600' },
  NURTURE_EMAIL: { icon: <Mail size={14} />, color: 'bg-blue-100 text-blue-600' },
}

interface Activity {
  id: string
  type: string
  description: string
  createdAt: string | Date
  user?: { name: string } | null
}

export default function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (!activities.length) {
    return <p className="text-gray-500 text-sm text-center py-8">No activity yet</p>
  }

  return (
    <div className="relative space-y-4">
      {activities.map((a, i) => {
        const config = TYPE_CONFIG[a.type] || { icon: <AlertCircle size={14} />, color: 'bg-gray-100 text-gray-600' }
        return (
          <div key={a.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${config.color} flex-shrink-0`}>
                {config.icon}
              </div>
              {i < activities.length - 1 && <div className="w-px h-full bg-gray-200 mt-1 flex-1" />}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm text-gray-800">{a.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">{timeAgo(a.createdAt)}</span>
                {a.user && <span className="text-xs text-gray-500">by {a.user.name}</span>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

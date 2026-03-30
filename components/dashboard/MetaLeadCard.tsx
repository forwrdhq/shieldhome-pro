'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatPhone, timeAgo } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import { Phone, ChevronDown, Target } from 'lucide-react'
import Link from 'next/link'

interface MetaLeadCardProps {
  lead: {
    id: string
    firstName: string
    lastName?: string | null
    phone: string
    email?: string | null
    securityScore: number
    priority: string
    status: string
    urgencyLevel: string
    topConcern?: string | null
    createdAt: string | Date
  }
}

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'APPOINTMENT_SET', 'APPOINTMENT_SAT', 'QUOTED', 'CLOSED_WON', 'CLOSED_LOST', 'NURTURE']

const STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  APPOINTMENT_SET: 'Appt Set',
  APPOINTMENT_SAT: 'Appt Sat',
  QUOTED: 'Quoted',
  CLOSED_WON: 'Closed Won',
  CLOSED_LOST: 'Closed Lost',
  NURTURE: 'Nurture',
}

const CONCERN_SHORT: Record<string, string> = {
  breakins: 'Break-ins',
  package_theft: 'Packages',
  fire_co: 'Fire/CO',
  kids_alone: 'Kids',
  vacation: 'Vacation',
}

export default function MetaLeadCard({ lead }: MetaLeadCardProps) {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [updating, setUpdating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(' ')

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  async function handleStatusChange(newStatus: string) {
    setUpdating(true)
    setShowDropdown(false)
    try {
      await fetch(`/api/meta-leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      router.refresh()
    } catch {
      // silent
    } finally {
      setUpdating(false)
    }
  }

  const priorityBorder = lead.priority === 'HOT' ? 'border-red-300' : lead.priority === 'HIGH' ? 'border-orange-300' : 'border-gray-200'

  return (
    <div className={`bg-white rounded-xl border-2 ${priorityBorder} p-4 hover:shadow-md transition-all`}>
      <Link href={`/meta-leads/${lead.id}`}>
        <div className="flex items-start justify-between mb-2 cursor-pointer">
          <div>
            <p className="font-bold text-gray-900 text-sm">{fullName}</p>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Phone size={10} /> {formatPhone(lead.phone)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${lead.priority === 'HOT' ? 'bg-red-100 text-red-700' : lead.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
              {lead.priority}
            </span>
            <span className="text-xs font-bold text-gray-700 flex items-center gap-0.5">
              <Target size={10} /> {lead.securityScore}/100
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 items-center flex-wrap">
          <Badge variant="info" size="sm">Meta</Badge>
          {lead.topConcern && (
            <Badge variant="default" size="sm">{CONCERN_SHORT[lead.topConcern] || lead.topConcern}</Badge>
          )}
          {/* Clickable status badge */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => { e.preventDefault(); setShowDropdown(!showDropdown) }}
              className="flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition-colors"
              disabled={updating}
            >
              {updating ? '...' : STATUS_LABELS[lead.status] || lead.status}
              <ChevronDown size={10} />
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[140px]">
                {STATUS_OPTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`block w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors ${s === lead.status ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'}`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-400">{timeAgo(lead.createdAt)}</span>
      </div>
    </div>
  )
}

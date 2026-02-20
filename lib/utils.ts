import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 11) {
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return phone
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function formatSpeedToContact(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  if (minutes < 60) return `${minutes}m ${remaining}s`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m`
}

export function getSpeedColor(seconds: number): string {
  if (seconds < 300) return 'text-green-600'
  if (seconds < 900) return 'text-yellow-600'
  return 'text-red-600'
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'HOT': return 'text-red-600 bg-red-50 border-red-200'
    case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'MEDIUM': return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'LOW': return 'text-gray-600 bg-gray-50 border-gray-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'NEW': return 'text-blue-700 bg-blue-100'
    case 'CONTACTED': return 'text-purple-700 bg-purple-100'
    case 'APPOINTMENT_SET': return 'text-yellow-700 bg-yellow-100'
    case 'APPOINTMENT_SAT': return 'text-orange-700 bg-orange-100'
    case 'QUOTED': return 'text-indigo-700 bg-indigo-100'
    case 'CLOSED_WON': return 'text-green-700 bg-green-100'
    case 'CLOSED_LOST': return 'text-red-700 bg-red-100'
    case 'NO_ANSWER': return 'text-gray-700 bg-gray-100'
    case 'NOT_QUALIFIED': return 'text-red-700 bg-red-100'
    case 'CANCELLED': return 'text-gray-700 bg-gray-100'
    default: return 'text-gray-700 bg-gray-100'
  }
}

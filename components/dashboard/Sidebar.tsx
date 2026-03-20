'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Building2, BarChart2, DollarSign, Settings, Shield, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/b2b-leads', label: 'B2B Leads', icon: Building2, badge: true },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/commissions', label: 'Commissions', icon: DollarSign },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [b2bNewCount, setB2bNewCount] = useState(0)

  useEffect(() => {
    fetch('/api/b2b-leads?stage=New+Lead&limit=1')
      .then(r => r.json())
      .then(data => setB2bNewCount(data.pagination?.total || 0))
      .catch(() => {})
  }, [])

  return (
    <aside className="w-64 bg-[#1A1A2E] min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Shield className="text-[#00C853]" size={28} />
          <div>
            <div className="font-bold text-white text-lg leading-none">ShieldHome Pro</div>
            <div className="text-xs text-gray-400">CRM Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-[#00C853] text-white'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon size={18} />
              {label}
              {badge && b2bNewCount > 0 && (
                <span className="ml-auto text-[10px] bg-orange-500 text-white rounded-full px-1.5 py-0.5 font-bold leading-none">
                  {b2bNewCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

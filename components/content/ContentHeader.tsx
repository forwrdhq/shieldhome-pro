'use client'

import { useState } from 'react'
import { Shield, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COMPANY_NAME } from '@/lib/constants'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Compare Systems', href: '/compare/best-home-security-systems' },
]

export default function ContentHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <Shield size={28} className="text-[#00C853]" />
            <span className="text-lg font-extrabold text-[#1A1A2E]">
              {COMPANY_NAME}
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#1A1A2E] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/home-security-quiz"
              className="inline-flex items-center px-5 py-2.5 bg-[#00C853] text-white text-sm font-bold rounded-lg hover:bg-[#00A846] transition-colors"
            >
              Get Free Quote
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 -mr-2 text-gray-600 hover:text-[#1A1A2E] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#1A1A2E] hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <a
                href="/home-security-quiz"
                className="block text-center px-5 py-3 bg-[#00C853] text-white text-sm font-bold rounded-lg hover:bg-[#00A846] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Get Free Quote
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

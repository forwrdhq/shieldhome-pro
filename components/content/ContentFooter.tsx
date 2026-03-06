import { Shield, Phone } from 'lucide-react'
import { COMPANY_NAME, PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

const FOOTER_LINKS = {
  'Security Resources': [
    { label: 'Blog', href: '/blog' },
    { label: 'System Comparisons', href: '/compare/best-home-security-systems' },
    { label: 'Home Security Quiz', href: '/home-security-quiz' },
    { label: 'Crime Statistics', href: '/blog/home-burglary-statistics' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Do Not Sell My Info', href: '/do-not-sell' },
  ],
}

export default function ContentFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#1A1A2E] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <Shield size={24} className="text-[#00C853]" />
              <span className="text-lg font-extrabold text-white">
                {COMPANY_NAME}
              </span>
            </a>
            <p className="text-sm leading-relaxed mb-4 max-w-xs">
              Your trusted resource for home security information, expert
              comparisons, and personalized security solutions.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-white font-semibold text-sm mb-4">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${PHONE_NUMBER_RAW}`}
                  className="inline-flex items-center gap-2 text-sm hover:text-white transition-colors"
                >
                  <Phone size={14} className="text-[#00C853] flex-shrink-0" />
                  {PHONE_NUMBER}
                </a>
              </li>
              <li className="text-sm">
                Available 7 days a week
                <br />
                8am - 10pm ET
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>
              &copy; {year} {COMPANY_NAME}. All rights reserved.
            </p>
            <p>
              {COMPANY_NAME} is an authorized Vivint Smart Home dealer.
              Individual dealer. Not affiliated with Vivint corporate.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

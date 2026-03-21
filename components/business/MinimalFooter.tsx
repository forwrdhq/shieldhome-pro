const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER || '(877) 555-0199'
const PHONE_RAW = process.env.NEXT_PUBLIC_PHONE_NUMBER_RAW || '+18775550199'

export default function MinimalFooter() {
  return (
    <footer className="py-8" style={{ background: '#1A1A2E' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-white font-semibold text-sm mb-3">
          ShieldHome.pro — Authorized Vivint Commercial Security Dealer
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm mb-4">
          <a href={`tel:${PHONE_RAW}`} className="text-gray-400 hover:text-white transition-colors">
            {PHONE}
          </a>
          <a href="mailto:quotes@shieldhomepro.com" className="text-gray-400 hover:text-white transition-colors">
            quotes@shieldhomepro.com
          </a>
          <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed max-w-2xl mx-auto">
          © 2025 ShieldHome.pro. All rights reserved. ShieldHome is an independent authorized dealer for Vivint Smart Home and is not affiliated with Vivint, Inc.
        </p>
      </div>
    </footer>
  )
}

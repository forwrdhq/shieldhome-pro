import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

export default function MinimalFooter() {
  return (
    <footer className="bg-[#1A1A2E] py-8 text-center text-sm px-4">
      <p className="text-gray-300 mb-3 font-medium">
        ShieldHome.pro &mdash; Authorized Vivint Commercial Security Dealer
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 text-gray-400 mb-4">
        <a href={`tel:${PHONE_NUMBER_RAW}`} className="hover:text-white transition-colors">
          {PHONE_NUMBER}
        </a>
        <span className="text-gray-600">|</span>
        <a href="mailto:business@shieldhomepro.com" className="hover:text-white transition-colors">
          business@shieldhomepro.com
        </a>
        <span className="text-gray-600">|</span>
        <a href="/privacy" className="hover:text-white transition-colors">
          Privacy Policy
        </a>
        <span className="text-gray-600">|</span>
        <a href="/terms" className="hover:text-white transition-colors">
          Terms of Service
        </a>
      </div>
      <p className="text-gray-500 text-xs max-w-lg mx-auto">
        &copy; {new Date().getFullYear()} ShieldHome.pro. All rights reserved. ShieldHome is an independent authorized dealer for Vivint Smart Home and is not affiliated with Vivint, Inc.
      </p>
    </footer>
  )
}

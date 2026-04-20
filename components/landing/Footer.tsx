import { PHONE_NUMBER, PHONE_NUMBER_RAW, COMPANY_ADDRESS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-500 py-16 pb-28 md:pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-heading font-bold text-white text-lg tracking-tight block mb-3">
              ShieldHome
            </span>
            <p className="text-body-sm text-slate-500 leading-relaxed max-w-xs">
              Authorized Vivint Smart Home Dealer. Free quotes, $0 down, expert setup.
            </p>
            <a
              href={`tel:${PHONE_NUMBER_RAW}`}
              className="text-brass-300 hover:text-brass-400 text-sm font-semibold mt-3 inline-block transition-colors duration-150"
            >
              {PHONE_NUMBER}
            </a>
            {COMPANY_ADDRESS ? (
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">{COMPANY_ADDRESS}</p>
            ) : null}
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-overline text-slate-400 mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><a href="/blog" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150">Blog</a></li>
              <li><a href="/compare/best-home-security-systems" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150">Best Systems 2026</a></li>
              <li><a href="/home-security" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150">Security by State</a></li>
              <li><a href="/home-security-statistics" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150">Security Statistics</a></li>
            </ul>
          </div>

          {/* Compare */}
          <div>
            <h4 className="text-overline text-slate-400 mb-4">Compare</h4>
            <ul className="space-y-2.5">
              <li><a href="/compare/vivint-vs-adt" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150">Vivint vs ADT</a></li>
              <li><a href="/compare/vivint-vs-simplisafe" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150">Vivint vs SimpliSafe</a></li>
              <li><a href="/compare/vivint-vs-ring" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150">Vivint vs Ring</a></li>
              <li><a href="/compare" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150">All Comparisons</a></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-overline text-slate-400 mb-4">Tools</h4>
            <ul className="space-y-2.5">
              <li><a href="/home-security-quiz" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150">Security Quiz</a></li>
              <li><a href="/home-security-cost-calculator" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150">Cost Calculator</a></li>
              <li><a href="/blog/how-much-does-vivint-cost" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150">Vivint Pricing Guide</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 text-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a href="/privacy" className="text-slate-500 hover:text-slate-300 transition-colors duration-150">Privacy Policy</a>
            <a href="/terms" className="text-slate-500 hover:text-slate-300 transition-colors duration-150">Terms of Service</a>
            <a href="/do-not-sell" className="text-slate-500 hover:text-slate-300 transition-colors duration-150">Do Not Sell My Info</a>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl mx-auto">
            ShieldHome Pro is an independently operated authorized dealer of Vivint Smart Home products and services.
            Vivint® is a registered trademark of Vivint Smart Home, Inc.
          </p>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} ShieldHome Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

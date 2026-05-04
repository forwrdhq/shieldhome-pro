export default function TrustBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-sm text-white h-9 flex items-center justify-center px-4">
      {/* Mobile — single strongest proof point */}
      <p className="md:hidden text-[11px] font-body text-slate-400 text-center tracking-[0.03em]">
        <span className="text-amber-400">&#9733;</span>{' '}
        4.8/5 from 58,000+ Reviews &middot; Smart Home Security Specialists
      </p>

      {/* Desktop — varied proof points, not repeated elsewhere verbatim */}
      <div className="hidden md:flex items-center gap-0 text-[11px] font-body text-slate-400 tracking-[0.03em]">
        <span className="flex items-center gap-1">
          <span className="text-amber-400">&#9733;</span>
          4.8/5 &middot; 58,000+ Verified Reviews
        </span>
        <span className="mx-3 text-slate-700/60">|</span>
        <span>Smart Home Security Specialists</span>
        <span className="mx-3 text-slate-700/60">|</span>
        <span>BBB A+ Rated</span>
        <span className="mx-3 text-slate-700/60">|</span>
        <span>SafeHome.org Best of 2025</span>
      </div>
    </div>
  )
}

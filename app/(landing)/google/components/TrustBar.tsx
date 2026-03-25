export default function TrustBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950 text-white h-9 flex items-center justify-center px-4">
      {/* Mobile */}
      <p className="md:hidden text-[11px] font-body text-slate-300 text-center tracking-wide">
        <span className="text-amber-400">&#9733;</span>{' '}
        4.8/5 from 58,000+ Reviews &middot; Vivint Authorized Dealer
      </p>

      {/* Desktop */}
      <p className="hidden md:flex items-center gap-0 text-[11px] font-body text-slate-400 text-center tracking-wide">
        <span className="text-amber-400 mr-1.5">&#9733;</span>
        4.8/5 from 58,000+ Reviews
        <span className="mx-3 text-slate-700">—</span>
        Vivint Authorized Dealer
        <span className="mx-3 text-slate-700">—</span>
        BBB A+ Rated
        <span className="mx-3 text-slate-700">—</span>
        2M+ Homes Protected
      </p>
    </div>
  )
}

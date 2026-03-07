import { Star, Shield, Award, CheckCircle } from 'lucide-react'

export default function SocialProof() {
  return (
    <section className="bg-[#1A1A2E] py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop: horizontal row */}
        <div className="hidden sm:flex flex-wrap items-center justify-center gap-6 md:gap-10 text-white">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={16} className={i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400 fill-yellow-400 opacity-80'} />
              ))}
            </div>
            <span className="text-sm font-semibold">4.8/5 from 58,000+ reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={18} className="text-[#00C853]" />
            <span className="text-sm font-semibold">SafeHome.org #1 Rated</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-[#00C853]" />
            <span className="text-sm font-semibold">2M+ Homes Protected</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-[#00C853]" />
            <span className="text-sm font-semibold">BBB A+ Accredited</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-[#00C853]" />
            <span className="text-sm font-semibold">Free Professional Installation</span>
          </div>
        </div>

        {/* Mobile: clean 2x2 grid with star rating on top */}
        <div className="sm:hidden text-white space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={14} className={i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400 fill-yellow-400 opacity-80'} />
              ))}
            </div>
            <span className="text-xs font-semibold">4.8/5 from 58,000+ reviews</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="flex items-center justify-center gap-1.5 bg-white/5 rounded-lg py-2">
              <Award size={14} className="text-[#00C853]" />
              <span className="text-xs font-semibold">#1 Rated</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 bg-white/5 rounded-lg py-2">
              <Shield size={14} className="text-[#00C853]" />
              <span className="text-xs font-semibold">2M+ Homes</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 bg-white/5 rounded-lg py-2">
              <CheckCircle size={14} className="text-[#00C853]" />
              <span className="text-xs font-semibold">BBB A+</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 bg-white/5 rounded-lg py-2">
              <CheckCircle size={14} className="text-[#00C853]" />
              <span className="text-xs font-semibold">Free Setup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

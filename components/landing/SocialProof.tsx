import { Star, Shield, Award, CheckCircle } from 'lucide-react'

export default function SocialProof() {
  return (
    <section className="bg-[#1A1A2E] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-white">
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
      </div>
    </section>
  )
}

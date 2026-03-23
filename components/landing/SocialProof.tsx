import { Star } from 'lucide-react'

export default function SocialProof() {
  return (
    <section className="bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500 font-body">
          <span className="flex items-center gap-1.5">
            <span className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} className="text-amber-500 fill-amber-500" />
              ))}
            </span>
            <span className="font-medium">4.8/5 &middot; 58,000+ reviews</span>
          </span>
          <span>&middot;</span>
          <span>BBB A+ Accredited</span>
          <span className="hidden sm:inline">&middot;</span>
          <span className="hidden sm:inline">2M+ Homes Protected</span>
          <span className="hidden sm:inline">&middot;</span>
          <span className="hidden sm:inline">Free Professional Installation</span>
        </div>
      </div>
    </section>
  )
}

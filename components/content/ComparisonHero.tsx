import { Star, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Competitor {
  name: string
  rating: number
}

interface ComparisonHeroProps {
  title: string
  subtitle: string
  competitors: Competitor[]
}

function renderStars(rating: number) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.3

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={cn(
            i < full
              ? 'text-yellow-400 fill-yellow-400'
              : i === full && hasHalf
                ? 'text-yellow-400 fill-yellow-400 opacity-60'
                : 'text-gray-600'
          )}
        />
      ))}
    </div>
  )
}

export default function ComparisonHero({
  title,
  subtitle,
  competitors,
}: ComparisonHeroProps) {
  return (
    <section className="relative bg-slate-900 overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-emerald-600 opacity-5 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-56 h-56 rounded-full bg-emerald-600 opacity-5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full">
            <Shield size={14} className="text-emerald-500" />
            <span className="text-emerald-500 text-xs font-bold tracking-widest uppercase">
              Expert Comparison
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white text-center leading-tight mb-4 max-w-4xl mx-auto">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-400 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>

        {/* Competitors row */}
        {competitors.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {competitors.map((competitor, index) => (
              <div key={competitor.name} className="flex items-center gap-3 sm:gap-4">
                {/* Competitor card */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 text-center min-w-[140px]">
                  <h3 className="text-white font-bold text-sm sm:text-base mb-1">
                    {competitor.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5">
                    {renderStars(competitor.rating)}
                    <span className="text-gray-400 text-xs font-medium ml-1">
                      {competitor.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* VS divider (not after last) */}
                {index < competitors.length - 1 && (
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                    <span className="text-white font-extrabold text-xs">VS</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

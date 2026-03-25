'use client'

/* Award badges as styled text blocks — no external logos needed */
const awards = [
  { source: 'SafeHome.org', award: 'Best Home Security Company', year: '2025' },
  { source: 'PCMag', award: 'Best Smart Home Security Systems', year: '2026' },
  { source: 'CNET', award: 'Best Professionally Installed', year: '2026' },
  { source: 'Nerdwallet', award: 'Best Buildable Security System', year: '2025' },
  { source: 'Energy Star', award: 'Certified Partner', year: '2026' },
  { source: 'PCWorld', award: 'Editor\'s Choice Security', year: '2025' },
]

function AwardBadge({ source, award, year }: typeof awards[0]) {
  return (
    <div className="flex items-center gap-3 flex-shrink-0 px-6 md:px-8">
      <div className="flex flex-col items-center text-center">
        <p className="font-heading font-bold text-[13px] md:text-[14px] text-slate-400 tracking-[-0.01em] whitespace-nowrap">
          {source}
        </p>
        <p className="text-[10px] md:text-[11px] font-body text-slate-500 whitespace-nowrap leading-tight">
          {award} {year}
        </p>
      </div>
      {/* Divider dot */}
      <div className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0" />
    </div>
  )
}

export default function AwardsMarquee() {
  // Double the items for seamless loop
  const doubledAwards = [...awards, ...awards]

  return (
    <section className="py-8 md:py-10 bg-slate-950 overflow-hidden border-y border-slate-800/50">
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        {/* Marquee track */}
        <div className="flex items-center marquee-track">
          {doubledAwards.map((award, i) => (
            <AwardBadge key={`${award.source}-${i}`} {...award} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee 35s linear infinite;
          width: max-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

'use client'

const items = [
  '🏪 Retail Stores',
  '🏢 Office Buildings',
  '🏭 Warehouses',
  '🍽️ Restaurants',
  '🏘️ Property Managers',
  '⚕️ Medical Offices',
  '🏋️ Gyms & Fitness',
  '🚗 Auto Dealerships',
  '🏨 Hotels & Hospitality',
  '📦 Distribution Centers',
]

export default function SocialProofTicker() {
  const doubled = [...items, ...items]

  return (
    <div className="bg-slate-950 border-y border-slate-800 py-3.5 overflow-hidden">
      <div className="flex gap-0 animate-ticker hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex-shrink-0 flex items-center gap-2 text-[12px] md:text-[13px] font-body text-slate-400 px-6"
          >
            {item}
            <span className="text-slate-700 ml-4">·</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  )
}

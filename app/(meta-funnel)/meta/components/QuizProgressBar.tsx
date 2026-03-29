'use client'

interface QuizProgressBarProps {
  current: number
  total: number
}

export default function QuizProgressBar({ current, total }: QuizProgressBarProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-heading font-semibold uppercase tracking-[0.1em] text-slate-400">
          Question {current} of {total}
        </span>
        <span className="text-[11px] font-heading font-semibold text-emerald-500">{percentage}%</span>
      </div>
      <div className="w-full h-[3px] bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </div>
    </div>
  )
}

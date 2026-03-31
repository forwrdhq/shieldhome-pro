'use client'

import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal'

const HIDDEN_COSTS = [
  {
    title: 'Equipment "rental" fees',
    description:
      'Some providers charge $5\u2013$15/mo on top of monitoring for equipment you never own.',
    ours: '$0 equipment cost.',
  },
  {
    title: 'Installation fees',
    description:
      'ADT charges $99\u2013$199 for installation. SimpliSafe is DIY-only.',
    ours: 'Free professional installation.',
  },
  {
    title: 'Early termination penalties',
    description:
      'Locked into a 36\u201360 month contract with $500\u2013$1,400 cancellation fees.',
    ours: 'Flexible terms, plus we\u2019ll buy out your existing contract up to $1,000.',
  },
  {
    title: 'Camera storage fees',
    description:
      'Many \u201Caffordable\u201D systems charge $3\u2013$10/mo per camera for cloud storage.',
    ours: 'Included.',
  },
  {
    title: 'Rate increases',
    description: 'Some providers raise your rate after year 1.',
    ours: 'Locked-in pricing.',
  },
]

function WarningIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <path
        d="M8.572 3.808c.636-1.12 2.22-1.12 2.856 0l5.64 9.92C17.7 14.84 16.916 16 15.64 16H4.36c-1.276 0-2.06-1.16-1.428-2.272l5.64-9.92Z"
        fill="#F59E0B"
      />
      <path
        d="M10 7v3"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="12.5" r="0.75" fill="#fff" />
    </svg>
  )
}

export default function HiddenCosts() {
  const headingRef = useScrollReveal<HTMLDivElement>()
  const listRef = useStaggerReveal<HTMLDivElement>(100)

  return (
    <section className="py-14 md:py-32 bg-slate-50">
      <div className="mx-auto max-w-3xl px-5">
        {/* Header */}
        <div ref={headingRef} className="mb-10 md:mb-14">
          <p
            className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-3"
            style={{ color: 'var(--color-brass-400)' }}
          >
            Buyer Beware
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900 mb-3">
            Hidden Costs Other Companies Don&rsquo;t Tell You
          </h2>
          <p className="text-slate-500 text-[15px] md:text-base leading-relaxed">
            Before you sign up anywhere, watch for these common charges.
          </p>
        </div>

        {/* Cost items */}
        <div ref={listRef} className="space-y-3 md:space-y-4">
          {HIDDEN_COSTS.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-5 md:p-6 border border-slate-100"
            >
              <div className="flex items-start gap-3">
                <WarningIcon />
                <div>
                  <p className="font-heading font-bold text-slate-900 text-[15px] md:text-base leading-snug mb-1">
                    {item.title}
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.description}{' '}
                    <span className="text-emerald-600 font-medium">
                      (Ours: {item.ours})
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

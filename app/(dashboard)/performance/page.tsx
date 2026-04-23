import { prisma } from '@/lib/db'
import { ChangeBlock } from '@prisma/client'
import CloseBlockForm from './CloseBlockForm'
import { TrendingUp, TrendingDown, Minus, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

function duration(start: Date, end: Date | null) {
  const ms = (end ?? new Date()).getTime() - start.getTime()
  const days = Math.floor(ms / 86400000)
  return days === 0 ? 'less than 1 day' : days === 1 ? '1 day' : `${days} days`
}

function fmt(n: number | null | undefined, suffix = '%') {
  if (n == null) return '—'
  return `${n.toFixed(1)}${suffix}`
}

function Delta({ current, prev, suffix = '%' }: { current: number | null | undefined; prev: number | null | undefined; suffix?: string }) {
  if (current == null || prev == null) return <span className="text-slate-400 text-[12px]">—</span>
  const diff = current - prev
  const abs = Math.abs(diff).toFixed(1)
  if (Math.abs(diff) < 0.1) return <span className="flex items-center gap-1 text-slate-400 text-[12px]"><Minus size={12} /> 0{suffix}</span>
  if (diff > 0) return <span className="flex items-center gap-1 text-emerald-600 text-[12px] font-semibold"><TrendingUp size={12} /> +{abs}{suffix}</span>
  return <span className="flex items-center gap-1 text-red-500 text-[12px] font-semibold"><TrendingDown size={12} /> -{abs}{suffix}</span>
}

interface EnrichedBlock extends ChangeBlock {
  liveLeadCount?: number
  liveQualCount?: number
  liveQualRate?: number
}

export default async function PerformancePage() {
  const blocks = await prisma.changeBlock.findMany({ orderBy: { startDate: 'asc' } })

  const activeBlock = blocks.find(b => !b.endDate) ?? null

  let enrichedActive: EnrichedBlock | null = null
  if (activeBlock) {
    const liveLeadCount = await prisma.lead.count({
      where: { createdAt: { gte: activeBlock.startDate } },
    })
    const liveQualCount = await prisma.lead.count({
      where: { createdAt: { gte: activeBlock.startDate }, creditScoreRange: 'ABOVE_650' },
    })
    const liveQualRate = liveLeadCount > 0 ? (liveQualCount / liveLeadCount) * 100 : 0
    enrichedActive = { ...activeBlock, liveLeadCount, liveQualCount, liveQualRate }
  }

  const allBlocks: EnrichedBlock[] = blocks.map(b =>
    b.id === activeBlock?.id && enrichedActive ? enrichedActive : b
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Performance Blocks</h1>
          <p className="text-sm text-slate-500 mt-0.5">KPI snapshots tied to site changes — see what moved and why.</p>
        </div>
        {activeBlock && <CloseBlockForm blockId={activeBlock.id} />}
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[11px] top-4 bottom-4 w-px bg-slate-200" />

        <div className="space-y-6">
          {allBlocks.map((block, i) => {
            const prev = i > 0 ? allBlocks[i - 1] : null
            const isActive = !block.endDate
            const optIn = isActive ? block.optInRate : block.optInRate
            const qualR = isActive ? block.liveQualRate : block.qualRate
            const leads = isActive ? block.liveLeadCount : block.leadCount
            const qualLeads = isActive ? block.liveQualCount : block.qualLeadCount
            const prevOptIn = prev?.optInRate
            const prevQualR = prev ? (prev.endDate ? prev.qualRate : prev.liveQualRate) : null

            return (
              <div key={block.id} className="flex gap-4">
                {/* Dot */}
                <div className="relative z-10 mt-4 shrink-0">
                  <div className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                    isActive ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'
                  )}>
                    {isActive && <Circle size={8} className="text-white fill-white" />}
                  </div>
                </div>

                <div className={cn(
                  'flex-1 rounded-xl border p-5 space-y-4',
                  isActive ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white'
                )}>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-slate-900 text-[15px]">{block.name}</h2>
                        {isActive && (
                          <span className="text-[10px] font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Active</span>
                        )}
                      </div>
                      <p className="text-[12px] text-slate-400 mt-0.5">
                        {block.startDate.toLocaleDateString()} – {block.endDate ? block.endDate.toLocaleDateString() : 'present'} · {duration(block.startDate, block.endDate)}
                      </p>
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white rounded-lg border border-slate-100 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Opt-in Rate</p>
                      <p className="text-[20px] font-bold text-slate-900">{fmt(optIn)}</p>
                      <Delta current={optIn} prev={prevOptIn} />
                    </div>
                    <div className="bg-white rounded-lg border border-slate-100 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Qualified Rate</p>
                      <p className="text-[20px] font-bold text-slate-900">{fmt(qualR)}</p>
                      <Delta current={qualR} prev={prevQualR} />
                    </div>
                    <div className="bg-white rounded-lg border border-slate-100 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Total Leads</p>
                      <p className="text-[20px] font-bold text-slate-900">{leads ?? '—'}</p>
                      {isActive && <span className="text-[11px] text-emerald-600">live</span>}
                    </div>
                    <div className="bg-white rounded-lg border border-slate-100 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Qual Leads</p>
                      <p className="text-[20px] font-bold text-slate-900">{qualLeads ?? '—'}</p>
                      {isActive && <span className="text-[11px] text-emerald-600">live</span>}
                    </div>
                  </div>

                  {/* Opt-in note for active */}
                  {isActive && !block.optInRate && (
                    <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      Opt-in rate not yet recorded — check GA4 (form_start → generate_lead) and close this block when ready.
                    </p>
                  )}

                  {/* Changes */}
                  {block.changes.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Changes in this block</p>
                      <ul className="space-y-1">
                        {block.changes.map((c, ci) => (
                          <li key={ci} className="flex items-start gap-2 text-[13px] text-slate-600">
                            <span className="text-emerald-500 mt-0.5 shrink-0">→</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {block.notes && (
                    <p className="text-[12px] text-slate-500 italic">{block.notes}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

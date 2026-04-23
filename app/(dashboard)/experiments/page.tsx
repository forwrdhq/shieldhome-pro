import { prisma } from '@/lib/db'
import ExperimentForm from './ExperimentForm'
import ExperimentRow from './ExperimentRow'

export const dynamic = 'force-dynamic'

export default async function ExperimentsPage() {
  const tests = await prisma.abTest.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const running = tests.filter(t => t.status === 'RUNNING')
  const completed = tests.filter(t => t.status !== 'RUNNING')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">A/B Experiments</h1>
          <p className="text-sm text-slate-500 mt-0.5">{running.length} running · {completed.length} completed</p>
        </div>
        <ExperimentForm />
      </div>

      {running.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[12px] font-semibold uppercase tracking-widest text-slate-400">Active</h2>
          {running.map(t => <ExperimentRow key={t.id} test={t} />)}
        </section>
      )}

      {completed.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[12px] font-semibold uppercase tracking-widest text-slate-400">Completed</h2>
          {completed.map(t => <ExperimentRow key={t.id} test={t} />)}
        </section>
      )}

      {tests.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p className="text-[15px]">No experiments yet.</p>
          <p className="text-[13px] mt-1">Log your first A/B test above.</p>
        </div>
      )}
    </div>
  )
}

'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const STAGE_COLORS: Record<string, string> = {
  'New Lead': '#9CA3AF',
  'Qualified': '#3B82F6',
  'Assessment Scheduled': '#F97316',
  'Assessment Complete': '#EAB308',
  'Proposal Sent': '#8B5CF6',
  'Negotiation': '#6366F1',
  'Won': '#22C55E',
  'Lost': '#EF4444',
  'Not Qualified': '#DC2626',
  'Nurture': '#06B6D4',
}

interface FunnelData {
  stage: string
  count: number
}

export default function B2BPipelineFunnel({ data }: { data: FunnelData[] }) {
  const hasData = data.some(d => d.count > 0)

  if (!hasData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">No B2B leads in pipeline yet</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 120 }}>
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
        <YAxis
          type="category"
          dataKey="stage"
          tick={{ fontSize: 11, fill: '#374151' }}
          width={115}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
          formatter={(value: number) => [`${value} leads`, 'Count']}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
          {data.map((entry) => (
            <Cell key={entry.stage} fill={STAGE_COLORS[entry.stage] || '#9CA3AF'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

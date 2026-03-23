import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

interface StatCard {
  title: string
  value: string | number
  trend?: number
  suffix?: string
  prefix?: string
  color?: string
}

interface StatsCardsProps {
  stats: StatCard[]
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map(stat => (
        <Card key={stat.title} padding="sm">
          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">{stat.title}</p>
          <p className="text-2xl font-bold text-slate-900">
            {stat.prefix}{typeof stat.value === 'number' && stat.prefix === '$'
              ? formatCurrency(stat.value).replace('$', '')
              : stat.value}
            {stat.suffix}
          </p>
          {stat.trend !== undefined && (
            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${stat.trend > 0 ? 'text-green-600' : stat.trend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {stat.trend > 0 ? <TrendingUp size={12} /> : stat.trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
              {stat.trend > 0 ? '+' : ''}{stat.trend}% vs yesterday
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}

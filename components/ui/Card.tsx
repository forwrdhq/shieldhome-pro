import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export default function Card({ children, className, padding = 'md' }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div className={cn('bg-white rounded-lg shadow-xs border border-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hover', paddings[padding], className)}>
      {children}
    </div>
  )
}

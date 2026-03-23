import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'brass'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-heading font-semibold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)] active:translate-y-0 active:shadow-none',
      secondary: 'border-[1.5px] border-slate-300 text-slate-900 hover:border-slate-900 hover:text-slate-900 hover:-translate-y-0.5',
      outline: 'border-[1.5px] border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:-translate-y-0.5',
      ghost: 'text-slate-700 hover:bg-slate-100',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      brass: 'border-[1.5px] border-brass-300 text-brass-300 hover:bg-brass-300/10 hover:-translate-y-0.5',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm h-8',
      md: 'px-4 py-2 text-[15px] h-10',
      lg: 'px-6 py-3 text-[15px] h-12',
      xl: 'px-8 py-4 text-lg h-14',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button

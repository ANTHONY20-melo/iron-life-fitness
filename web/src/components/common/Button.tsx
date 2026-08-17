import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20',
  secondary: 'bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#2a2a2a]',
  outline: 'border border-[#2a2a2a] text-white hover:bg-[#1a1a1a] hover:border-[#3a3a3a]',
  ghost: 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]',
  danger: 'bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  )
}

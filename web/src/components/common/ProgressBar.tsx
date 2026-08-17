import clsx from 'clsx'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}

const barColors = {
  primary: 'bg-primary',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
}

const barSizes = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  color = 'primary',
  className,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0

  return (
    <div className={clsx('space-y-1.5', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showPercentage && <span className="text-sm font-medium text-white">{pct}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-[#1a1a1a] rounded-full overflow-hidden', barSizes[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-700 ease-out', barColors[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

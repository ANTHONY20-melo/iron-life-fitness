import clsx from 'clsx'
import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  trend?: { value: number; isPositive: boolean }
  className?: string
}

export default function StatCard({ icon, label, value, trend, className }: StatCardProps) {
  return (
    <div
      className={clsx(
        'bg-[#111] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#3a3a3a] transition-all duration-200',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">{icon}</div>
        {trend && (
          <span
            className={clsx(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              trend.isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
            )}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-white animate-count">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  )
}

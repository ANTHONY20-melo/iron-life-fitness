import { type ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-[#111] border border-[#2a2a2a] rounded-xl p-6',
        hover && 'cursor-pointer hover:border-[#3a3a3a] hover:bg-[#1a1a1a] transition-all duration-200',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

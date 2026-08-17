import clsx from 'clsx'

interface SkeletonProps {
  className?: string
  count?: number
}

export default function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'animate-pulse bg-[#1a1a1a] rounded-xl',
            className || 'h-10 w-full'
          )}
        />
      ))}
    </>
  )
}

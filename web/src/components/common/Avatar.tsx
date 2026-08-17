import clsx from 'clsx'

interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' }

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function getColor(name: string): string {
  const colors = [
    'bg-red-600', 'bg-blue-600', 'bg-emerald-600', 'bg-amber-600',
    'bg-purple-600', 'bg-pink-600', 'bg-cyan-600', 'bg-orange-600',
  ]
  let hash = 0
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export default function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx('rounded-full object-cover', sizes[size], className)}
      />
    )
  }

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-bold text-white',
        getColor(name),
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}

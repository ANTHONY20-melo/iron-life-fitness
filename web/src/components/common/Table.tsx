import { type ReactNode } from 'react'
import clsx from 'clsx'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
  keyExtractor: (item: T) => string
}

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'Nenhum registro encontrado',
  keyExtractor,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-12 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={clsx(
                  'hover:bg-[#1a1a1a] transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={clsx('px-4 py-3 text-sm text-gray-300', col.className)}>
                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden divide-y divide-[#2a2a2a]">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            onClick={() => onRowClick?.(item)}
            className={clsx(
              'p-4 space-y-2',
              onRowClick && 'cursor-pointer hover:bg-[#1a1a1a]'
            )}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between items-center">
                <span className="text-xs text-gray-500 uppercase">{col.header}</span>
                <span className="text-sm text-gray-300">
                  {col.render ? col.render(item) : String(item[col.key] ?? '')}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

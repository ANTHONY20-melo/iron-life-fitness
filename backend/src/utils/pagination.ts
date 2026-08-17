interface PaginationQuery {
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: string
  search?: string
}

interface PaginationResult {
  page: number
  limit: number
  skip: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  search: string
}

export function parsePagination(query: PaginationQuery): PaginationResult {
  const page = Math.max(1, parseInt(query.page || '1', 10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10) || 20))
  const skip = (page - 1) * limit
  const sortBy = query.sortBy || 'createdAt'
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc'
  const search = query.search || ''

  return { page, limit, skip, sortBy, sortOrder, search }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function paginatedResponse<T>(data: T[], total: number, page: number, limit: number): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

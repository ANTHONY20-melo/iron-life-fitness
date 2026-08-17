import { z } from 'zod'

export const uuidParam = z.object({
  id: z.string().uuid('Invalid UUID format'),
})

export const paginationQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
})

export const dateRangeQuery = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type PaginationQuery = z.infer<typeof paginationQuery>

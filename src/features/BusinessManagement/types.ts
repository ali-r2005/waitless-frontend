// src/features/BusinessManagement/types.ts

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  pagination?: PaginationMeta;
}
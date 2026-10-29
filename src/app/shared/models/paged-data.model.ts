export interface Pagination {
  page: number;
  totalPages: number;
  totalItems: number;
  size: number;
}

export interface PagedData<T> {
  data: T[];
  pagination: Pagination;
}

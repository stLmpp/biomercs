export interface Pagination<T> {
  items: T[];
  meta: PaginationMetaVW;
  links?: PaginationLinksVW;
}

export interface PaginationMetaVW {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginationLinksVW {
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
}

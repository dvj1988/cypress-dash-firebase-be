export type PaginationType = { pageNumber: number; pageSize: number };
export type PaginationQueryType = { pageNumber: string; pageSize: string };
export type PaginationQueryTypeOrNull = {
  pageNumber?: string;
  pageSize?: string;
};
export type PaginationTypeOrNull = {
  pageNumber: number | null;
  pageSize: number | null;
};

export type CollectionStatsDocType = {
  totalCount: number;
};

import {
  PaginationQueryTypeOrNull,
  PaginationTypeOrNull,
} from "@/types/common";
import { isNumber } from "lodash";

export const isPaginationObjectValid = (pagination: PaginationTypeOrNull) => {
  return (
    isNumber(pagination.pageNumber) &&
    !isNaN(pagination.pageNumber) &&
    isNumber(pagination.pageSize) &&
    !isNaN(pagination.pageSize) &&
    pagination.pageSize <= 10 &&
    pagination.pageSize > 0 &&
    pagination.pageNumber > 0
  );
};

export const getParsedPaginationParams = (
  pagination: PaginationQueryTypeOrNull
): PaginationTypeOrNull => {
  const { pageNumber, pageSize } = pagination;

  if (!pageNumber || !pageSize) {
    return {
      pageNumber: null,
      pageSize: null,
    };
  }

  return {
    pageSize: parseInt(pageSize, 10),
    pageNumber: parseInt(pageNumber, 10),
  };
};

import { EnumDirection } from './enum.direction';

export type QueryDto = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: EnumDirection;
  searchLoginTerm: string;
  searchEmailTerm: string;//todo:ask about mix it with PaginationQueryDto
};
export function getPageInfo(dto: Partial<QueryDto>) {
  const pageNumber = dto.pageNumber || 1;
  const pageSize = dto?.pageSize || 10;
  const sortBy = dto?.sortBy || 'createdAt';
  const sortDirection = dto?.sortDirection || EnumDirection.desc;
  const searchLoginTerm = dto?.searchLoginTerm || '';
  const searchEmailTerm = dto?.searchEmailTerm || '';
  return {
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    searchLoginTerm,
    searchEmailTerm,
  };
}

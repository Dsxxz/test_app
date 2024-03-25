import { EnumDirection } from './enum.direction';

export type UserQueryDto = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: EnumDirection;
  searchLoginTerm: string;
  searchEmailTerm: string;
};
export function getUserPageInfo(dto: Partial<UserQueryDto>) {
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

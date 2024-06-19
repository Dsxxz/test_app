import { EnumDirection } from './enum.direction';

export type InputQueryDto = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: EnumDirection;
  searchNameTerm: string;
};

export type QueryPostDto = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: EnumDirection;
  searchNameTerm: string;
  totalCount: number;
};
export function getPageInfo(dto: Partial<InputQueryDto>) {
  const pageNumber = dto.pageNumber || 1;
  const pageSize = dto?.pageSize || 10;
  const sortBy = dto?.sortBy || 'createdAt';
  const sortDirection = dto?.sortDirection || EnumDirection.desc;
  const searchNameTerm = dto?.searchNameTerm || '';
  return { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm };
}

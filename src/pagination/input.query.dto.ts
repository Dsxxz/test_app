import { EnumDirection } from './enum.direction';

export type InputQueryDto = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: EnumDirection;
};
export function getPageInfo(dto: Partial<InputQueryDto>) {
  let { pageNumber, pageSize, sortBy, sortDirection } = dto;

  if (!dto.pageNumber) pageNumber = 1;
  if (!dto.pageSize) pageSize = 10;
  if (!dto.sortBy) sortBy = 'createdAt';
  if (!dto.sortDirection) sortDirection = EnumDirection.desc;
  return { pageNumber, pageSize, sortBy, sortDirection };
}

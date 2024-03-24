import { EnumDirection } from './enum.direction';

export type InputQueryDto = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: EnumDirection;
};

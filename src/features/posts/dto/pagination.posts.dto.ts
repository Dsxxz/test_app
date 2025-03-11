import { PostsModelDto } from './posts.model.dto';

export type PaginationPostsDto = {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  items: PostsModelDto[];
};

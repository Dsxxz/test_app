export class Paginator<T> {
  public pagesCount: number;
  public page: number;
  public pageSize: number;
  public totalCount: number;
  public items: T;
  static get<T>(data: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    items: T;
  }): Paginator<T> {
    return {
      pagesCount: Math.ceil(data.totalCount / data.pageSize) as number,
      page: data.pageNumber as number,
      pageSize: data.pageSize as number,
      totalCount: data.totalCount as number,
      items: data.items,
    };
  }
}

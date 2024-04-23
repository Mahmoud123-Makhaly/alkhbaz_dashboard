export interface ISearchResponse<T> {
  totalCount: number;
  results: Nullable<T>;
  items: Nullable<T>;
  [k as string]: any;
}

export enum DataColumnSortTypes {
  asc = 1,
  desc = -1,
}
export interface SortedColumn {
  /**
   * Property of a row data used for sorting, defaults to field.
   */
  sortField: string | undefined;
  /**
   * Order to sort the data by default.
   */
  sortOrder: DataColumnSortTypes | 0 | null | undefined;
}

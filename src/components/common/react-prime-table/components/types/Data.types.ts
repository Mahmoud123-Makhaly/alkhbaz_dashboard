import { DataTableColumns } from './Column.types';

/**
 * Custom value definition.
 * @extends Record<string, any>
 */
interface DataTableValue extends Record<string, any> {}

/**
 * Custom value array definition.
 * @extends Array<DataTableValue>
 */
interface DataTableValueArray extends Array<DataTableValue> {}
export type DataTableColumnsArray = Array<DataTableColumns>;

export type DataTableValues = {
  /**
   * Number of total records, defaults to length of value when not defined.
   */
  totalRecords?: number;
  /**
   * An array of objects to display.
   */
  data?: DataTableValueArray;
  /**
   * **Data Table Column**
   *
   * Column is a helper component for DataTable and TreeTable
   *
   * Defines valid properties in ColumnProps component.
   * @group Properties
   */
  columns: DataTableColumnsArray;
  /**
   * Index of the first row to be displayed.
   * @defaultValue 0
   */
  skipFirst?: number | 0;
  pageSize?: number;
};

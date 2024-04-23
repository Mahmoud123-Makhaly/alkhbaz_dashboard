export enum ExportType {
  csv,
  xlsx,
  pdf,
}

export interface IExportFileProps {
  fileName: string;
  endpoint: string;
  listResultPropName?: string;
  method: 'search' | 'select';
  payload?: any;
  selectedColumns?: { field: string; header: string } | Array<{ field: string; header: string }> | undefined;
  exportTypes?: Array<ExportType> | undefined;
  /**
   * A function to implement custom resolver to resolve data before exporting. Need to return array of values.
   * @param {T | any} data - revised data.
   * @returns { Array<T>} - array of resolved data
   */
  dataResolver?: <T>(data: Array<T | any>, type: ExportType) => Array<T | any>;
}

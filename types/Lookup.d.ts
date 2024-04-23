export interface ILookupItem<T = any> {
  name: string;
  endpoint: string;
  listResultPropName?: string;
  valuePropName?: string;
  labelPropName?: string;
  method: 'search' | 'select';
  payload?: any;
  valueResolver?: (item: T) => string;
}
export interface ILookup extends Array<ILookupItem> {}
export interface ILookupOption {
  value: string;
  label: string;
  meta: any;
}
export interface ILookupResult {
  [k: string]: Array<ILookupOption> | string | null;
}

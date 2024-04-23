import { ISortType } from './SortType';
export interface ICustomerSegmentFilter extends IDefaultFilter {
  isActive: boolean;
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  keyword: string;
  searchPhrase: string;
  languageCode: string;
}
export interface ICustomerSegmentsFilter extends Partial<ICustomerSegmentFilter> {}

import { ISortInfo } from './SortInfos';
import { ISortType } from './SortType';
export interface IPricesAssignmentFilter extends IDefaultFilter {
  priceListId: string;
  catalogIds: Array<string>;
  StoreIds: Array<string>;
  priceListIds: Array<string>;
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  keyword: string;
  searchPhrase: string;
  languageCode: string;
  sortInfos: Array<ISortInfo>;
}
export interface IPricesAssignmentsFilter extends Partial<IPricesAssignmentFilter> {}

import { ISortInfo } from './SortInfos';

interface IPriceListFilter extends IDefaultFilter {
  currencies: Array<string>;
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  keyword: string;
  searchPhrase: string;
  languageCode: string;
  sortInfos: Array<ISortInfo>;
}
export interface IPricesListFilter extends Partial<IPriceListFilter> {}

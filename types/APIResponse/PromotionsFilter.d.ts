import { ISortType } from './SortType';
export interface IPromotionFilter extends IDefaultFilter {
  onlyActive: boolean;
  store: string;
  storeIds: Array<string>;
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  keyword: string;
  searchPhrase: string;
  languageCode: string;
}
export interface IPromotionsFilter extends Partial<IPromotionFilter> {}

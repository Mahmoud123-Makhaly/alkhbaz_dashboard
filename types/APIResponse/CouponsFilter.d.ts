import { ISortType } from './SortType';
export interface ICouponFilter extends IDefaultFilter {
  code: string;
  codes: Array<string>;
  promotionId: string;
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  keyword: string;
  searchPhrase: string;
  languageCode: string;
}
export interface ICouponsFilter extends Partial<ICouponFilter> {}

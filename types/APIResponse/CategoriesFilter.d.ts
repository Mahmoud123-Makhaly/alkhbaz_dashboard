import { ISortType } from './SortType';
export interface ICategoryFilter extends IDefaultFilter {
  storeId: string;
  catalogId: string;
  catalogIds: Array<string>;
  outline: string;
  outlines: Array<string>;
  terms: Array<string>;
  userGroups: Array<string>;
  isFuzzySearch: boolean;
  rawQuery: string;
  includeFields: Array<string>;
  searchPhrase: string;
  keyword: string;
  // TODO: get types from BE and replace string as type
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  languageCode: string;
}
export interface ICategoriesFilter extends Partial<ICategoryFilter> {}

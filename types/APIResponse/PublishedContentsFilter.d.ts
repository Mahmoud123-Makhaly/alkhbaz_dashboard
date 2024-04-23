import { ISortType } from './SortType';
export interface IPublishedContentFilter extends IDefaultFilter {
  onlyActive: boolean;
  store: string;
  placeName: string;
  toDate: Date;
  folderId: string;
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  keyword: string;
  searchPhrase: string;
  languageCode: string;
}
export interface IPublishedContentsFilter extends Partial<IPublishedContentFilter> {}

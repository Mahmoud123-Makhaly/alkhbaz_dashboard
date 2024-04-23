import { ISortType } from './SortType';
export interface IUserFilter extends IDefaultFilter {
  memberId: string;
  memberIds: Array<string>;
  modifiedSinceDate: Date;
  roles: Array<string>;
  lasLoginDate: Date;
  onlyUnlocked: boolean;
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  keyword: string;
  searchPhrase: string;
  languageCode: string;
}
export interface IUsersFilter extends Partial<IUserFilter> {}

import { ISortType } from './SortType';
export interface IEmployeeFilter extends IDefaultFilter {
  memberType: string;
  memberTypes: Array<string>;
  group: string;
  groups: Array<string>;
  memberId: string;
  deepSearch: boolean;
  outerIds: Array<string>;
  // TODO: get types from BE and replace string as type
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  keyword: string;
  searchPhrase: string;
  languageCode: string;
}
export interface IEmployeesFilter extends Partial<IEmployeeFilter> {}

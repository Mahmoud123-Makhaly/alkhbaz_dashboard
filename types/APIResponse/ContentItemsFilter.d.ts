interface IContentItemFilter extends IDefaultFilter {
  folderId: string;
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  keyword: string;
  searchPhrase: string;
  languageCode: string;
}
export interface IContentItemsFilter extends Partial<IContentItemFilter> {}

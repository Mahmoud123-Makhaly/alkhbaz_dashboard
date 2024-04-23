interface IInventoryFilter extends IDefaultFilter {
  outerId: string;
  organizationId: string;
  // TODO: get types from BE and replace string as type
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  keyword: string;
  searchPhrase: string;
  languageCode: string;
}
export interface IInventoriesFilter extends Partial<IInventoryFilter> {}

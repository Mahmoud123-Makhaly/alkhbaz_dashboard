interface ICatalogFilter extends IDefaultFilter {
  catalogIds: Array<string>;
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
export interface ICatalogsFilter extends Partial<ICatalogFilter> {}

interface IDictionaryFilter extends IDefaultFilter {
  catalogIds: Array<string>;
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  keyword: string;
  searchPhrase: string;
  languageCode: string;
  propertyIds: Array<string>;
}
export interface IDictionariesFilter extends Partial<IDictionaryFilter> {}

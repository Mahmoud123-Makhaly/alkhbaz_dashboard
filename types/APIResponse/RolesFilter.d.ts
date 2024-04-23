interface IRoleFilter extends IDefaultFilter {
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  keyword: string;
  searchPhrase: string;
  languageCode: string;
}
export interface IRolesFilter extends Partial<IRoleFilter> {}

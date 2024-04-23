interface ILanguage {
  catalogId?: string;
  isDefault: boolean;
  languageCode: string;
  id?: string;
}
export interface ICatalogItem extends IDefaultObj {
  name: string;
  isVirtual: boolean;
  outerId: string;
  defaultLanguage: ILanguage;
  languages: Array<ILanguage>;
}

export interface ICatalogsList extends Array<ICatalogItem> {}

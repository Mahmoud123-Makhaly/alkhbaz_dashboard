export interface ISEOInfo extends IDefaultObj {
  name?: string;
  semanticUrl: string;
  pageTitle?: string;
  metaDescription: string;
  imageAltDescription: string;
  metaKeywords: string;
  storeId?: string;
  objectId?: string;
  objectType?: string;
  isActive: boolean;
  languageCode: string;
}

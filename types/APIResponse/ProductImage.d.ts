export interface IProductImage {
  binaryData?: any;
  altText: string;
  relativeUrl: string;
  url: string;
  description: string;
  sortOrder: number;
  typeId: string;
  group: string;
  name: string;
  outerId?: string;
  languageCode: string;
  isInherited: boolean;
  seoObjectType: string;
  seoInfos?: Array<ISEOInfo>;
  id: string;
}

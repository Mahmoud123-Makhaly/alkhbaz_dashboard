export interface IProductAsset {
  mimeType: string;
  size: number;
  readableSize: string;
  binaryData?: any;
  relativeUrl: string;
  url: string;
  description?: string;
  sortOrder: number;
  typeId: string;
  group?: string;
  name: string;
  outerId?: string;
  languageCode?: string;
  isInherited: boolean;
  seoObjectType: string;
  seoInfos?: Array<ISEOInfo>;
  id: string;
}

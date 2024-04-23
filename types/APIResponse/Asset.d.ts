export interface IAsset extends IDefaultObj {
  parentUrl?: string;
  type: 'folder' | 'blob';
  name: string;
  url: string;
  relativeUrl: string;
}
export interface IFileAsset extends IAsset {
  key?: string;
  size: number;
  contentType: string;
}

export interface IAssetList extends Array<IAsset> {}

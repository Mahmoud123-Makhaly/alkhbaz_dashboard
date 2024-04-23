import { IFolder } from './Folder';
interface IContentItem extends IDefaultObj {
  contentType: string;
  priority: number;
  outline: string;
  path: string;
  folderId: string;
  folder: IFolder;
  objectType: string;
  imageUrl: string;
  name: string;
  description: string;
}

export interface IContentItemsList extends Array<IContentItem> {}

import { IFolder } from './Folder';
interface IContentPlaceItem extends IDefaultObj {
  outline: string;
  path: string;
  folderId: string;
  folder: IFolder;
  objectType: string;
  imageUrl: string;
  name: string;
  description: string;
}

export interface IContentPlacesList extends Array<IContentPlaceItem> {}

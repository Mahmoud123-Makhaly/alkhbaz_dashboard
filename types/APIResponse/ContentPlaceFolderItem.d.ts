import { IFolder } from './Folder';
interface IContentPlaceFolderItem extends Omit<IContentPlaceItem, 'folderId' | 'folder'> {
  parentFolderId: string;
  parentFolder: IFolder;
}

export interface IContentPlaceFolderList extends Array<IContentPlaceFolderItem> {}

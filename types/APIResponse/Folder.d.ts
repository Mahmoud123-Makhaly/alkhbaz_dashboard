export interface IFolder extends IDefaultObj {
  path: string;
  outline: string;
  parentFolderId: string;
  parentFolder: string;
  objectType: string;
  imageUrl: string;
  name: string;
  description: string;
}

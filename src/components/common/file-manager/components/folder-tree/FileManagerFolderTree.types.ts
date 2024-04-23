import { MouseEventHandler } from 'react';

export interface IFMFTreeLeaf {
  key: string | number;
  name: string;
  onClick: MouseEventHandler;
}
export interface IFMFStorageStatus {
  used: string;
  total: string;
}
export interface IFMFTreeRoot {
  key: string | number;
  name: string;
  iconClassName?: string;
  leafs?: Array<IFMFTreeLeaf>;
  onClick?: MouseEventHandler;
}
export interface IFMFTreeProps {
  tree: Array<IFMFTreeRoot>;
  search?: (keyword: string) => any;
  storageStatus?: IFMFStorageStatus;
}

import { MouseEventHandler } from 'react';
import { FileSizeType } from '@helpers/constants';

export interface IRecentItemActions
  extends Array<{ label: string; iconClass?: string; onClick?: (dataKey: any) => void }> {}
export interface IRecentItem {
  name: string;
  numberOfFiles?: string;
  iconClass?: string;
  size?: { value: number; sizeType: FileSizeType };
  type: 'file' | 'folder';
  createDate?: Date;
  dataKey?: string;
  actions?: IRecentItemActions;
}

export interface IRecentItemsProps {
  name: string;
  value: Array<IRecentItem>;
}

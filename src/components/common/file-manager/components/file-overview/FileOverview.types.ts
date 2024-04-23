import { MouseEventHandler } from 'react';
import { FileSizeType } from '@helpers/constants';

export interface IFileOverview {
  id: string;
  fileName: string;
  path: string;
  icon?: string;
  size: number;
  sizeType: FileSizeType;
  fileType: string;
  createDate: Date;
  copyURL?: string;
  onClose?: MouseEventHandler;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}
export interface IFileOverviewProps extends IFileOverview {}

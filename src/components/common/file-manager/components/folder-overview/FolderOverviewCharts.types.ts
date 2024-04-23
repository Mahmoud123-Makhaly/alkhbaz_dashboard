import { FileSizeType } from '@helpers/constants';
import { MouseEventHandler } from 'react';
export enum ChartDataColors {
  blue = '--vz-info',
  red = '--vz-danger',
  blueSky = '--vz-primary',
  green = '--vz-success',
}
export interface IFolderOverviewDonutChartsDataItem {
  label: string;
  color: ChartDataColors;
  size: number;
}
export interface IFolderOverviewItem extends IFolderOverviewDonutChartsDataItem {
  infoTag?: string;
  iconClassName?: string;
  sizeType: FileSizeType;
}
export interface IFolderOverviewProps {
  data: Array<IFolderOverviewItem> | undefined;
  onClose?: MouseEventHandler;
}

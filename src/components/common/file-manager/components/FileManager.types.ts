import type { IFMFTreeProps as IFolderTree } from './folder-tree';
import type { IFolderOverviewProps as IFolderOverview } from './folder-overview';
import type { IFileOverviewProps as IFileOverview } from './file-overview';
import type { IRecentItemsProps as IRecentItems } from './recent-items';
import type { TableProps as DataList, DataLoadingStatus } from '@components/common';

export interface IFileManagerProps {
  folderOverview?: IFolderOverview;
  fileOverview?: IFileOverview;
  defaultTree?: IFolderTree;
  recentItems?: IRecentItems;
  dataList: DataList;
  dataListStatus?: DataLoadingStatus;
  dataListHeader?: string;
  dataListHeaderActions?: React.ReactNode;
  folderLevelUp?: { dataUpKey: string; onClick: (keyword: string) => any };
  currentFolder?: string;
  onNewFile?: () => any;
  onNewFolder?: () => any;
}
export type { IRecentItem, IRecentItemActions, IRecentItemsProps as IRecentItems } from './recent-items';
export type { IFMFTreeProps as IFolderTree } from './folder-tree';
export type { IFolderOverviewProps as IFolderOverview } from './folder-overview';
export type { IFileOverviewProps as IFileOverview } from './file-overview';
export type { DataList };

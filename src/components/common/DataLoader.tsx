'use client';

import React from 'react';
import { TableSkeleton, CardSkeleton, FileManagerSkeleton, BarChartSkeleton } from '@components/common';

export enum DataLoadingStatus {
  pending = 'PENDING',
  done = 'DONE',
}
export enum DataLoadingSkeletonType {
  table = 'TABLE',
  card = 'CARD',
  fileManager = 'FILE_MANAGER',
  barChart = 'BAR_CHART',
}
interface IGetDataLoaderProps {
  status?: DataLoadingStatus;
  skeleton?: DataLoadingSkeletonType;
  count?: number;
  children: React.ReactNode;
}
const DataLoader = ({
  status = DataLoadingStatus.pending,
  skeleton = DataLoadingSkeletonType.table,
  count,
  children,
}: IGetDataLoaderProps) => {
  const Skeleton = () => {
    switch (skeleton) {
      case DataLoadingSkeletonType.table:
        return <TableSkeleton count={count || 10} />;
      case DataLoadingSkeletonType.card:
        return <CardSkeleton />;
      case DataLoadingSkeletonType.fileManager:
        return <FileManagerSkeleton />;
      case DataLoadingSkeletonType.barChart:
        return <BarChartSkeleton />;
      default:
        return <TableSkeleton count={count || 10} />;
    }
  };
  return <React.Fragment>{status === DataLoadingStatus.done ? children : Skeleton()}</React.Fragment>;
};
export default DataLoader;

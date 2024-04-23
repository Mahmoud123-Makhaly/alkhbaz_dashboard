import React from 'react';
import { IOrder } from '@app/types';
import { IApiAPPClient } from '@app/libs';
import { DataLoadingStatus } from '@components/common';
import { ToastContent } from 'react-toastify';

export interface IWithOrderDetailsProps {
  id: string;
  apiClient: IApiAPPClient;
  data: IOrder | null;
  dataLoadingStatus: DataLoadingStatus | undefined;
  toast: {
    success: (content: ToastContent) => void;
    info: (content: ToastContent) => void;
    error: (content: ToastContent) => void;
    warn: (content: ToastContent) => void;
  };
  setDataLoadingStatus: React.Dispatch<React.SetStateAction<DataLoadingStatus | undefined>>;
  loadData: () => void;
}
const withOrderDetails = Component => {
  const withOrderDetails = (props: IWithOrderDetailsProps) => {
    return <Component {...props} />;
  };
  return withOrderDetails;
};
export default withOrderDetails;

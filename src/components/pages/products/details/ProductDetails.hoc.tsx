import React from 'react';
import { IProductDetails } from '@app/types';
import { IApiAPPClient } from '@app/libs';
import { DataLoadingStatus } from '@components/common';
import { ToastContent } from 'react-toastify';

export interface IWithProductDetailsProps {
  id: string;
  catalogId: string;
  apiClient: IApiAPPClient;
  data: IProductDetails | null;
  dataLoadingStatus: DataLoadingStatus | undefined;
  toast: {
    success: (content: ToastContent) => void;
    info: (content: ToastContent) => void;
    error: (content: ToastContent) => void;
    warn: (content: ToastContent) => void;
  };
  setDataLoadingStatus: React.Dispatch<React.SetStateAction<DataLoadingStatus | undefined>>;
  loadData: () => Promise<void>;
}
const withProductDetails = Component => {
  const withProductDetails = (props: IWithProductDetailsProps) => {
    return <Component {...props} />;
  };
  return withProductDetails;
};
export default withProductDetails;

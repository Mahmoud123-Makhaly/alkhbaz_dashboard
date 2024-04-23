import React from 'react';
import { ToastContent } from 'react-toastify';

import { ICustomerItem } from '@app/types';
import { IApiAPPClient } from '@app/libs';
import { DataLoadingStatus } from '@components/common';

export interface IWithCustomerDetailsProps {
  id: string;
  apiClient: IApiAPPClient;
  data: ICustomerItem | null;
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
const withCustomerDetails = Component => {
  const withCustomerDetails = (props: IWithCustomerDetailsProps) => {
    return <Component {...props} />;
  };
  return withCustomerDetails;
};
export default withCustomerDetails;

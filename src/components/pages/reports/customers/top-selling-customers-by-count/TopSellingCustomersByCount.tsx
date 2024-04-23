'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import moment from 'moment';

import { DataLoader, DataLoadingStatus } from '@components/common';
import { endpoints } from '@app/libs';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import { CompactTable } from '@components/common/widgets/compact-table';

const TopSellingCustomersByCount = ({
  startDate,
  endDate,
}: {
  dataType?: 'Sales' | 'Count';
  startDate?: Date;
  endDate?: Date;
}) => {
  const [dataLoadingStatus, setDataLoadingStatus] = useState<DataLoadingStatus>();
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const t = useTranslate('COMP_SELLING_CUSTOMERS_BY_COUNT');
  const [data, setData] = useState<{
    headers: Array<{ title: string; field: string }>;
    data?: Array<any>;
  }>();

  const loadData = useCallback(
    filter => {
      setDataLoadingStatus(DataLoadingStatus.pending);
      apiClient.select(endpoints.reports.topCustomerByCountStatistics, filter).then(
        data => {
          if (data) {
            setData({
              headers: [
                { title: t('CUSTOMER_NAME'), field: 'name' },
                { title: t('CUSTOMER_PHONE'), field: 'phone' },
                { title: t('CUSTOMER_EMAIL'), field: 'email' },
                { title: t('COUNT'), field: 'count' },
              ],
              data: data.map(x => ({
                count: x.count || 0,
                name: x.customerOrderInfo?.name || t('N/A'),
                phone: x.customerOrderInfo?.phone || t('N/A'),
                email: x.customerOrderInfo?.email || t('N/A'),
              })),
            });
            setTimeout(() => {
              setDataLoadingStatus(DataLoadingStatus.done);
            }, 600);
          } else {
            setData({
              headers: [
                { title: t('CUSTOMER_NAME'), field: 'name' },
                { title: t('CUSTOMER_PHONE'), field: 'phone' },
                { title: t('CUSTOMER_EMAIL'), field: 'email' },
                { title: t('COUNT'), field: 'count' },
              ],
              data: [],
            });
          }
        },
        err => {
          toast.error(t('ERR_GENERIC_MSG'));
          setDataLoadingStatus(DataLoadingStatus.done);
        },
      );
    },
    [apiClient, t, toast],
  );

  useEffect(() => {
    let start = startDate ? moment(new Date(startDate)).format('YYYY-MM-DD') : undefined;
    let end = endDate ? moment(new Date(endDate)).format('YYYY-MM-DD') : undefined;
    loadData({ start, end });
  }, [startDate, endDate, loadData]);

  return (
    <DataLoader status={dataLoadingStatus}>
      <Card className="h-100">
        <CardHeader className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">{t('CARD_HEADER')}</h4>
        </CardHeader>
        <CardBody>{data && <CompactTable headers={data.headers} data={data.data} />}</CardBody>
      </Card>
    </DataLoader>
  );
};

export default TopSellingCustomersByCount;

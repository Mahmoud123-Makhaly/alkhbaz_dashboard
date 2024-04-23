'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

import { DataLoader, DataLoadingStatus } from '@components/common';
import { endpoints } from '@app/libs';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import { CompactTable } from '@components/common/widgets/compact-table';

const BestSellingProducts = () => {
  const [dataLoadingStatus, setDataLoadingStatus] = useState<DataLoadingStatus>();
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const t = useTranslate('COMP_PRODUCT_SALES');
  const [productSales, setProductSales] = useState<{
    headers: Array<{ title: string; field: string }>;
    data?: Array<any>;
  }>();

  const loadData = useCallback(() => {
    setDataLoadingStatus(DataLoadingStatus.pending);
    apiClient.select(endpoints.topSales.ProductsSales).then(
      data => {
        if (data && data.results) {
          setProductSales(prev => ({
            headers: [
              { title: t('PRODUCT_NAME'), field: 'x' },
              { title: t('PRODUCT_PRICE'), field: 'y' },
            ],
            data: data.results,
          }));
          setTimeout(() => {
            setDataLoadingStatus(DataLoadingStatus.done);
          }, 600);
        } else {
          toast.error(t('ERR_NOT_FOUNDED'));
          setTimeout(() => {
            setDataLoadingStatus(DataLoadingStatus.done);
          }, 400);
        }
      },
      err => {
        toast.error(err.toString());
        setDataLoadingStatus(DataLoadingStatus.done);
      },
    );
  }, [apiClient, t, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DataLoader status={dataLoadingStatus}>
      <Card className="h-100">
        <CardHeader className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">{t('PRODUCTS')}</h4>
        </CardHeader>
        <CardBody>{productSales && <CompactTable headers={productSales.headers} data={productSales.data} />}</CardBody>
      </Card>
    </DataLoader>
  );
};

export default BestSellingProducts;

'use client';

import { useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import moment from 'moment';

import { DataLoader, DataLoadingStatus, DataLoadingSkeletonType } from '@components/common';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import { DistributedColumnChart, IDistributedColumnChartSeries } from '@components/common/widgets';
import { endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';

const OrderByPaymentMethodSalesStatistics = ({
  dataType = 'Sales',
  startDate,
  endDate,
}: {
  dataType?: 'Sales' | 'Count';
  startDate?: Date;
  endDate?: Date;
}) => {
  const [data, setData] = useState<Array<IDistributedColumnChartSeries>>([]);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_ReportSalesDiscountsOrderByPaymentMethodSalesStatistics');
  const apiClient = useAPIAuthClient();
  const toast = useToast();

  const loadData = useCallback(
    async filter => {
      setLoadingStatus(DataLoadingStatus.pending);
      apiClient
        .select<IDistributedColumnChartSeries>(
          `${endpoints.reports.sales.discounts.orderByPaymentMethod}${dataType}`,
          filter,
        )
        .then(
          data => {
            if (data && data.name) {
              setData([
                {
                  name: data.name,
                  data: data.results.map(order => ({ x: order.x || '', y: order.y || 0, meta: order.meta })),
                },
              ]);
            }
            setTimeout(() => {
              setLoadingStatus(DataLoadingStatus.done);
            }, 1000);
          },
          err => {
            toast.error(t('ERR_GENERIC_MSG'));
            setLoadingStatus(DataLoadingStatus.done);
          },
        );
    },
    [apiClient, dataType, t, toast],
  );

  const formatYAxes = (val: number, opts?: any): string | string[] => {
    return Utils.numberWithCommas(val);
  };

  const barDataLabelsFormatter = (val: string | number | number[], opts?: any): string | number => {
    return Utils.formatCash(val);
  };

  useEffect(() => {
    let start = startDate ? moment(new Date(startDate)).format('YYYY-MM-DD') : undefined;
    let end = endDate ? moment(new Date(endDate)).format('YYYY-MM-DD') : undefined;
    loadData({ start, end });
  }, [startDate, endDate, loadData]);

  return (
    <Row>
      <Col>
        <DataLoader status={loadingStatus} skeleton={DataLoadingSkeletonType.barChart}>
          <Card className="h-100">
            <CardHeader>
              <h4 className="card-title mb-0">{t('CARD_HEADER')}</h4>
            </CardHeader>
            <CardBody>
              <DistributedColumnChart
                data={data}
                yAxesFormatter={formatYAxes}
                barDataLabelsFormatter={barDataLabelsFormatter}
                barLabelOrientation="vertical"
                allowDrillingDown
                colorsDistributed
              />
            </CardBody>
          </Card>
        </DataLoader>
      </Col>
    </Row>
  );
};
export default OrderByPaymentMethodSalesStatistics;

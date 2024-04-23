'use client';

import { useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import moment from 'moment';

import { DataLoader, DataLoadingStatus, DataLoadingSkeletonType } from '@components/common';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import { DonutChart } from '@components/common/widgets';
import { endpoints } from '@app/libs';
import { IDonutChartSeries } from '@components/common/widgets';
import { Utils } from '@helpers/utils';

const OrderFFCSalesStatistics = ({
  dataType = 'Sales',
  startDate,
  endDate,
}: {
  dataType?: 'Sales' | 'Count';
  startDate?: Date;
  endDate?: Date;
}) => {
  const [data, setData] = useState<Array<IDonutChartSeries>>([]);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_TaxesOrderFFCSalesStatistics');
  const apiClient = useAPIAuthClient();
  const toast = useToast();

  const loadData = useCallback(
    async filter => {
      setLoadingStatus(DataLoadingStatus.pending);
      apiClient
        .select<{ name: string; results: IDonutChartSeries }>(
          `${endpoints.reports.sales.taxes.orderFulfillmentStatistics}${dataType}`,
          filter,
        )
        .then(
          data => {
            if (data && data.results) {
              setData(
                data.results
                  .map(order => ({ label: order.label || '', value: order.value || 0 }))
                  .sort((a, b) => b.value - a.value),
              );
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

  const formatYAxes = (val: number, opts?: any): string => {
    return Utils.numberWithCommas(val);
  };

  useEffect(() => {
    let start = startDate ? moment(new Date(startDate)).format('YYYY-MM-DD') : undefined;
    let end = endDate ? moment(new Date(endDate)).format('YYYY-MM-DD') : undefined;
    loadData({ start, end });
  }, [startDate, endDate, loadData]);

  return (
    <Row className="h-100">
      <Col className="mb-4">
        <DataLoader status={loadingStatus} skeleton={DataLoadingSkeletonType.barChart}>
          <Card className="h-100">
            <CardHeader>
              <h4 className="card-title mb-0">{t('CARD_HEADER')}</h4>
            </CardHeader>
            <CardBody>
              <DonutChart data={data} yAxesFormatter={formatYAxes} />
            </CardBody>
          </Card>
        </DataLoader>
      </Col>
    </Row>
  );
};
export default OrderFFCSalesStatistics;

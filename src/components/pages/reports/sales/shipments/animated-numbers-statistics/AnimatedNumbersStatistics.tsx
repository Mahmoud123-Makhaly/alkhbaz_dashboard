'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import FeatherIcon from 'feather-icons-react';
import moment from 'moment';
import _ from 'lodash';

import { useAPIAuthClient, useToast, useTranslate } from '@app/hooks';
import { MiniAttachedAnimatedCardNumbers, IMiniAttachedAnimatedCardNumbersProps } from '@components/common/widgets';
import { endpoints } from '@app/libs';
import { IOrderStatistics } from '@app/types';

const AnimatedNumbersStatistics = ({
  dataType = 'Sales',
  startDate,
  endDate,
}: {
  dataType?: 'Sales' | 'Count';
  startDate?: Date;
  endDate?: Date;
}) => {
  const [orderDashboardStatisticsData, setOrderDashboardStatisticsData] = useState<
    Array<IMiniAttachedAnimatedCardNumbersProps>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isERPLoading, setIsERPLoading] = useState<boolean>();
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const t = useTranslate('COMP_ShipmentsAnimatedNumbersStatistics');

  const loadOrderDashboardStatistics = useCallback(
    async filter => {
      apiClient.select<IOrderStatistics>(endpoints.reports.sales.shipments.orderStatistics, filter).then(
        (data: IOrderStatistics | null) => {
          if (data) {
            const result: Array<IMiniAttachedAnimatedCardNumbersProps> = [
              {
                title: t('ALL_ORDERS_SALES'),
                count: data.allOrderSales || 0,
                icon: <FeatherIcon icon="dollar-sign" className="display-6 text-muted" />,
              },
              {
                title: t('COMPLETED_ORDERS_SALES'),
                count: data.completedOrderSales || 0,
                icon: <FeatherIcon icon="check-circle" className="display-6 text-muted" />,
              },
              {
                title: t('ALL_ORDERS_COUNT'),
                count: data.allOrderCount || 0,
                isDecimal: false,
                icon: <FeatherIcon icon="shopping-cart" className="display-6 text-muted" />,
              },
              {
                title: t('COMPLETED_ORDERS_COUNT'),
                count: data.completedOrderCount || 0,
                isDecimal: false,
                icon: <FeatherIcon icon="shopping-bag" className="display-6 text-muted" />,
              },
              {
                title: t('AVG_ALL_ORDER_SALES'),
                count: data.avgAllOrderSales || 0,
                icon: <FeatherIcon icon="activity" className="display-6 text-muted" />,
              },
              {
                title: t('AVG_COMPLETED_ORDER_SALES'),
                count: data.avgCompletedOrderSales || 0,
                icon: <FeatherIcon icon="activity" className="display-6 text-muted" />,
              },
            ];
            setOrderDashboardStatisticsData(result);
          }
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        },
        err => {
          toast.error(err.toString());
          setIsLoading(false);
        },
      );
    },
    [apiClient, t, toast],
  );

  useEffect(() => {
    setIsLoading(true);
    setIsERPLoading(true);
    let start = startDate ? moment(new Date(startDate)).format('YYYY-MM-DD') : undefined;
    let end = endDate ? moment(new Date(endDate)).format('YYYY-MM-DD') : undefined;
    loadOrderDashboardStatistics({ start, end });
  }, [startDate, endDate, loadOrderDashboardStatistics]);

  return (
    <React.Fragment>
      <Row>
        <div className="col-xl-12">
          <div className="card crm-widget">
            <div className="card-body p-0">
              <div className="row row-cols-xxl-6 row-cols-md-3 row-cols-1 g-0">
                {orderDashboardStatisticsData.map((item, indx) => (
                  <Col key={'order-statistics-chunk' + indx}>
                    <MiniAttachedAnimatedCardNumbers {...item} isLoading={isLoading} />
                  </Col>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Row>
    </React.Fragment>
  );
};
export default AnimatedNumbersStatistics;

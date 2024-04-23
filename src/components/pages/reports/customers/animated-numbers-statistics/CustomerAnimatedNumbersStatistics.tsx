'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Col } from 'reactstrap';
import FeatherIcon from 'feather-icons-react';
import moment from 'moment';
import _ from 'lodash';

import { useAPIAuthClient, useToast, useTranslate } from '@app/hooks';
import { IHeroAnimatedCardNumbersProps, HeroAnimatedCardNumbers, IPieChartSeries } from '@components/common/widgets';
import { endpoints } from '@app/libs';

const CustomerAnimatedNumbersStatistics = ({
  dataType = 'Sales',
  loading = true,
  startDate,
  endDate,
  data,
}: {
  dataType?: 'Sales' | 'Count';
  loading?: boolean;
  startDate?: Date;
  endDate?: Date;
  data?: Array<IPieChartSeries>;
}) => {
  const [orderDashboardStatisticsData, setOrderDashboardStatisticsData] = useState<
    Array<IHeroAnimatedCardNumbersProps>
  >([]);
  const [erpOrderDashboardStatisticsData, setERPOrderDashboardStatisticsData] = useState<
    Array<IHeroAnimatedCardNumbersProps>
  >([]);
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const t = useTranslate('COMP_CustomerAnimatedNumbersStatistics');

  const loadOrderDashboardStatistics = useCallback(
    async filter => {
      const result: Array<IHeroAnimatedCardNumbersProps> = [
        {
          title: t('COMPLETE_ORDERS'),
          count: data?.find(item => item.label.toUpperCase() === 'Completed'.toUpperCase())?.value || 0,
          isDecimal: false,
          icon: (
            <span className="avatar-title rounded fs-3 bg-soft-success">
              <FeatherIcon icon="dollar-sign" className="display-6 text-success" />
            </span>
          ),
        },
        {
          title: t('INCOMPLETE_ORDERS'),
          count:
            _.sumBy(data?.filter(item => item.label.toUpperCase() != 'Completed'.toUpperCase()), x => x.value || 0) ||
            0,
          isDecimal: false,
          icon: (
            <span className="avatar-title rounded bg-soft-primary">
              <i className=" ri-swap-line text-primary fs-1" />
            </span>
          ),
        },
        {
          title: t('CANCELLED_ORDERS'),
          count: data?.find(item => item.label.toUpperCase() === 'Cancelled'.toUpperCase())?.value || 0,
          isDecimal: false,
          icon: (
            <span className="avatar-title rounded bg-soft-warning">
              <i className="ri-close-circle-line text-warning fs-1" />
            </span>
          ),
        },
        {
          title: t('REJECTED_ORDERS'),
          count: data?.find(item => item.label.toUpperCase() === 'Rejected'.toUpperCase())?.value || 0,
          isDecimal: false,
          icon: (
            <span className="avatar-title rounded bg-soft-danger">
              <i className="ri-creative-commons-nc-line text-danger fs-1" />
            </span>
          ),
        },
      ];
      setOrderDashboardStatisticsData(result);
    },
    [data, t],
  );

  useEffect(() => {
    let start = startDate ? moment(new Date(startDate)).format('YYYY-MM-DD') : undefined;
    let end = endDate ? moment(new Date(endDate)).format('YYYY-MM-DD') : undefined;
    loadOrderDashboardStatistics({ start, end });
  }, [endDate, loadOrderDashboardStatistics, startDate]);

  return (
    <React.Fragment>
      {orderDashboardStatisticsData.map((item, indx) => (
        <Col xl={3} md={6} key={'order-statistics-chunk' + indx}>
          <HeroAnimatedCardNumbers {...item} isLoading={loading} />
        </Col>
      ))}
    </React.Fragment>
  );
};
export default CustomerAnimatedNumbersStatistics;

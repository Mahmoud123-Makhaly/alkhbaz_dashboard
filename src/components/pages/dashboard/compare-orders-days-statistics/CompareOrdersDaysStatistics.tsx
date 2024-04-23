'use client';

import { useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import CountUp from 'react-countup';
import moment from 'moment';
import _ from 'lodash';
import { ApexOptions } from 'apexcharts';

import { DataLoader, DataLoadingStatus, DataLoadingSkeletonType } from '@components/common';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import { DistributedColumnChart, IDistributedColumnChartSeries } from '@components/common/widgets';
import { endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';
import { CompareOrdersDaysStatisticsHeader } from './CompareOrdersDaysStatisticsHeader';

const CompareOrdersDaysStatistics = () => {
  const [data, setData] = useState<{
    series: Array<IDistributedColumnChartSeries>;
    totals: { allOrder: number; completedOrder: number; inCompletedOrder: number };
  }>({ series: [], totals: { allOrder: 0, completedOrder: 0, inCompletedOrder: 0 } });
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_CompareOrdersDaysStatistics');
  const [filterCriteriaValues, setFilterCriteriaValues] = useState<{
    start?: string;
    end?: string;
    SelectedDate?: any;
    dataType: 'Sales' | 'Count';
  }>({ dataType: 'Sales' });
  const apiClient = useAPIAuthClient();
  const toast = useToast();

  const loadData = useCallback(async () => {
    setLoadingStatus(DataLoadingStatus.pending);
    apiClient
      .select<IDistributedColumnChartSeries>(`${endpoints.dashboard.dailyStatistics}${filterCriteriaValues.dataType}`, {
        ...(Utils.removeObjectKeys(filterCriteriaValues, ['dataType', 'SelectedDate']) || {}),
      })
      .then(
        data => {
          if (data && data.allOrder && data.completedOrder && data.inCompletedOrder) {
            const series=[
                {
                  name: t('ALL_LABEL'),
                  type: 'area',
                  data: data.allOrder.map(order => ({ x: order.x || '', y: order.y || 0, meta: order.meta })),
                },
                {
                  name: t('COMPLETE_LABEL'),
                  type: 'bar',
                  data: data.completedOrder.map(order => ({ x: order.x || '', y: order.y || 0, meta: order.meta })),
                },
                {
                  name: t('INCOMPLETE_LABEL'),
                  type: 'line',
                  data: data.inCompletedOrder.map(order => ({ x: order.x || '', y: order.y || 0, meta: order.meta })),
                },
            ]
            const unionData = Utils.unifyBy<{ x: string; y: number; meta: any }>(series.map(obj => ({ name: obj.type, data: obj.data })), 'x', { 'x': '', 'y': 0, 'meta': null },(data)=>data.sort((a,b)=>Number.parseInt(a.x)>Number.parseInt(b.x)?1:-1));
          
            setData({
              series: [
                {
                  name: t('ALL_LABEL'),
                  type: 'area',
                  data: unionData.find(x=>x.name==='area')?.data!,
                },
                {
                  name: t('COMPLETE_LABEL'),
                  type: 'bar',
                  data: unionData.find(x=>x.name==='bar')?.data!,
                },
                {
                  name: t('INCOMPLETE_LABEL'),
                  type: 'line',
                  data: unionData.find(x=>x.name==='line')?.data!,
                },
              ],
              totals: {
                allOrder: _.sum(data.allOrder.map(order => order.y)),
                completedOrder: _.sum(data.completedOrder.map(order => order.y)),
                inCompletedOrder: _.sum(data.inCompletedOrder.map(order => order.y)),
              },
            });
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
  }, [apiClient, filterCriteriaValues, t, toast]);

  const formatYAxes = (val: number, opts?: any): string | string[] => {
    return Utils.numberWithCommas(val);
  };

  const barDataLabelsFormatter = (val: string | number | number[], opts?: any): string | number => {
    return Utils.formatCash(val);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const chartExtraOptions: Omit<ApexOptions, 'series' | 'labels'> = {
    stroke: {
      curve: 'straight',
      dashArray: [0, 0, 8],
      width: [2, 0, 2.2],
    },
    fill: {
      opacity: [0.1, 0.9, 1],
    },
    markers: {
      size: [0, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 0,
        left: 10,
      },
    },
  };

  const onSearch = (values, setSubmitting) => {
    let searchCriteria = { ...(filterCriteriaValues || {}) };
    if (values) {
      if (values.date) {
        searchCriteria.start = moment(_.min(values.date)).format('YYYY-MM-DD');
        searchCriteria.end = moment(_.max(values.date)).format('YYYY-MM-DD');
        searchCriteria.SelectedDate = values.date;
      }
      if (values.dataType) {
        searchCriteria.dataType = values.dataType;
      }
    }
    setFilterCriteriaValues({ ...searchCriteria });

    setTimeout(() => {
      setSubmitting(false);
    }, 3000);
  };

  return (
    <Row>
      <Col>
        <DataLoader status={loadingStatus} skeleton={DataLoadingSkeletonType.barChart}>
          <Card className="h-100">
            <CompareOrdersDaysStatisticsHeader
              onSubmit={onSearch}
              initialValues={{ date: filterCriteriaValues.SelectedDate, dataType: filterCriteriaValues.dataType }}
            />
            <CardHeader className="p-0 border-0 bg-soft-light">
              <Row className="g-0 text-center">
                <Col xs={6} sm={4}>
                  <div className="p-3 border border-dashed border-start-0">
                    <h5 className="mb-1">
                      <CountUp start={0} decimals={2} end={data.totals.allOrder} duration={3} separator="," />
                    </h5>
                    <p className="text-muted mb-0">{t('ALL_LABEL')}</p>
                  </div>
                </Col>
                <Col xs={6} sm={4}>
                  <div className="p-3 border border-dashed border-start-0">
                    <h5 className="mb-1">
                      <CountUp start={0} decimals={2} end={data.totals.completedOrder} duration={3} />
                    </h5>
                    <p className="text-muted mb-0">{t('COMPLETE_LABEL')}</p>
                  </div>
                </Col>
                <Col xs={6} sm={4}>
                  <div className="p-3 border border-dashed border-start-0">
                    <h5 className="mb-1">
                      <CountUp start={0} decimals={2} end={data.totals.inCompletedOrder} duration={3} />
                    </h5>
                    <p className="text-muted mb-0">{t('INCOMPLETE_LABEL')}</p>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <DistributedColumnChart
                data={data.series}
                dataColors={['--vz-primary', '--vz-success', '--vz-danger']}
                yAxesFormatter={formatYAxes}
                barDataLabelsFormatter={barDataLabelsFormatter}
                chartType="line"
                options={chartExtraOptions}
                viewLegend
              />
            </CardBody>
          </Card>
        </DataLoader>
      </Col>
    </Row>
  );
};
export default CompareOrdersDaysStatistics;

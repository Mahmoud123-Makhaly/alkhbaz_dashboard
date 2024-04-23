'use client';

import { useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import _ from 'lodash';

import { DataLoader, DataLoadingStatus, DataLoadingSkeletonType } from '@components/common';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import { DonutChart } from '@components/common/widgets';
import { endpoints } from '@app/libs';
import { IDonutChartSeries } from '@components/common/widgets';
import { Utils } from '@helpers/utils';

const IncompleteOrdersStatistics = ({
  dataType = 'Sales',
}: {
  dataType?: 'Sales' | 'Count';
  startDate?: Date;
  endDate?: Date;
}) => {
  const [data, setData] = useState<Array<{ title: string; data: IDonutChartSeries[] }> | undefined>();
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_ShipmentIncompleteOrdersStatistics');
  const apiClient = useAPIAuthClient();
  const toast = useToast();

  const loadData = useCallback(
    async (
      name: string,
      order: number,
      filter?: { start: string; end: string },
    ): Promise<{ [k: string]: Array<IDonutChartSeries> | number | string } | { [k: string]: null | number | string }> =>
      new Promise((resolve, reject) =>
        apiClient
          .select<IDonutChartSeries>(`${endpoints.reports.sales.shipments.orderStatusStatistics}${dataType}`, filter)
          .then(
            data => {
              if (data && data.name) {
                resolve({
                  data: data.results
                    .filter(order => order.y >= 0 && order.x != 'Completed')
                    .map(order => ({ label: order.x || '', value: order.y || 0 }) as IDonutChartSeries)
                    .sort((a, b) => b.value - a.value),
                  order,
                  title: t(name),
                });
              } else resolve({ data: null, order, title: t(name) });
            },
            err => reject(t(name)),
          )
          .catch(reason => reject(t(name))),
      ),
    [apiClient, dataType, t],
  );

  const formatYAxes = (val: number, opts?: any): string => {
    return Utils.numberWithCommas(val);
  };

  const defaultChartOptions = {
    stroke: {
      width: 0,
    },
    legend: {
      show: false,
      // position: 'bottom',
      // horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 0,
    },
  };

  useEffect(() => {
    setLoadingStatus(DataLoadingStatus.pending);
    const dateRanges = Utils.getTodayDateRanges();
    const day = loadData('day', 1, { ...dateRanges.today });
    const lastSevenDays = loadData('lastSevenDays', 2, { ...dateRanges.lastWeek });
    const thisMonth = loadData('thisMonth', 3, { ...dateRanges.thisMonth });
    const all = loadData('all', 4);

    Promise.allSettled([day, lastSevenDays, thisMonth, all]).then(results => {
      const fulfilledPromises = results
        .filter(x => x.status === 'fulfilled')
        .map(x => x['value'])
        .sort((a, b) => a.order - b.order) as Array<
        PromiseFulfilledResult<
          { [k: string]: Array<IDonutChartSeries> | number | string } | { [k: string]: null | number | string }
        >
      >;

      const failedPromises = _.flatMap(
        results.filter(x => x.status === 'rejected'),
        (item: PromiseRejectedResult) => item.reason,
      );

      if (fulfilledPromises && fulfilledPromises.length > 0)
        setData(
          fulfilledPromises.map(x => {
            return { data: x['data'], title: x['title'] as string };
          }),
        );

      if (failedPromises && failedPromises.length > 0)
        toast.error(t('ERR_GENERIC_MSG', { title: failedPromises.join(',') }));

      setTimeout(() => setLoadingStatus(DataLoadingStatus.done), 3000);
    });
  }, [loadData, t, toast]);

  return (
    <Row className="h-100">
      <Col className="mb-4">
        <DataLoader status={loadingStatus} skeleton={DataLoadingSkeletonType.barChart}>
          <Card className="h-100">
            <CardHeader>
              <h4 className="card-title mb-0">{t('CARD_HEADER')}</h4>
            </CardHeader>
            <CardBody>
              <Row>
                {data &&
                  data.map((item, indx) => (
                    <Col key={'incomplete-order-' + indx}>
                      <DonutChart
                        data={item['data']}
                        yAxesFormatter={formatYAxes}
                        size="90%"
                        enabledDataLabels={false}
                        options={{
                          ...defaultChartOptions,
                          title: { text: item['title'], align: 'center', margin: 40 },
                        }}
                        hideToolbar
                      />
                    </Col>
                  ))}
              </Row>
            </CardBody>
          </Card>
        </DataLoader>
      </Col>
    </Row>
  );
};

export default IncompleteOrdersStatistics;

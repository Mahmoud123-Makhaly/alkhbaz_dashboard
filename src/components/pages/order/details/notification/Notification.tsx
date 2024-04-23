'use client';

import { CardBody, Card, CardHeader, Col, Row } from 'reactstrap';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import {
  DataLoader,
  DataLoadingStatus,
  DataTableValues,
  Table,
  DataTableColumnsArray,
  DataTableStateEvent,
  ClientOnly,
  DisplayDateText,
  SortedColumn,
  DataColumnSortTypes,
  EndSideBar,
} from '@components/common';
import { INotification, INotificationsList, ISearchResponse } from '@app/types';
import { endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';
import Details from './Details';

const OrderNotifications = ({ orderId }: { orderId?: string }) => {
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const [selectedNotification, setSelectedNotification] = useState<INotification | null>(null);
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const t = useTranslate('COMP_Order.NOTIFICATION');
  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      createdDate: 'desc',
    };
  }, []);
  const filter = useMemo(() => {
    return {
      objectIds: [orderId],
      objectType: 'CustomerOrder',
      sort: defaultSortedColumn,
      skip: 0,
      take: 10,
    };
  }, [defaultSortedColumn, orderId]);

  const Sort = useCallback(() => {
    const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
    setSortedColumn({
      sortField: sortField,
      sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
    });
  }, [defaultSortedColumn, filter.sort]);

  const columns: DataTableColumnsArray = useMemo(
    () => [
      {
        field: 'createdBy',
        header: t('CREATED_BY'),
        sortable: true,
        bodyStyle: { whiteSpace: 'pre-line' },
      },
      { field: 'notificationType', header: t('NOTIFICATION_TYPE'), sortable: true },
      { field: 'sendAttemptCount', header: t('ATTEMPTS'), sortable: true },
      { field: 'status', header: t('STATUS'), sortable: true },
      {
        field: 'createdDate',
        header: t('CREATED'),
        sortable: true,
        body: col => <DisplayDateText date={col.createdDate} fromNow />,
      },
      {
        field: 'modifiedDate',
        header: t('MODIFIED'),
        sortable: true,
        body: col => <DisplayDateText date={col.modifiedDate} fromNow />,
      },
      { field: 'modifiedBy', header: t('MODIFIED_BY'), sortable: true, bodyStyle: { whiteSpace: 'pre-line' } },
    ],
    [t],
  );

  const [dataSource, setDataSource] = useState<DataTableValues>({
    columns,
  });

  const loadData = useCallback(async () => {
    apiClient.search<ISearchResponse<INotificationsList>>(endpoints.orders.notification, { ...filter }).then(
      data => {
        if (data && data.results) {
          setDataSource(prev => ({
            ...prev,
            data: data.results || null,
            totalRecords: data['totalCount'],
            skipFirst: filter.skip,
          }));
          Sort();
        }
        setTimeout(() => {
          setLoadingStatus(DataLoadingStatus.done);
        }, 1000);
      },
      err => {
        toast.error(err.toString());
        setLoadingStatus(DataLoadingStatus.done);
      },
    );
  }, [Sort, apiClient, filter, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const setFilterSort = (field: string, order: number) => {
    filter.sort = { [field]: DataColumnSortTypes[order] } as ISortType;
  };

  const onSort = (e: DataTableStateEvent) => {
    setLoadingStatus(DataLoadingStatus.pending);
    setFilterSort(e.sortField, e.sortOrder!);
    loadData();
  };

  const onPage = (e: DataTableStateEvent) => {
    setLoadingStatus(DataLoadingStatus.pending);
    setFilterSort(e.sortField, e.sortOrder!);
    filter.skip = e.first;
    loadData();
  };

  return (
    <ClientOnly>
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader>
              <Row className="g-3">
                <Col md={6}>
                  <h4 className="card-title mb-0">{t('NOTIFICATIONS')}</h4>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <DataLoader status={loadingStatus}>
                <Table
                  dataSource={dataSource}
                  sortedColumn={sortedColumn}
                  onSort={onSort}
                  onPage={onPage}
                  selectionMode="single"
                  onSelectionChange={e => setSelectedNotification(e.value)}
                />
              </DataLoader>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <EndSideBar
        isOpen={!!selectedNotification}
        title={'Notification Detail'}
        toggle={() => setSelectedNotification(null)}
        backdrop={true}
        loseFocusClose
      >
        {selectedNotification && <Details data={selectedNotification} />}
      </EndSideBar>
    </ClientOnly>
  );
};
export default OrderNotifications;

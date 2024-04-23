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
  IExportFile,
  ExportType,
} from '@components/common';
import { ILog, ILogsList, ISearchResponse } from '@app/types';
import { endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';

const OrderChanges = ({ orderId }: { orderId?: string }) => {
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const t = useTranslate('COMP_Order.CHANGES');
  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      createdDate: 'desc',
    };
  }, []);
  const filter = useMemo(() => {
    return {
      sort: defaultSortedColumn,
      skip: 0,
      take: 10,
      orderId: orderId,
    };
  }, [defaultSortedColumn, orderId]);

  const exportedDataResolver = (data: ILogsList, type: ExportType): Array<any> => {
    return data.map((item: ILog) => {
      return {
        ...item,
        createdDate: item.createdDate ? new Date(item.createdDate).toLocaleDateString('en-EG') : '',
        modifiedDate: item.modifiedDate ? new Date(item.modifiedDate).toLocaleDateString('en-EG') : '',
      };
    });
  };

  const exportFile: IExportFile = {
    fileName: 'order-changes',
    endpoint: endpoints.orders.changes,
    listResultPropName: 'results',
    method: 'search',
    payload: { ...filter, skip: 0, take: 10000 },
    dataResolver: exportedDataResolver,
    exportTypes: [ExportType.csv, ExportType.xlsx],
  };

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
      { field: 'operationType', header: t('OPERATION_TYPE'), sortable: true },
      { field: 'detail', header: t('DETAIL'), sortable: true, style: { textAlign: 'left' } },
      {
        field: 'createdDate',
        header: t('CREATED'),
        sortable: true,
        body: col => <DisplayDateText date={col.createdDate} time="12" />,
      },
      {
        field: 'modifiedDate',
        header: t('MODIFIED'),
        sortable: true,
        body: col => <DisplayDateText date={col.modifiedDate} time="12" />,
      },
      { field: 'modifiedBy', header: t('MODIFIED_BY'), sortable: true, bodyStyle: { whiteSpace: 'pre-line' } },
    ],
    [t],
  );

  const [dataSource, setDataSource] = useState<DataTableValues>({
    columns,
  });

  const loadData = useCallback(async () => {
    apiClient.search<ISearchResponse<ILogsList>>(endpoints.orders.changes, { ...filter }).then(
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
                  <h4 className="card-title mb-0">{t('CHANGES')}</h4>
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
                  exportFile={exportFile}
                />
              </DataLoader>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </ClientOnly>
  );
};
export default OrderChanges;

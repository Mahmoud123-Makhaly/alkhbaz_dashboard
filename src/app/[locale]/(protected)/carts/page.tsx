'use client';

import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnyAction } from 'redux';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next-intl/client';
import { CardBody, Card, CardHeader, Col, Row } from 'reactstrap';

import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import { changePageLoader } from '@slices/thunks';
import { preloaderTypes } from '@components/constants/layout';
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
  KeywordSearch,
  IExportFile,
  DataTableActions,
} from '@components/common';
import { ICart, ISearchResponse, ICartsFilter, ICartList } from '@app/types';
import { endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';

const Page = () => {
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const t = useTranslate('CARTS_LIST');
  const dispatch = useDispatch();
  const router = useRouter();

  const viewCartDetails = (id: string) => {
    dispatch(changePageLoader(preloaderTypes.ENABLE) as unknown as AnyAction);
    router.push(`carts/${id}`);
  };

  const columns: DataTableColumnsArray = useMemo(
    () => [
      { field: 'customerName', header: t('CUSTOMER_NAME'), body: col => col.customerName || t('GUEST') },

      {
        field: 'items',
        header: t('ITEMS'),
        body: col => col.items.length || 0,
      },
      {
        field: 'total',
        header: t('TOTAL'),
        sortable: true,
      },
      {
        field: 'discountAmount',
        header: t('DISCOUNT'),
        sortable: true,
        body: col => col.discountAmount || 0,
      },
      {
        field: 'status',
        header: t('STATUS'),
        sortable: true,
        body: col => col.status || t('N/A'),
      },
      {
        field: 'createdDate',
        header: t('CREATED'),
        sortable: true,
        body: col => <DisplayDateText date={col.createdDate} />,
      },
      {
        field: 'modifiedDate',
        header: t('MODIFIED'),
        sortable: true,
        body: col => <DisplayDateText date={col.modifiedDate} />,
      },
      {
        field: '',
        header: '',
        body: col => (
          <DataTableActions
            data={col.id}
            onView={() => viewCartDetails(col.id)}
            excludedActions={['add', 'edit', 'delete']}
          />
        ),
      },
    ],
    [],
  );

  const [dataSource, setDataSource] = useState<DataTableValues>({
    columns,
  });

  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      modifiedDate: 'desc',
    };
  }, []);

  const filter: ICartsFilter = useMemo(() => {
    return {
      sort: defaultSortedColumn,
      skip: 0,
      take: 10,
      keyword: undefined,
    };
  }, [defaultSortedColumn]);

  const sort = () => {
    const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
    setSortedColumn({
      sortField: sortField,
      sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
    });
  };

  const loadData = useCallback(
    async searchFilter => {
      apiClient.search<ISearchResponse<ICart>>(endpoints.carts.list, { ...searchFilter }).then(
        data => {
          if (data && data.results) {
            setDataSource(prev => ({
              ...prev,
              data: data.results || null,
              totalRecords: data['totalCount'],
              skipFirst: filter.skip,
            }));
            sort();
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
    },
    [filter],
  );

  useEffect(() => {
    loadData(filter);
  }, [loadData]);

  const setFilterSort = (field: string, order: number) => {
    filter.sort = { [field]: DataColumnSortTypes[order] } as ISortType;
  };

  const exportedDataResolver = (data: ICartList) => {
    return data.map((cart: ICart) => {
      return {
        ...cart,
        createdDate: cart.createdDate ? new Date(cart.createdDate).toLocaleDateString('en-EG') : '',
        modifiedDate: cart.modifiedDate ? new Date(cart.modifiedDate).toLocaleDateString('en-EG') : '',
        items: cart.items.length,
        customerName: cart.customerName || t('GUEST'),
      };
    });
  };

  const exportFile: IExportFile = {
    fileName: 'carts',
    endpoint: endpoints.carts.list,
    listResultPropName: 'results',
    method: 'search',
    payload: { ...filter, skip: 0, take: 10000 },
    dataResolver: exportedDataResolver,
  };

  const onSearch = (keyword: string) => {
    setLoadingStatus(DataLoadingStatus.pending);
    filter.skip = 0;
    filter.keyword = keyword;
    loadData(filter);
  };

  const onSearchReset = () => {
    setLoadingStatus(DataLoadingStatus.pending);
    filter.skip = 0;
    filter.keyword = '';
    loadData(filter);
  };

  const onSort = (e: DataTableStateEvent) => {
    setLoadingStatus(DataLoadingStatus.pending);
    setFilterSort(e.sortField, e.sortOrder!);
    loadData(filter);
  };

  const onPage = (e: DataTableStateEvent) => {
    setLoadingStatus(DataLoadingStatus.pending);
    filter.skip = e.first;
    loadData(filter);
  };

  return (
    <ClientOnly>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <Row>
                <Col sm={12}>
                  <h4 className="card-title mb-0">{t('CARTS_HEADER')}</h4>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Col md={6}>
                <KeywordSearch search={onSearch} reset={onSearchReset} />
              </Col>
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

export default Page;

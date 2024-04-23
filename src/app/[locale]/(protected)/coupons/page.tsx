'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col, CardHeader, Card, CardBody, Button } from 'reactstrap';
import {
  DataColumnSortTypes,
  DataLoader,
  DataLoadingStatus,
  DataTableColumnsArray,
  DataTableStateEvent,
  DataTableValues,
  DisplayDateText,
  EmptyTable,
  KeywordSearch,
  SortedColumn,
  Table,
} from '@components/common';
import ClientOnly from '@components/common/ClientOnly';
import { Utils } from '@helpers/utils';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import { ICouponsFilter, IContentItem, ISearchResponse } from '@app/types';
import { endpoints } from '@app/libs';

const Page = () => {
  const t = useTranslate('COMP_COUPONS');
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const apiClient = useAPIAuthClient();
  const toast = useToast();

  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      createdDate: 'desc',
    };
  }, []);

  const setFilterSort = (field: string, order: number) => {
    filter.sort = { [field]: DataColumnSortTypes[order] } as ISortType;
  };

  const filter: ICouponsFilter = useMemo(() => {
    return {
      sort: defaultSortedColumn,
      skip: 0,
      take: 10,
    };
  }, [defaultSortedColumn]);

  const columns: DataTableColumnsArray = useMemo(
    () => [
      { field: 'code', header: t('CODE'), body: col => col.code },
      {
        field: 'createdDate',
        header: t('CREATED'),
        sortable: true,
        body: col => <DisplayDateText date={col.createdDate} />,
      },
      {
        field: 'expirationDate',
        header: t('EXPIRE'),
        sortable: true,
        body: col => <DisplayDateText date={col.modifiedDate} />,
      },
      {
        field: 'maxUsesNumber',
        header: t('MAX_USERS'),
        sortable: true,
        body: col => col.maxUsesNumber,
      },
      {
        field: 'maxUsesPerUser',
        header: t('MAX_USES'),
        sortable: true,
        body: col => col.maxUsesPerUser,
      },
      {
        field: 'totalUsesCount',
        header: t('TOTAL_USES'),
        sortable: true,
        body: col => col.totalUsesCount,
      },
    ],
    [],
  );

  const [dataSource, setDataSource] = useState<DataTableValues>({
    columns,
  });
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
  const Sort = () => {
    const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
    setSortedColumn({
      sortField: sortField,
      sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
    });
  };
  const onSort = (e: DataTableStateEvent) => {
    setLoadingStatus(DataLoadingStatus.pending);
    setFilterSort(e.sortField, e.sortOrder!);
    loadData(filter);
  };

  const onPage = (e: DataTableStateEvent) => {
    setLoadingStatus(DataLoadingStatus.pending);
    setFilterSort(e.sortField, e.sortOrder!);
    filter.skip = e.first;
    loadData(filter);
  };

  const loadData = useCallback(
    searchFilter => {
      apiClient.search<ISearchResponse<IContentItem>>(endpoints.coupons.list, { searchFilter }).then(
        data => {
          if (data && data.results) {
            setDataSource(prev => ({
              ...prev,
              data: data.results || null,
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [filter],
  );

  useEffect(() => {
    loadData(filter);
  }, [loadData]);

  return (
    <ClientOnly>
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader>
              <Row className="g-3">
                <Col md={6}>
                  <h4 className="card-title mb-0">{t('COUPONS')}</h4>
                </Col>
                <Col md={6} className="text-end">
                  <Button color="primary" type="button">
                    <i className="ri-add-fill me-1 align-bottom"></i>
                    {t('NEW')}
                  </Button>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Col md={6}>
                <KeywordSearch search={onSearch} reset={onSearchReset} />
              </Col>
              <DataLoader status={loadingStatus}>
                {dataSource ? (
                  <Table dataSource={dataSource} onPage={onPage} sortedColumn={sortedColumn} onSort={onSort} />
                ) : (
                  <EmptyTable />
                )}
              </DataLoader>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </ClientOnly>
  );
};
export default Page;

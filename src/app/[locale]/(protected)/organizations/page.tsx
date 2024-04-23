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
  KeywordSearch,
  SortedColumn,
  DataColumnSortTypes,
  RGBY,
  IRGBY,
  SwitchButton,
} from '@components/common';
import { IOrganizationsFilter, IOrganizationsList, ISearchResponse } from '@app/types';
import { endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';

const Page = () => {
  const t = useTranslate('Organizations');
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const RGBYPreset: IRGBY = { red: 'Deleted', green: 'Approved', blue: 'New', yellow: 'Rejected' };

  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      createdDate: 'desc',
    };
  }, []);
  const filter: IOrganizationsFilter = useMemo(() => {
    return {
      sort: defaultSortedColumn,
      skip: 0,
      take: 10,
      responseGroup: 'none',
      searchPhrase: undefined,
      deepSearch: true,
    };
  }, [defaultSortedColumn]);
  const Sort = () => {
    const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
    setSortedColumn({
      sortField: sortField,
      sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
    });
  };

  const columns: DataTableColumnsArray = useMemo(
    () => [
      { field: 'name', header: t('NAME'), sortable: true },
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
        field: 'synced',
        header: t('SYNCED'),
        body: col => <SwitchButton checked={col.synced} disabled />,
      },
      {
        field: 'status',
        header: t('STATUS'),
        sortable: true,
        body: col => <RGBY preset={RGBYPreset} value={col.status} />,
      },
    ],
    [],
  );

  const [dataSource, setDataSource] = useState<DataTableValues>({
    columns,
  });

  const loadData = useCallback(async () => {
    apiClient.search<ISearchResponse<IOrganizationsList>>(endpoints.organizations.list, { ...filter }).then(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSearch = (searchPhrase: string) => {
    setLoadingStatus(DataLoadingStatus.pending);
    filter.skip = 0;
    filter.searchPhrase = searchPhrase;
    loadData();
  };
  const onSearchReset = () => {
    setLoadingStatus(DataLoadingStatus.pending);
    filter.skip = 0;
    filter.searchPhrase = '';
    loadData();
  };
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
              <h4 className="card-title mb-0">{t('ORGANIZATIONS')}</h4>
            </CardHeader>
            <CardBody>
              <Row className="g-3">
                <Col md={6}>
                  <KeywordSearch search={onSearch} reset={onSearchReset} />
                </Col>
              </Row>
            </CardBody>
            <CardBody>
              <DataLoader status={loadingStatus}>
                <Table dataSource={dataSource} sortedColumn={sortedColumn} onSort={onSort} onPage={onPage} />
              </DataLoader>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </ClientOnly>
  );
};

export default Page;

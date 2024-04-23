'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslate } from '@app/hooks';
import {
  DataLoader,
  DataLoadingStatus,
  DataTableValues,
  Table,
  DataTableColumnsArray,
  DataTableStateEvent,
  ClientOnly,
  SwitchButton,
  DisplayDateText,
  DataTableActions,
  KeywordSearch,
  SortedColumn,
  DataColumnSortTypes,
  EndSideBar,
  DeleteModal,
  IExportFile,
  ExportType,
} from '@components/common';
import { Utils } from '@helpers/utils';
import { endpoints } from '@app/libs';
import withProductDetails, { IWithProductDetailsProps } from '../ProductDetails.hoc';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { ISEOInfo } from '@app/types';
import SeoBasicForm from './SeoBasicForm';
import { IProdcutSEOFilter } from '@app/types';
import _ from 'lodash';

const SEO = ({
  id,
  catalogId,
  apiClient,
  data,
  dataLoadingStatus,
  toast,
  setDataLoadingStatus,
  loadData: loadProductData,
}: IWithProductDetailsProps) => {
  const [modalMode, setModalMode] = useState<'new' | 'edit' | null>(null);
  const [modalHeader, setModalHeader] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState(null);
  const [seoData, setSEOData] = useState<Array<ISEOInfo>>();
  const t = useTranslate('COMP_PRODUCT_DETAILS.SEO');
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const [deleteModal, setDeleteModal] = useState(false);
  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      createdDate: 'desc',
    };
  }, []);

  const filter: IProdcutSEOFilter = useMemo(() => {
    return {
      keyword: '',
      name: '',
      semanticUrl: '',
      pageTitle: '',
      metaDescription: '',
      imageAltDescription: '',
      metaKeywords: '',
      storeId: '',
      sort: defaultSortedColumn,
      skip: 0,
      take: 10,
    };
  }, [defaultSortedColumn]);

  const modalToggle = (mode: 'new' | 'edit' | null) => {
    if (mode === 'new') setSelectedId(null);
    setModalMode(mode);
    setModalHeader(t(mode === 'edit' ? 'EDIT_SEO' : 'ADD_SEO'));
  };
  const handleOnEdit = (data: any) => {
    setSelectedId(data.id);
    setSelectedData(data);
    modalToggle('edit');
  };
  const Sort = () => {
    const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
    setSortedColumn({
      sortField: sortField,
      sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
    });
  };
  const columns: DataTableColumnsArray = useMemo(
    () => [
      { field: 'storeId', header: t('STORE'), sortable: true },
      {
        field: 'metaDescription',
        header: t('META_DESCRIPTION'),
        sortable: true,
      },
      {
        field: 'metaKeywords',
        header: t('META_KEYWORDS'),
        sortable: true,
      },
      {
        field: 'isActive',
        header: t('IS_ACTIVE'),
        sortable: true,
        body: col => <SwitchButton checked={col.isActive} disabled />,
      },
      {
        field: 'id',
        header: '',
        style: { width: '80px' },
        body: col => (
          <DataTableActions
            data={col}
            onEdit={handleOnEdit}
            onDelete={handleOnDelete}
            excludedActions={['view', 'add']}
          />
        ),
      },
    ],
    [],
  );
  const [dataSource, setDataSource] = useState<DataTableValues>({
    columns,
  });
  const loadData = useCallback(
    async searchFilter => {
      Sort();
      setDataLoadingStatus(DataLoadingStatus.done);
    },
    [filter],
  );
  useEffect(() => {
    if (data?.info?.seoInfos) setSEOData([...(data?.info?.seoInfos || [])]);
  }, [data?.info?.seoInfos]);
  const onSearch = (keyword: string) => {
    setDataLoadingStatus(DataLoadingStatus.pending);
    filter.skip = 0;
    filter.keyword = keyword;
    loadData(filter);
  };
  const onSearchReset = () => {
    setDataLoadingStatus(DataLoadingStatus.pending);
    filter.skip = 0;
    filter.keyword = '';
    loadData(filter);
  };
  const setFilterSort = (field: string, order: number) => {
    filter.sort = { [field]: DataColumnSortTypes[order] } as ISortType;
  };
  const onSort = (e: DataTableStateEvent) => {
    setDataLoadingStatus(DataLoadingStatus.pending);
    setFilterSort(e.sortField, e.sortOrder!);
    loadData(filter);
  };
  const onPage = (e: DataTableStateEvent) => {
    setDataLoadingStatus(DataLoadingStatus.pending);
    setFilterSort(e.sortField, e.sortOrder!);
    filter.skip = e.first;
    loadData(filter);
  };
  const handleFormSubmit = (): void => {
    modalToggle(null);
    setDataLoadingStatus(DataLoadingStatus.pending);
    loadProductData();
  };
  const handleOnDelete = (data: any) => {
    setSelectedId(data.id);
    setDeleteModal(true);
  };
  const handleDelete = (): void => {
    setDeleteModal(false);
    setDataLoadingStatus(DataLoadingStatus.pending);
    const seo = data?.info?.seoInfos;
    _.remove(seo || [], seoInfo => seoInfo.id === selectedId);
    const updatedData = { ...data?.info, seoInfos: seo };
    apiClient.create(endpoints.products.update, updatedData).then(
      data => {
        if (data) {
          setSelectedId(null);
          setTimeout(() => {
            toast.success(t('DELETE_SEO_SUCCESS_MSG'));
            loadData(filter);
            loadProductData();
          }, 300);
        } else {
          setDataLoadingStatus(DataLoadingStatus.done);
          toast.error(t('ERR_DELETE_SEO_MSG'));
        }
      },
      err => {
        setSelectedId(null);
        toast.error(err.toString());
        setDataLoadingStatus(DataLoadingStatus.done);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  //Advanced Search

  useEffect(() => {
    if (seoData) {
      setDataSource(prev => ({
        ...prev,
        data: seoData,
        totalRecords: seoData.length,
        pageSize: seoData.length,
        skipFirst: filter.skip,
      }));
    }
  }, [filter.skip, seoData]);

  return (
    <ClientOnly>
      <DeleteModal show={deleteModal} onDeleteClick={() => handleDelete()} onCloseClick={() => setDeleteModal(false)} />
      {seoData && (
        <Row>
          <Col md={12}>
            <Card>
              <CardHeader>
                <Row className="g-3">
                  <Col md={6}>
                    <h4 className="card-title mb-0">{t('SEO')}</h4>
                  </Col>
                  <Col md={6} className="text-end">
                    <Button color="primary" type="button" onClick={() => modalToggle('new')}>
                      <i className="ri-add-fill me-1 align-bottom"></i> {t('NEW')}
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row className="g-3">
                  <Col md={6}>{/* <KeywordSearch search={onSearch} reset={onSearchReset} /> */}</Col>
                </Row>
              </CardBody>
              <CardBody>
                <DataLoader status={dataLoadingStatus}>
                  <Table dataSource={dataSource} sortedColumn={sortedColumn} onSort={onSort} onPage={onPage} />
                </DataLoader>
              </CardBody>
            </Card>
          </Col>
          <EndSideBar isOpen={!!modalMode} title={modalHeader} toggle={() => modalToggle(null)}>
            {data?.info && (
              <SeoBasicForm
                mode={modalMode}
                onCancel={() => modalToggle(null)}
                onSubmit={handleFormSubmit}
                product={data?.info}
                seoId={selectedId}
                seoItem={selectedData}
              />
            )}
          </EndSideBar>
        </Row>
      )}
    </ClientOnly>
  );
};
export default withProductDetails(SEO);

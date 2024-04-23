'use client';
import { CardBody, Card, CardHeader, Col, Row, Button } from 'reactstrap';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next-intl/client';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { changePageLoader } from '@slices/thunks';
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
  SwitchButton,
  EndSideBar,
  DataTableActions,
  IExportFile,
  ExportType,
  DeleteModal,
} from '@components/common';
import { ImageWithFallback } from '@components/common';
import NoImage from '@assets/img/no-image.png';
import { IProductsList, IProductsFilter, ISearchResponse, IProductItem } from '@app/types';
import { endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';
import { ProductBasicForm, ProductAdvancedSearchForm } from '@components/pages';
import { preloaderTypes } from '@components/constants/layout';
const Page = () => {
  const t = useTranslate('Products');
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const [modalMode, setModalMode] = useState<'new' | 'edit' | null>(null);
  const [modalHeader, setModalHeader] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const apiClient = useAPIAuthClient();
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatch();
  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      createdDate: 'desc',
    };
  }, []);
  const filter: IProductsFilter = useMemo(() => {
    return {
      take: 10,
      skip: 0,
      sort: defaultSortedColumn,
      searchPhrase: undefined,
      withHidden: false,
      searchInVariations: true,
      isFuzzySearch: true,
      responseGroup: 'none',
    };
  }, [defaultSortedColumn]);

  const exportedDataResolver = (data: IProductsList, type: ExportType): Array<any> => {
    return data.map((item: IProductItem) => {
      return {
        ...item,
        createdDate: item.createdDate ? new Date(item.createdDate).toLocaleDateString('en-EG') : '',
        modifiedDate: item.modifiedDate ? new Date(item.modifiedDate).toLocaleDateString('en-EG') : '',
      };
    });
  };

  const exportFile: IExportFile = {
    fileName: 'products',
    endpoint: endpoints.products.list,
    listResultPropName: 'items',
    method: 'search',
    payload: { ...filter, skip: 0, take: 10000 },
    dataResolver: exportedDataResolver,
  };
  const Sort = () => {
    const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
    setSortedColumn({
      sortField: sortField,
      sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
    });
  };
  const modalToggle = (mode: 'new' | 'edit' | null) => {
    if (mode === 'new') setSelectedId(null);
    setModalMode(mode);
    setModalHeader(t(mode === 'edit' ? 'EDIT_PRODUCT' : 'ADD_PRODUCT'));
  };

  const handleOnEdit = (id: string) => {
    setSelectedId(id);
    modalToggle('edit');
  };

  const viewProductDetails = (id: string, catalogId: string) => {
    dispatch(changePageLoader(preloaderTypes.ENABLE) as unknown as AnyAction);
    router.push(`products/${id}?catalogId=${catalogId}`);
  };

  const columns: DataTableColumnsArray = useMemo(
    () => [
      {
        field: 'imgSrc',
        header: t('THUMB'),
        body: col => (
          <ImageWithFallback
            className="flex-shrink-0 me-3 avatar-sm bg-light rounded"
            src={col.imgSrc ? col.imgSrc : NoImage.src}
            width={0}
            height={0}
            alt={col.name}
            loading="lazy"
            sizes="100vw"
            style={{ height: 'auto' }}
            fallbackSrc={NoImage.src}
          />
        ),
      },
      { field: 'code', header: t('CODE'), sortable: true },
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
        field: 'isBuyable',
        header: t('BUYABLE'),
        sortable: true,
        body: col => <SwitchButton checked={col.isBuyable} disabled />,
      },
      {
        field: 'synced',
        header: t('SYNCED'),
        body: col => <SwitchButton checked={col.synced} disabled />,
      },
      {
        field: 'id',
        header: '',
        body: col => (
          <DataTableActions
            data={col.id}
            onEdit={handleOnEdit}
            onDelete={handleOnDelete}
            onView={() => viewProductDetails(col.id, col.catalogId)}
            excludedActions={['add']}
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
      apiClient.search<ISearchResponse<IProductsList>>(endpoints.products.list, { ...searchFilter }).then(
        data => {
          if (data && data.items) {
            setDataSource(prev => ({
              ...prev,
              data: data.items || null,
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
    },
    [filter],
  );

  useEffect(() => {
    loadData(filter);
  }, [loadData]);

  const onSearch = (searchPhrase: string) => {
    setLoadingStatus(DataLoadingStatus.pending);
    filter.skip = 0;
    filter.searchPhrase = searchPhrase;
    loadData(filter);
  };
  const onSearchReset = () => {
    setLoadingStatus(DataLoadingStatus.pending);
    filter.skip = 0;
    filter.searchPhrase = '';
    loadData(filter);
  };
  const setFilterSort = (field: string, order: number) => {
    filter.sort = { [field]: DataColumnSortTypes[order] } as ISortType;
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
  const handleFormSubmit = (): void => {
    modalToggle(null);
    setLoadingStatus(DataLoadingStatus.pending);
    loadData(filter);
  };
  const handleOnDelete = (id: string) => {
    setSelectedId(id);
    setDeleteModal(true);
  };
  const handleDelete = (): void => {
    setDeleteModal(false);
    setLoadingStatus(DataLoadingStatus.pending);
    apiClient.delete(endpoints.products.delete, { ids: selectedId }).then(
      data => {
        if (data) {
          setSelectedId(null);
          setTimeout(() => {
            toast.success(t('DELETE_PRODUCT_SUCCESS_MSG'));
            loadData(filter);
          }, 300);
        } else {
          setLoadingStatus(DataLoadingStatus.done);
          toast.error(t('ERR_DELETE_PRODUCT_MSG'));
        }
      },
      err => {
        setSelectedId(null);
        toast.error(err.toString());
        setLoadingStatus(DataLoadingStatus.done);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  //Advanced Search
  const resetFilter = () => {
    filter.currency = undefined;
    filter.pricelists = undefined;
    filter.startDate = undefined;
    filter.endDate = undefined;
    filter.storeId = undefined;
    filter.catalogIds = undefined;
    filter.searchPhrase = undefined;
    filter.sort = defaultSortedColumn;
    filter.skip = 0;
    filter.take = 10;
    filter.responseGroup = 'none';
    filter.searchPhrase = undefined;
  };
  const onAdvancedSearchSubmit = formValues => {
    resetFilter();
    if (formValues.searchPhrase) filter.searchPhrase = formValues.searchPhrase;
    if (formValues.currency) filter.currency = formValues.currency;
    if (formValues.pricelists) filter.pricelists = formValues.pricelists;
    if (formValues.startDate) filter.startDate = formValues.startDate;
    if (formValues.endDate) filter.endDate = formValues.endDate;
    if (formValues.storeId) filter.storeId = formValues.storeId;
    if (formValues.catalogIds) filter.catalogIds = formValues.catalogIds;
    setLoadingStatus(DataLoadingStatus.pending);
    loadData(filter);
  };
  const onAdvancedSearchCancel = () => {
    resetFilter();
    setLoadingStatus(DataLoadingStatus.pending);
    loadData(filter);
  };
  return (
    <ClientOnly>
      <DeleteModal show={deleteModal} onDeleteClick={() => handleDelete()} onCloseClick={() => setDeleteModal(false)} />
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader>
              <Row className="g-3">
                <Col md={6}>
                  <h4 className="card-title mb-0">{t('PRODUCTS')}</h4>
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
                <Col lg={6}>
                  <KeywordSearch search={onSearch} reset={onSearchReset} />
                </Col>
              </Row>
            </CardBody>
            <CardBody>
              <DataLoader status={loadingStatus}>
                <Table
                  dataSource={dataSource}
                  sortedColumn={sortedColumn}
                  onSort={onSort}
                  onPage={onPage}
                  advancedSearch={
                    <ProductAdvancedSearchForm
                      onSubmit={onAdvancedSearchSubmit}
                      onCancel={onAdvancedSearchCancel}
                      initialValues={filter}
                    />
                  }
                  exportFile={exportFile}
                />
              </DataLoader>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <EndSideBar isOpen={!!modalMode} title={modalHeader} toggle={() => modalToggle(null)} width="40%">
        <ProductBasicForm
          mode={modalMode}
          onCancel={() => modalToggle(null)}
          onSubmit={handleFormSubmit}
          id={selectedId}
        />
      </EndSideBar>
    </ClientOnly>
  );
};

export default Page;

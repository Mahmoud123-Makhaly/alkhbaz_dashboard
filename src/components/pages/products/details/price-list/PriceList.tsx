'use client';
import { CardBody, Card, CardHeader, Col, Row, Button } from 'reactstrap';
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
  DisplayDateText,
  EndSideBar,
  KeywordSearch,
  SortedColumn,
  DataColumnSortTypes,
  SwitchButton,
  DeleteModal,
  DataTableActions,
} from '@components/common';
import { IPriceListItem } from '@app/types';
import withProductDetails, { IWithProductDetailsProps } from '../ProductDetails.hoc';
import { Utils } from '@helpers/utils';
import PriceListBasicForm from './PriceListBasicForm';
import { endpoints } from '@app/libs';
const PriceList = ({
  id,
  catalogId,
  apiClient,
  data,
  dataLoadingStatus,
  toast,
  setDataLoadingStatus,
  loadData,
}: IWithProductDetailsProps) => {
  const t = useTranslate('COMP_PRODUCT_DETAILS.PRICE_LIST');
  const [modalMode, setModalMode] = useState<'new' | 'edit' | null>(null);
  const [modalHeader, setModalHeader] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const [priceListsData, setPriceListsData] = useState<Array<any>>();

  const columns: DataTableColumnsArray = useMemo(
    () => [
      { field: 'name', header: t('NAME'), sortable: true },
      { field: 'catalog', header: t('CATALOG'), sortable: true },
      { field: 'currency', header: t('CURRENCY') },
      { field: 'list', header: t('LIST') },
      { field: 'sale', header: t('SALE') },
      { field: 'minQuantity', header: t('MIN_QUANTITY') },
      { field: 'effectiveValue', header: t('EFFECTIVE') },
      {
        field: 'id',
        header: '',
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
  const onPage = (e: DataTableStateEvent) => {
    //setDataLoadingStatus(DataLoadingStatus.pending);
    //setFilterSort(e.sortField, e.sortOrder!);
    //filter.skip = e.first;
    //loadFulfillmentData(filter);
  };
  useEffect(() => {
    if (data?.prices && data.info) {
      const priceList = data.prices.filter(x => x.prices.some(z => z.productId === data.info?.id));
      if (priceList) {
        const priceListSource = priceList.map(x => {
          return {
            id: x.id,
            name: x.name,
            catalog: data.info?.outlines
              ? data.info.outlines[0].items?.find(x => x.seoObjectType === 'Catalog')?.name || t('N/A')
              : t('N/A'),
            currency: x.currency,
            sale: x.prices.find(p => p.productId === data.info?.id)?.sale || 0,
            list: x.prices.find(p => p.productId === data.info?.id)?.list || 0,
            minQuantity: x.prices.find(p => p.productId === data.info?.id)?.minQuantity || 0,
            effectiveValue: x.prices.find(p => p.productId === data.info?.id)?.effectiveValue || 0,
            priceId: x.prices.find(p => p.productId === data.info?.id)?.id || '',
          };
        });
        setPriceListsData(priceListSource);
      }
    }
  }, [data?.prices]);

  const modalToggle = (mode: 'new' | 'edit' | null) => {
    if (mode === 'new') setSelectedId(id);
    setModalMode(mode);
    setModalHeader(t(mode === 'edit' ? 'EDIT_PRICE_LIST' : 'ADD_PRICE_LIST'));
  };
  const handleOnEdit = (data: any) => {
    setSelectedId(data.id);
    setSelectedData(data);

    modalToggle('edit');
  };
  const handleOnDelete = data => {
    setSelectedId(data.priceId);
    setDeleteModal(true);
  };
  const handleDelete = (): void => {
    setDeleteModal(false);
    setDataLoadingStatus(DataLoadingStatus.pending);
    apiClient.delete(endpoints.products.deleteProductPrice, { urlParams: { id: selectedId } }).then(
      data => {
        if (data && data.status === 204) {
          setSelectedId(null);
          setTimeout(() => {
            toast.success(t('DELETE_PRICE_LIST_SUCCESS_MSG'));
            loadData();
          }, 300);
        } else {
          setDataLoadingStatus(DataLoadingStatus.done);
          toast.error(t('ERR_DELETE_PRICE_LIST_MSG'));
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
  const handleFormSubmit = (): void => {
    modalToggle(null);
    setDataLoadingStatus(DataLoadingStatus.pending);
    loadData();
  };
  useEffect(() => {
    if (priceListsData) {
      setDataSource(prev => ({
        ...prev,
        data: priceListsData,
        totalRecords: priceListsData.length,
        pageSize: priceListsData.length,
      }));
    }
  }, [priceListsData]);
  return (
    <ClientOnly>
      <DeleteModal show={deleteModal} onDeleteClick={() => handleDelete()} onCloseClick={() => setDeleteModal(false)} />
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader>
              <Row className="g-3">
                <Col md={6}>
                  <h4 className="card-title mb-0">{t('HEADER_PRICE_LIST')}</h4>
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
                <Table
                  dataSource={dataSource}
                  sortedColumn={sortedColumn}
                  onPage={onPage}
                  //onSort={onSort}
                />
              </DataLoader>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <EndSideBar isOpen={!!modalMode} title={modalHeader} toggle={() => modalToggle(null)}>
        <PriceListBasicForm
          mode={modalMode}
          onCancel={() => modalToggle(null)}
          onSubmit={handleFormSubmit}
          id={selectedId}
          priceListItem={selectedData}
          priceListData={priceListsData}
          productId={id}
        />
      </EndSideBar>
    </ClientOnly>
  );
};
export default withProductDetails(PriceList);

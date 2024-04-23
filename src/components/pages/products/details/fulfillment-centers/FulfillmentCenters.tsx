'use client';

import { CardBody, Card, CardHeader, Col, Row, Button } from 'reactstrap';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslate } from '@app/hooks';
import { IProductFulfillmentCenterFilter, IProductFulfillmentCenter } from '@app/types';
import { endpoints } from '@app/libs';

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
  SortedColumn,
  SwitchButton,
  DataTableActions,
  DeleteModal,
} from '@components/common';
import withProductDetails, { IWithProductDetailsProps } from '../ProductDetails.hoc';
import FulfillmentCenterBasicForm from './FulfillmentCenterBasicForm';

const FulfillmentCenters = ({
  id,
  catalogId,
  apiClient,
  data,
  dataLoadingStatus,
  toast,
  setDataLoadingStatus,
  loadData,
}: IWithProductDetailsProps) => {
  const [modalMode, setModalMode] = useState<'new' | 'edit' | null>(null);
  const [modalHeader, setModalHeader] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<IProductFulfillmentCenter>();
  const [fulfillmentData, setFulfillmentData] = useState<Array<IProductFulfillmentCenter>>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const [deleteModal, setDeleteModal] = useState(false);

  const t = useTranslate('COMP_PRODUCT_DETAILS.FULFILLMENT_CENTERS');
  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      createdDate: 'desc',
    };
  }, []);

  const filter: IProductFulfillmentCenterFilter = useMemo(() => {
    return {
      keyword: undefined,
      sort: defaultSortedColumn,
      skip: 0,
      take: 1000,
    };
  }, [defaultSortedColumn]);

  const columns: DataTableColumnsArray = useMemo(
    () => [
      { field: 'fulfillmentCenterName', header: t('NAME'), sortable: true },

      { field: 'inStockQuantity', header: t('STOCK') },
      { field: 'reservedQuantity', header: t('RESERVED') },
      {
        field: 'allowBackorder',
        header: t('BACK_ORDER'),
        sortable: true,
        body: col => <SwitchButton checked={col.allowBackorder} disabled />,
      },
      {
        field: 'allowPreorder',
        header: t('PRE_ORDER'),
        body: col => <SwitchButton checked={col.allowPreorder} disabled />,
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

  const modalToggle = (mode: 'new' | 'edit' | null) => {
    if (mode === 'new') setSelectedId(id);
    setModalMode(mode);
    setModalHeader(t(mode === 'edit' ? 'EDIT_FULFILLMENT_CENTER' : 'ADD_FULFILLMENT_CENTER'));
  };

  const deleteData = useCallback(async (value: IProductFulfillmentCenter) => {
    setDataLoadingStatus(DataLoadingStatus.pending);
    setDeleteModal(false);
    value.inStockQuantity = 0;
    value.reservedQuantity = 0;
    value.reorderMinQuantity = 0;
    value.backorderQuantity = 0;
    value.preorderQuantity = 0;
    apiClient
      .update<IProductFulfillmentCenter>(endpoints.products.fulfillmentCenters, { ...value, urlParams: { id } })
      .then(
        data => {
          if (data) {
            toast.success(t('DELETE_SUCCESS'));
            setTimeout(() => {
              loadData();
            }, 500);
          } else {
            setDataLoadingStatus(DataLoadingStatus.done);
            toast.error(t('ERR_DELETE_GENERIC_MSG'));
          }
        },
        err => {
          toast.error(err.toString());
          setDataLoadingStatus(DataLoadingStatus.done);
        },
      );
  }, []);

  const handleOnDelete = (data: any) => {
    setSelectedId(id);
    setSelectedData(data);
    setDeleteModal(true);
  };

  useEffect(() => {
    if (data?.fulfillmentCenters) setFulfillmentData([...data?.fulfillmentCenters]);
  }, [data?.fulfillmentCenters]);

  const handleOnEdit = (data: any) => {
    setSelectedId(id);
    setSelectedData(data);
    modalToggle('edit');
  };

  const onPage = (e: DataTableStateEvent) => {};

  const handleFormSubmit = (): void => {
    modalToggle(null);
    setDataLoadingStatus(DataLoadingStatus.pending);
    loadData();
  };

  useEffect(() => {
    if (fulfillmentData) {
      var filteredData = fulfillmentData.filter(
        item =>
          item.inStockQuantity != 0 ||
          item.preorderQuantity != 0 ||
          item.reservedQuantity != 0 ||
          item.backorderQuantity != 0 ||
          item.reorderMinQuantity != 0,
      );

      setDataSource(prev => ({
        ...prev,
        data: filteredData,
        totalRecords: filteredData.length,
        pageSize: filteredData.length,
        skipFirst: filter.skip,
      }));
    }
  }, [filter.skip, fulfillmentData]);

  return (
    <ClientOnly>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => deleteData(selectedData!)}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader>
              <Row className="g-3">
                <Col md={6}>
                  <h4 className="card-title mb-0">{t('HEADER_FULFILLMENT_CENTERS')}</h4>
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
                <Table dataSource={dataSource} sortedColumn={sortedColumn} onPage={onPage} />
              </DataLoader>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <EndSideBar isOpen={!!modalMode} title={modalHeader} toggle={() => modalToggle(null)}>
        <FulfillmentCenterBasicForm
          mode={modalMode}
          onCancel={() => modalToggle(null)}
          onSubmit={handleFormSubmit}
          id={selectedId}
          fulfillment={selectedData}
          fulfillmentsData={data?.fulfillmentCenters}
        />
      </EndSideBar>
    </ClientOnly>
  );
};
export default withProductDetails(FulfillmentCenters);

'use client';

import { CardBody, Card, CardHeader, Col, Row, Button } from 'reactstrap';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import {
  DataLoader,
  DataLoadingStatus,
  DataTableValues,
  Table,
  DataTableColumnsArray,
  ClientOnly,
  DataTableActions,
  SortedColumn,
  EndSideBar,
  DeleteModal,
  IExportFile,
} from '@components/common';
import { IPropertiesAttribute } from '@app/types';
import { endpoints } from '@app/libs';
import OrderSourceBasicForm from './OrderSourceBasicForm';

interface IOrderSourcesProps {
  propertyId: string;
}
const OrderSources = ({ propertyId }: IOrderSourcesProps) => {
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const [modalMode, setModalMode] = useState<'new' | 'edit' | null>(null);
  const [modalHeader, setModalHeader] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | Partial<IPropertiesAttribute> | null>(null);
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const [deleteModal, setDeleteModal] = useState(false);
  const t = useTranslate('COMP_OrderSources');

  const exportFile: IExportFile = {
    fileName: 'order-sources',
    endpoint: endpoints.dictionaries.orderSource.list,
    method: 'select',
    payload: { urlParams: { propertyId } },
  };

  const modalToggle = (mode: 'new' | 'edit' | null) => {
    setModalHeader(t(mode === 'edit' ? 'EDIT_DATA_SOURCE' : 'ADD_DATA_SOURCE'));
    if (mode === 'new') {
      setModalMode(mode);
      setSelectedId({
        name: '',
      });
    } else if (mode === 'edit') {
      setModalMode(mode);
    } else {
      setModalMode(mode);
      setSelectedId(null);
    }
  };

  const handleOnEdit = (data: IPropertiesAttribute) => {
    setSelectedId(data);
    modalToggle('edit');
  };

  const columns: DataTableColumnsArray = useMemo(
    () => [
      { field: 'name', header: t('NAME') },
      {
        field: 'id',
        header: '',
        style: { width: '80px' },
        body: col => (
          <DataTableActions
            data={col.id}
            onEdit={id => handleOnEdit(col)}
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

  const loadData = useCallback(async () => {
    apiClient
      .select<Array<IPropertiesAttribute>>(endpoints.dictionaries.orderSource.list, { urlParams: { propertyId } })
      .then(
        data => {
          if (data) {
            setDataSource(prev => ({
              ...prev,
              data: data || null,
              totalRecords: data.length,
              pageSize: data.length,
              skipFirst: 0,
            }));
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
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFormSubmit = (): void => {
    modalToggle(null);
    setLoadingStatus(DataLoadingStatus.pending);
    loadData();
  };

  const handleOnDelete = (id: string) => {
    setSelectedId(id);
    setDeleteModal(true);
  };
  const handleDelete = (): void => {
    setDeleteModal(false);
    setLoadingStatus(DataLoadingStatus.pending);
    apiClient.delete(endpoints.dictionaries.orderSource.delete, { urlParams: { propertyId }, ids: selectedId }).then(
      data => {
        if (data && data.status === 204) {
          setSelectedId(null);
          setTimeout(() => {
            toast.success(t('DELETE_ORDER_SOURCE_SUCCESS_MSG'));
            loadData();
          }, 500);
        } else {
          setLoadingStatus(DataLoadingStatus.done);
          toast.error(t('ERR_DELETE_ORDER_SOURCE_MSG'));
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

  return (
    <ClientOnly>
      <DeleteModal show={deleteModal} onDeleteClick={() => handleDelete()} onCloseClick={() => setDeleteModal(false)} />
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader>
              <Row className="g-3">
                <Col md={6}>
                  <h4 className="card-title mb-0">{t('ORDER_SOURCE_TITLE')}</h4>
                </Col>
                <Col md={6} className="text-end">
                  <Button color="primary" type="button" onClick={() => modalToggle('new')}>
                    <i className="ri-add-fill me-1 align-bottom"></i> {t('NEW')}
                  </Button>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <DataLoader status={loadingStatus}>
                <Table dataSource={dataSource} sortedColumn={sortedColumn} onPage={e => {}} exportFile={exportFile} />
              </DataLoader>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <EndSideBar isOpen={!!modalMode} title={modalHeader} toggle={() => modalToggle(null)}>
        <OrderSourceBasicForm
          mode={modalMode}
          onCancel={() => modalToggle(null)}
          onSubmit={handleFormSubmit}
          data={selectedId as IPropertiesAttribute | null}
          propertyId={propertyId}
        />
      </EndSideBar>
    </ClientOnly>
  );
};

export default OrderSources;

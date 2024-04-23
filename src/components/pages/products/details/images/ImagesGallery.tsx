'use client';

import { CardBody, Card, CardHeader, Col, Row, Button } from 'reactstrap';
import { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
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
  DataTableActions,
  DeleteModal,
} from '@components/common';
import { ImageWithFallback } from '@components/common';
import NoImage from '@assets/img/no-image.png';
import withProductDetails, { IWithProductDetailsProps } from '../ProductDetails.hoc';
import { Utils } from '@helpers/utils';
import { endpoints } from '@app/libs';
import { IProductFulfillmentCenterFilter, IProductImage } from '@app/types';
import AddProductImagesBasicForm from './AddProductImagesBasicForm';
import EditProductImageBasicForm from './EditProductImageBasicForm';
const ImagesGallery = ({
  id,
  catalogId,
  apiClient,
  data,
  dataLoadingStatus,
  toast,
  setDataLoadingStatus,
  loadData,
}: IWithProductDetailsProps) => {
  const t = useTranslate('COMP_PRODUCT_DETAILS.IMAGES_GALLERY');
  const [modalMode, setModalMode] = useState<'new' | 'edit' | null>(null);
  const [modalHeader, setModalHeader] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const [imageData, setImageData] = useState<Array<IProductImage>>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
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
  const Sort = () => {
    const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
    setSortedColumn({
      sortField: sortField,
      sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
    });
  };
  const columns: DataTableColumnsArray = useMemo(
    () => [
      {
        field: 'url',
        header: t('URL'),
        body: col => (
          <ImageWithFallback
            className="flex-shrink-0 me-3 avatar-sm bg-light rounded"
            src={col.url || NoImage.src}
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
      { field: 'name', header: t('NAME') },
      { field: 'group', header: t('GROUP') },
      {
        field: 'languageCode',
        header: t('LANGUAGE_CODE'),
        sortable: true,
      },
      { field: 'sortOrder', header: t('ORDER') },
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
    if (mode === 'new') setSelectedId(null);
    setModalMode(mode);
    setModalHeader(t(mode === 'edit' ? 'EDIT_IMAGE_CENTER' : 'ADD_IMAGE_CENTER'));
  };
  useEffect(() => {
    if (data?.info?.images) setImageData(data?.info?.images);
  }, [data?.info?.images]);
  const handleOnEdit = (data: any) => {
    setSelectedId(data.id);
    setSelectedData(data);
    modalToggle('edit');
  };
  const onPage = (e: DataTableStateEvent) => {
    //setDataLoadingStatus(DataLoadingStatus.pending);
    //setFilterSort(e.sortField, e.sortOrder!);
    //filter.skip = e.first;
  };
  const handleFormSubmit = (): void => {
    modalToggle(null);
    setDataLoadingStatus(DataLoadingStatus.pending);
    loadData();
  };
  const handleOnDelete = (data: any) => {
    setSelectedId(data.id);
    setDeleteModal(true);
  };
  const handleDelete = (): void => {
    setDeleteModal(false);
    const newImageObj: Array<IProductImage> = data?.info?.images || [];
    _.remove(newImageObj, item => item.id === selectedId);
    setDataLoadingStatus(DataLoadingStatus.pending);
    apiClient.create(endpoints.products.update, { ...data?.info, images: newImageObj }).then(
      data => {
        if (data) {
          setSelectedId(null);
          setTimeout(() => {
            toast.success(t('DELETE_IMAGES_SUCCESS_MSG'));
            loadData();
          }, 300);
        } else {
          setDataLoadingStatus(DataLoadingStatus.done);
          toast.error(t('ERR_DELETE_IMAGES_MSG'));
        }
      },
      err => {
        setSelectedId(null);
        toast.error(err.toString());
        setDataLoadingStatus(DataLoadingStatus.done);
      },
    );
    //eslint-disable-next-line react-hooks/exhaustive-deps
  };
  useEffect(() => {
    if (imageData) {
      setDataSource(prev => ({
        ...prev,
        data: imageData,
        totalRecords: imageData.length,
        skipFirst: filter.skip,
        pageSize: imageData.length,
      }));
    }
  }, [filter.skip, imageData]);
  return (
    <ClientOnly>
      <DeleteModal show={deleteModal} onDeleteClick={() => handleDelete()} onCloseClick={() => setDeleteModal(false)} />
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader>
              <Row className="g-3">
                <Col md={6}>
                  <h4 className="card-title mb-0">{t('HEADER_IMAGES')}</h4>
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
        {modalMode === 'new' ? (
          <AddProductImagesBasicForm
            onCancel={() => modalToggle(null)}
            onSubmit={handleFormSubmit}
            id={selectedId}
            product={data?.info!}
          />
        ) : (
          <EditProductImageBasicForm
            mode={modalMode}
            onCancel={() => modalToggle(null)}
            onSubmit={handleFormSubmit}
            id={selectedId}
            image={selectedData}
            product={data?.info}
          />
        )}
      </EndSideBar>
    </ClientOnly>
  );
};
export default withProductDetails(ImagesGallery);

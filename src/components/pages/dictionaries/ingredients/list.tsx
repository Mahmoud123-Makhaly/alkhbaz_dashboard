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
  DataTableStateEvent,
  ClientOnly,
  DataTableActions,
  KeywordSearch,
  SortedColumn,
  DataColumnSortTypes,
  EndSideBar,
  DeleteModal,
  IExportFile,
} from '@components/common';
import { ISearchResponse, IDictionaryItems, IDictionariesFilter, IDictionaryItem } from '@app/types';
import { endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';
import IngredientBasicForm from './IngredientBasicForm';
import _ from 'lodash';

interface IIngredientsDictionaryProps {
  propertyId: string;
}
const IngredientsDictionary = ({ propertyId }: IIngredientsDictionaryProps) => {
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const [modalMode, setModalMode] = useState<'new' | 'edit' | null>(null);
  const [modalHeader, setModalHeader] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | IDictionaryItem | null>(null);
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const [deleteModal, setDeleteModal] = useState(false);
  const t = useTranslate('COMP_IngredientsDictionary');
  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      alias: 'asc',
    };
  }, []);
  const filter: IDictionariesFilter = useMemo(() => {
    return {
      sort: defaultSortedColumn,
      propertyIds: [propertyId],
      skip: 0,
      take: 10,
      keyword: undefined,
    };
  }, [defaultSortedColumn, propertyId]);

  const exportFile: IExportFile = {
    fileName: 'ingredients',
    endpoint: endpoints.dictionaries.ingredients.list,
    listResultPropName: 'results',
    method: 'search',
    payload: { ...filter, skip: 0, take: 10000 },
  };

  const modalToggle = (mode: 'new' | 'edit' | null) => {
    setModalHeader(t(mode === 'edit' ? 'EDIT_INGREDIENTS' : 'ADD_INGREDIENTS'));
    if (mode === 'new') {
      setModalMode(mode);
      setSelectedId({
        propertyId: '',
        alias: '',
        sortOrder: (_.max(dataSource.data?.map(x => x.sortOrder)) || 0) + 1,
        localizedValues: [
          {
            languageCode: 'en-US',
            value: '',
          },
          {
            languageCode: 'ar-EG',
            value: '',
          },
        ],
        id: '',
      });
    } else if (mode === 'edit') {
      setModalMode(mode);
    } else {
      setModalMode(mode);
      setSelectedId(null);
    }
  };

  const handleOnEdit = (data: IDictionaryItem) => {
    setSelectedId(data);
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
      { field: 'alias', header: t('ALIAS'), sortable: true },
      {
        field: 'sortOrder',
        header: t('ORDER'),
        sortable: true,
      },
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

  const loadData = useCallback(
    async searchFilter => {
      apiClient
        .search<ISearchResponse<IDictionaryItems>>(endpoints.dictionaries.ingredients.list, { ...searchFilter })
        .then(
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
    },
    [filter],
  );

  useEffect(() => {
    loadData(filter);
  }, [loadData]);

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
    apiClient.delete(endpoints.dictionaries.ingredients.delete, { ids: selectedId }).then(
      data => {
        if (data && data.status === 200) {
          setSelectedId(null);
          setTimeout(() => {
            toast.success(t('DELETE_INGREDIENTS_SUCCESS_MSG'));
            loadData(filter);
          }, 500);
        } else {
          setLoadingStatus(DataLoadingStatus.done);
          toast.error(t('ERR_DELETE_INGREDIENTS_MSG'));
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
                  <h4 className="card-title mb-0">{t('INGREDIENTS_TITLE')}</h4>
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
                <Col md={6}>
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
                  exportFile={exportFile}
                />
              </DataLoader>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <EndSideBar isOpen={!!modalMode} title={modalHeader} toggle={() => modalToggle(null)}>
        <IngredientBasicForm
          mode={modalMode}
          onCancel={() => modalToggle(null)}
          onSubmit={handleFormSubmit}
          data={selectedId as IDictionaryItem | null}
          propertyId={propertyId}
        />
      </EndSideBar>
    </ClientOnly>
  );
};

export default IngredientsDictionary;

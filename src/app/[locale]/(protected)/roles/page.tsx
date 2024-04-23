'use client';
import { CardBody, Button, Card, CardHeader, Col, Row } from 'reactstrap';
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
  SwitchButton,
  IExportFile,
  ExportType,
  DeleteModal,
} from '@components/common';
import { IRolesList, IRolesFilter, ISearchResponse, IRole } from '@app/types';
import { endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';
import { RoleBasicForm } from '@components/pages';

const Page = () => {
  const t = useTranslate('RolesList');
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const [modalMode, setModalMode] = useState<'new' | 'edit' | null>(null);
  const [modalHeader, setModalHeader] = useState<string>('');
  const [dataKey, setDataKey] = useState<{ id: string; name: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      name: 'asc',
    };
  }, []);
  const filter: IRolesFilter = useMemo(() => {
    return {
      sort: defaultSortedColumn,
      skip: 0,
      take: 10,
      responseGroup: 'none',
      searchPhrase: undefined,
    };
  }, [defaultSortedColumn]);

  const exportFile: IExportFile = {
    fileName: 'roles',
    endpoint: endpoints.roles.list,
    listResultPropName: 'results',
    method: 'search',
    payload: { ...filter, skip: 0, take: 10000 },
  };
  const modalToggle = (mode: 'new' | 'edit' | null) => {
    if (mode === 'new') setDataKey(null);
    setModalMode(mode);
    setModalHeader(t(mode === 'edit' ? 'EDIT_ROLE' : 'ADD_ROLE'));
  };
  const handleOnEdit = dataKey => {
    setDataKey(dataKey);
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
      { field: 'name', header: t('NAME'), sortable: true },
      { field: 'normalizedName', header: t('NORMALIZE_NAME') },
      {
        field: 'synced',
        header: t('SYNCED'),
        body: col => <SwitchButton checked={col.synced} disabled />,
      },
      {
        field: 'id',
        header: '',
        style: { width: '80px' },
        body: col => (
          <DataTableActions
            data={{ id: col.id, name: col.name }}
            onEdit={handleOnEdit}
            excludedActions={['view', 'add']}
            onDelete={handleOnDelete}
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
    apiClient.search<ISearchResponse<IRolesList>>(endpoints.roles.list, { ...filter }).then(
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
  const handleFormSubmit = (): void => {
    modalToggle(null);
    setLoadingStatus(DataLoadingStatus.pending);
    loadData();
  };
  const handleOnDelete = (data: any) => {
    setSelectedId(data.id);
    setDeleteModal(true);
  };

  const handleDelete = (): void => {
    setDeleteModal(false);
    setLoadingStatus(DataLoadingStatus.pending);
    apiClient.delete(endpoints.roles.delete, { ids: selectedId }).then(
      data => {
        if (data && data.status === 204) {
          setSelectedId(null);
          setTimeout(() => {
            toast.success(t('DELETE_ROLE_SUCCESS_MSG'));
            loadData();
          }, 300);
        } else {
          setLoadingStatus(DataLoadingStatus.done);
          toast.error(t('ERR_DELETE_ROLE_MSG'));
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
                  <h4 className="card-title mb-0">{t('ROLES')}</h4>
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
        <RoleBasicForm
          mode={modalMode}
          onCancel={() => modalToggle(null)}
          onSubmit={handleFormSubmit}
          dataKey={dataKey}
        />
      </EndSideBar>
    </ClientOnly>
  );
};

export default Page;

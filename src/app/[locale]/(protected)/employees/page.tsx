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
  DisplayDateText,
  KeywordSearch,
  SortedColumn,
  DataColumnSortTypes,
  RGBY,
  IRGBY,
  EndSideBar,
  DataTableActions,
  SwitchButton,
  IExportFile,
  ExportType,
  DeleteModal,
} from '@components/common';
import { IEmployeesList, IEmployeesFilter, ISearchResponse, IEmployeeItem } from '@app/types';
import { endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';
import { EmployeesBasicForm, EmployeesAdvancedSearchForm } from '@components/pages';
const Page = () => {
  const t = useTranslate('Employees');
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const [modalMode, setModalMode] = useState<'new' | 'edit' | null>(null);
  const [modalHeader, setModalHeader] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const RGBYPreset: IRGBY = { red: 'Deleted', green: 'Approved', blue: 'New', yellow: 'Rejected' };
  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      createdDate: 'desc',
    };
  }, []);
  const filter: IEmployeesFilter = useMemo(() => {
    return {
      sort: defaultSortedColumn,
      skip: 0,
      take: 10,
      responseGroup: 'none',
      searchPhrase: undefined,
      deepSearch: true,
      memberType: 'Employee',
    };
  }, [defaultSortedColumn]);
  const Sort = () => {
    const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
    setSortedColumn({
      sortField: sortField,
      sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
    });
  };
  const exportedDataResolver = (data: IEmployeesList, type: ExportType): Array<any> => {
    return data.map((item: IEmployeeItem) => {
      return {
        ...item,
        createdDate: item.createdDate ? new Date(item.createdDate).toLocaleDateString('en-EG') : '',
        modifiedDate: item.modifiedDate ? new Date(item.modifiedDate).toLocaleDateString('en-EG') : '',
      };
    });
  };

  const exportFile: IExportFile = {
    fileName: 'employees',
    endpoint: endpoints.employees.list,
    listResultPropName: 'results',
    method: 'search',
    payload: { ...filter, skip: 0, take: 10000 },
    dataResolver: exportedDataResolver,
  };
  const modalToggle = (mode: 'new' | 'edit' | null) => {
    if (mode === 'new') setSelectedId(null);
    setModalMode(mode);
    setModalHeader(t(mode === 'edit' ? 'EDIT_EMPLOYEE' : 'ADD_EMPLOYEE'));
  };

  const handleOnEdit = (id: string) => {
    setSelectedId(id);
    modalToggle('edit');
  };
  const handleFormSubmit = (): void => {
    modalToggle(null);
    setLoadingStatus(DataLoadingStatus.pending);
    loadData(filter);
  };

  const columns: DataTableColumnsArray = useMemo(
    () => [
      { field: 'firstName', header: t('FIRST_NAME') },
      { field: 'name', header: t('NAME'), sortable: true },

      { field: 'preferredCommunication', header: t('COMMUNICATION') },
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
      {
        field: 'id',
        header: '',
        body: col => (
          <DataTableActions
            data={col.id}
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
      apiClient.search<ISearchResponse<IEmployeesList>>(endpoints.employees.list, { ...searchFilter }).then(
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

  const handleOnDelete = (id: string) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const handleDelete = (): void => {
    setDeleteModal(false);
    setLoadingStatus(DataLoadingStatus.pending);
    apiClient.delete(endpoints.employees.delete, { ids: selectedId }).then(
      data => {
        if (data && data.status === 204) {
          setSelectedId(null);
          setTimeout(() => {
            toast.success(t('DELETE_SUCCESS_MSG'));
            loadData(filter);
          }, 300);
        } else {
          setLoadingStatus(DataLoadingStatus.done);
          toast.error(t('ERR_DELETE_MSG'));
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
    filter.searchPhrase = undefined;
    filter.outerIds = undefined;

    filter.sort = defaultSortedColumn;
    filter.skip = 0;
    filter.take = 10;
    filter.responseGroup = 'none';
    filter.searchPhrase = undefined;
  };
  const onAdvancedSearchSubmit = formValues => {
    resetFilter();
    if (formValues.searchPhrase) filter.searchPhrase = formValues.searchPhrase;
    if (formValues.outerIds) filter.outerIds = formValues.outerIds;

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
        <Col md={12}>
          <Card>
            <CardHeader>
              <Row className="g-3">
                <Col md={6}>
                  <h4 className="card-title mb-0">{t('EMPLOYEES')}</h4>
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
                  advancedSearch={
                    <EmployeesAdvancedSearchForm
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
        <EmployeesBasicForm
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

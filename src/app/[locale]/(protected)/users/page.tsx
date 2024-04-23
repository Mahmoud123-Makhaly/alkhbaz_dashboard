'use client';
import { CardBody, Button, Card, CardHeader, Col, Row } from 'reactstrap';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next-intl/client';

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
  EndSideBar,
  DataTableActions,
  IExportFile,
  ExportType,
  DeleteModal,
} from '@components/common';
import { IUsersFilter, IUsersList, ISearchResponse, IUser } from '@app/types';
import { endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';
import { AddUserBasicForm, UserAdvancedSearchForm, EditUserBasicForm, ResetPasswordBasicForm } from '@components/pages';

const Page = () => {
  const t = useTranslate('Users');
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const [modalMode, setModalMode] = useState<{
    mode: 'new' | 'edit' | 'reset' | null;
    header?: string;
    key?: string;
  }>({
    mode: null,
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const router = useRouter();

  const RGBYPreset: IRGBY = { red: 'Deleted', green: 'Approved', blue: 'New', yellow: 'Rejected' };
  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      createdDate: 'desc',
    };
  }, []);
  const filter: IUsersFilter = useMemo(() => {
    return {
      sort: defaultSortedColumn,
      skip: 0,
      take: 10,
      onlyUnlocked: false,
      responseGroup: 'none',
      searchPhrase: undefined,
    };
  }, [defaultSortedColumn]);

  const exportedDataResolver = (data: IUsersList, type: ExportType): Array<any> => {
    return data.map((item: IUser) => {
      return {
        ...item,
        createdDate: item.createdDate ? new Date(item.createdDate).toLocaleDateString('en-EG') : '',
        modifiedDate: item.modifiedDate ? new Date(item.modifiedDate).toLocaleDateString('en-EG') : '',
      };
    });
  };

  const exportFile: IExportFile = {
    fileName: 'users',
    endpoint: endpoints.users.list,
    listResultPropName: 'results',
    method: 'search',
    payload: { ...filter, skip: 0, take: 10000 },
    dataResolver: exportedDataResolver,
  };

  const modalToggle = (mode: 'new' | 'edit' | 'reset' | null, key?: string) => {
    if (mode === 'new') {
      setModalMode({ mode: mode, header: t('ADD_USER') });
    } else if (mode === 'reset') {
      setModalMode({ mode: mode, key, header: t('RESET_PASSWORD') });
    } else {
      setModalMode({ mode: mode, key, header: t('EDIT_USER') });
    }
  };
  const handleOnEdit = (user: IUser) => {
    modalToggle('edit', user.id);
  };
  const Sort = () => {
    const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
    setSortedColumn({
      sortField: sortField,
      sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
    });
  };
  const handleReset = (user: IUser) => {
    modalToggle('reset', user.userName);
  };
  const columns: DataTableColumnsArray = useMemo(
    () => [
      { field: 'userName', header: t('USERNAME'), sortable: true },
      {
        field: 'lastLoginDate',
        header: t('LAST_LOGIN'),
        sortable: true,
        body: col => <DisplayDateText date={col.lastLoginDate} />,
      },
      { field: 'userType', header: t('USER_TYPE'), sortable: true },
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
        field: 'isAdministrator',
        header: t('IS_ADMINISTRATOR'),
        sortable: true,
        body: col => <SwitchButton checked={col.isAdministrator} disabled />,
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
        body: col => {
          let extraActions = [
            {
              iconClassName: 'ri-rotate-lock-line text-warning',
              label: t('RESET'),
              onClick: handleReset,
            },
          ];
          if (col.memberId)
            extraActions.push({
              iconClassName: 'ri-account-box-line text-secondary',
              label: t('CUSTOMER_DETAILS'),
              onClick: (user: IUser) => {
                router.push(`/customers/${user.memberId}`);
              },
            });
          return (
            <DataTableActions
              data={col}
              onEdit={handleOnEdit}
              onDelete={handleOnDelete}
              excludedActions={['view', 'add']}
              extraActions={extraActions}
            />
          );
        },
      },
    ],
    [t],
  );

  const [dataSource, setDataSource] = useState<DataTableValues>({
    columns,
  });

  const loadData = useCallback(
    async searchFilter => {
      apiClient.search<ISearchResponse<IUsersList>>(endpoints.users.list, { ...searchFilter }).then(
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
  const handleFormSubmit = (): void => {
    modalToggle(null);
    setLoadingStatus(DataLoadingStatus.pending);
    loadData(filter);
  };
  const handleOnDelete = (data: any) => {
    setSelectedUserName(data.userName);
    setDeleteModal(true);
  };

  const handleDelete = (): void => {
    setDeleteModal(false);
    setLoadingStatus(DataLoadingStatus.pending);
    apiClient.delete(endpoints.users.delete, { names: selectedUserName }).then(
      data => {
        if (data) {
          setSelectedUserName(null);
          setTimeout(() => {
            toast.success(t('DELETE_USER_SUCCESS_MSG'));
            loadData(filter);
          }, 300);
        } else {
          setLoadingStatus(DataLoadingStatus.done);
          toast.error(t('ERR_DELETE_USER_MSG'));
        }
      },
      err => {
        setSelectedUserName(null);
        toast.error(err.toString());
        setLoadingStatus(DataLoadingStatus.done);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  //Advanced Search
  const resetFilter = () => {
    filter.searchPhrase = undefined;
    filter.lasLoginDate = undefined;
    filter.modifiedSinceDate = undefined;
    filter.roles = undefined;

    filter.roles = undefined;
    filter.sort = defaultSortedColumn;
    filter.skip = 0;
    filter.take = 10;
    filter.responseGroup = 'none';
    filter.searchPhrase = undefined;
  };
  const onAdvancedSearchSubmit = formValues => {
    resetFilter();
    if (formValues.searchPhrase) filter.searchPhrase = formValues.searchPhrase;
    if (formValues.lasLoginDate) filter.lasLoginDate = formValues.lasLoginDate;
    if (formValues.modifiedSinceDate) filter.modifiedSinceDate = formValues.modifiedSinceDate;
    if (formValues.roles) filter.roles = formValues.roles;

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
                  <h4 className="card-title mb-0">{t('USERS')}</h4>
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
                    <UserAdvancedSearchForm
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
      <EndSideBar isOpen={!!modalMode.mode} title={modalMode.header!} toggle={() => modalToggle(null)}>
        {modalMode.mode === 'new' && (
          <AddUserBasicForm onCancel={() => modalToggle(null)} onSubmit={handleFormSubmit} />
        )}
        {modalMode.mode === 'edit' && (
          <EditUserBasicForm onCancel={() => modalToggle(null)} onSubmit={handleFormSubmit} id={modalMode.key} />
        )}
        {modalMode.mode === 'reset' && (
          <ResetPasswordBasicForm
            onCancel={() => modalToggle(null)}
            onSubmit={handleFormSubmit}
            userName={modalMode.key!}
          />
        )}
      </EndSideBar>
    </ClientOnly>
  );
};

export default Page;

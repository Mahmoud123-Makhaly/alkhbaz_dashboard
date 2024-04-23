'use client';
import {
  CardBody,
  Card,
  CardHeader,
  Col,
  Row,
  ButtonGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
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
  KeywordSearch,
  SortedColumn,
  DataColumnSortTypes,
  DisplayDateText,
  EndSideBar,
  DataTableActions,
  SwitchButton,
} from '@components/common';
import { IContentPlacesList, IContentPlacesFilter, ISearchResponse } from '@app/types';
import { endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';
import { ContentPlaceholderForm } from '@components/pages';
const Page = () => {
  const t = useTranslate('ContentPlaces');
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const [modalMode, setModalMode] = useState<{
    mode: 'edit' | 'new';
    type: 'folder' | 'placeholder';
    header: string;
    id?: string;
  } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      createdDate: 'desc',
    };
  }, []);
  const filter: IContentPlacesFilter = useMemo(() => {
    return {
      sort: defaultSortedColumn,
      skip: 0,
      take: 10,
      responseGroup: 'none',
      searchPhrase: undefined,
    };
  }, [defaultSortedColumn]);
  const Sort = () => {
    const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
    setSortedColumn({
      sortField: sortField,
      sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
    });
  };
  const modalToggle = (mode: 'new' | 'edit', type: 'folder' | 'placeholder', id?: string) => {
    const placeholderHeader = t(mode === 'edit' ? 'EDIT_CONTENT_PLACEHOLDER' : 'ADD_CONTENT_PLACEHOLDER');
    const placeholderFolderHeader = t(
      mode === 'edit' ? 'EDIT_CONTENT_PLACEHOLDER_FOLDER' : 'ADD_CONTENT_PLACEHOLDER_FOLDER',
    );
    setModalMode({
      mode: mode,
      type: type,
      header: type === 'folder' ? placeholderFolderHeader : placeholderHeader,
      id: id,
    });
  };

  const handleOnEdit = (id: string, objectType: string) => {
    modalToggle('edit', objectType ? 'folder' : 'placeholder', id);
  };

  const handleFormSubmit = (): void => {
    setLoadingStatus(DataLoadingStatus.pending);
    setModalMode(null);
    loadData();
  };

  const columns: DataTableColumnsArray = useMemo(
    () => [
      { field: 'name', header: t('NAME'), sortable: true },
      { field: 'description', header: t('DESCRIPTION') },
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
        field: 'id',
        header: '',
        body: col => (
          <DataTableActions
            data={col.id}
            onEdit={key => handleOnEdit(col.id, col.objectType)}
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
    apiClient.search<ISearchResponse<IContentPlacesList>>(endpoints.contentPlaceholders.list, { ...filter }).then(
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

  return (
    <ClientOnly>
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader>
              <Row className="g-3">
                <Col md={6}>
                  <h4 className="card-title mb-0">{t('CONTENT_PLACE')}</h4>
                </Col>
                <Col md={6} className="text-end">
                  {/* <Button color="primary" type="button" onClick={() => modalToggle('new')}>
                    <i className="ri-add-fill me-1 align-bottom"></i> {t('NEW')}
                  </Button> */}
                  <ButtonGroup>
                    <UncontrolledDropdown>
                      <DropdownToggle tag="button" className="btn btn-primary">
                        <i className="ri-add-line align-bottom me-1"></i>
                        {t('NEW')}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => modalToggle('new', 'folder')}>
                          <i className="ri-folder-2-fill text-primary align-bottom me-1"></i>&nbsp;
                          {t('PLACEHOLDER_FOLDER')}
                        </DropdownItem>

                        <DropdownItem onClick={() => modalToggle('new', 'placeholder')}>
                          <i className="ri-article-fill text-warning align-bottom me-1"></i>&nbsp;{t('PLACEHOLDER')}
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </ButtonGroup>
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
                <Table dataSource={dataSource} sortedColumn={sortedColumn} onSort={onSort} onPage={onPage} />
              </DataLoader>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <EndSideBar isOpen={!!modalMode} title={modalMode?.header!} toggle={() => setModalMode(null)} width="40%">
        <ContentPlaceholderForm
          id={modalMode?.id}
          mode={modalMode?.mode!}
          header={modalMode?.header!}
          type={modalMode?.type!}
          onCancel={() => setModalMode(null)}
          onSubmit={handleFormSubmit}
        />
      </EndSideBar>
    </ClientOnly>
  );
};

export default Page;

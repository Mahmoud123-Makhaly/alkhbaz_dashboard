'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import {
  FileManager,
  IRecentItemActions,
  DeleteModal,
  DataLoadingStatus,
  DataLoader,
  DataLoadingSkeletonType,
  DataTableColumnsArray,
  DisplayDateText,
  DataTableActions,
  SortedColumn,
  DataColumnSortTypes,
  DataTableStateEvent,
  IFileManagerProps,
  IFileOverview,
  ClientOnly,
  EndSideBar,
} from '@components/common';
import { Utils } from '@helpers/utils';
import { endpoints } from '@app/libs';
import { ISearchResponse, IAssetList, IFileAsset } from '@app/types';
import { useAPIAuthClient, useToast, useTranslate } from '@app/hooks';
import { DataTableValueArray } from 'primereact/datatable';
import { AssetBasicForm } from '@components/pages';

const Page = () => {
  const t = useTranslate('Asset');
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [dataListStatus, setDataListStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const [modalMode, setModalMode] = useState<{
    mode: 'edit' | 'new';
    type: 'folder' | 'file';
    header: string;
    url: string;
  } | null>(null);
  const apiClient = useAPIAuthClient();
  const toast = useToast();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let originDataList: DataTableValueArray = [];

  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      createdDate: 'desc',
    };
  }, []);
  const filter = useMemo(() => {
    return {
      sort: defaultSortedColumn,
      skip: 0,
      take: 10,
    };
  }, [defaultSortedColumn]);
  const columns: DataTableColumnsArray = useMemo(
    () => [
      {
        field: 'name',
        header: t('NAME'),
        sortable: true,
        body: col => {
          const url = !Utils.getFileExtension(col.url) && col.type === 'blob' ? `${col.url}.file` : col.url;
          return (
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 fs-17 me-2 filelist-icon">
                <i className={`${Utils.getFileIcon(url).icon} align-bottom`}></i>
              </div>
              <div className="flex-grow-1 filelist-name text-start">{col.name}</div>
            </div>
          );
        },
      },
      {
        field: 'size',
        header: t('SIZE'),
        sortable: true,
        body: col => {
          const size = Utils.formatBytes(col.size);
          return <span>{size.value > 0 ? `${size.value} ${size.sizeType}` : ''}</span>;
        },
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
        field: 'url',
        header: '',
        style: { width: '80px' },
        body: col => {
          const excludedActions: Array<'edit' | 'view' | 'add' | 'delete'> = ['add', 'edit'];
          if (col.type === 'blob') excludedActions.push('delete');
          return (
            <DataTableActions
              data={col.url}
              // onEdit={dataKey => modalToggle('edit', dataKey as string, col.type === 'blob' ? 'file' : 'folder')}
              onView={handleDataListOnView}
              onDelete={onDelete}
              excludedActions={excludedActions}
            />
          );
        },
      },
    ],
    [],
  );
  /* Data List */
  const getAllLeafUrls = (arr): string[] => {
    return _.flatMap(arr, item => {
      if (item.leafs && item.leafs.length > 0) {
        return getAllLeafUrls(item.leafs);
      }
      return [item.key.toString()];
    });
  };

  const getFolderDetails = useCallback(async (key: string) => {
    setDataListStatus(DataLoadingStatus.pending);
    apiClient.select<ISearchResponse<IAssetList>>(endpoints.asset.folderDetails, { folderUrl: key }).then(
      data => {
        if (data && data.results) {
          filter.sort = defaultSortedColumn;
          const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
          DataListSort();
          const extractFolderNameRegex = /[^/]+$/;
          const originData = { ...dataSource };
          // eslint-disable-next-line react-hooks/exhaustive-deps
          originDataList = _.orderBy(data.results, [sortField], [filter.sort![sortField] || DataColumnSortTypes.asc]);
          originData.dataList.dataSource.data = originDataList;
          originData.dataList.dataSource.totalRecords = data['totalCount'];
          originData.dataList.dataSource.skipFirst = filter.skip;
          originData.dataList.sortedColumn = {
            sortField: sortField,
            sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
          };
          originData.dataListHeader = t('DATA_LIST_HEADER', {
            folderName: Utils.toPascalCase(key.match(extractFolderNameRegex)![0] || ''),
          });
          originData.currentFolder = key;
          originData.onNewFile = () => modalToggle('new', key, 'file');

          //Setup folder level up
          const extractRelativePathRegex = /^https?:\/\/(?:[^/]+\.)?[^/]+\/[^/]+(\/|$)/;
          const relativePath = key.replace(extractRelativePathRegex, '');
          if (relativePath && relativePath.split('/').length >= 2) {
            const parentFolder = relativePath.split('/').slice(0, -1);
            originData.folderLevelUp = {
              dataUpKey: `${process.env.NEXT_PUBLIC_API_BASE_URL}/assets/${parentFolder.join('/')}`,
              onClick: getFolderDetails,
            };
          } else originData.folderLevelUp = undefined;

          setDataSource(originData);
        }
        setTimeout(() => {
          setDataListStatus(DataLoadingStatus.done);
        }, 1000);
      },
      err => {
        toast.error(err.toString());
        setDataListStatus(DataLoadingStatus.done);
      },
    );
  }, []);

  const getFileDetails = useCallback(
    async (key: string) => {
      const selectedItem = originDataList.find(x => x.url === key);
      if (selectedItem) {
        const url =
          !Utils.getFileExtension(selectedItem.url) && selectedItem.type === 'blob'
            ? `${selectedItem.url}.file`
            : selectedItem.url;
        const { icon, type } = Utils.getFileIcon(url);
        const { value, sizeType } = Utils.formatBytes(selectedItem.size);
        const file: IFileOverview = {
          id: selectedItem.url,
          fileName: selectedItem.name,
          path: selectedItem.relativeUrl,
          icon: type === 'IMG' ? selectedItem.url : icon,
          size: value,
          sizeType: sizeType,
          fileType: t(type),
          createDate: selectedItem.createdDate,
          copyURL: selectedItem.url,
          onDownload: url => onFileDownload(url),
          onDelete: url => onDelete(url),
        };
        setDataSource(prev => ({ ...prev, fileOverview: file }));
      }
    },
    [originDataList, t],
  );

  const deleteItem = useCallback(async (key: string) => {
    let isRoot = false;
    const rootUrls: string[] = _.uniq(getAllLeafUrls(dataSource.defaultTree?.tree));
    if (_.includes(rootUrls, key)) {
      isRoot = true;
    }
    if (!isRoot) setDataListStatus(DataLoadingStatus.pending);
    else setLoadingStatus(DataLoadingStatus.pending);
    apiClient.delete(endpoints.asset.delete, { urls: key }).then(
      data => {
        if (data && data.status === 204) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          _.remove(originDataList, x => x.url === key);
          toast.success(t('DELETE_SUCCESS'));
          setSelectedUrl(null);
          if (!isRoot) loadDataList();
          else loadData();
        } else {
          toast.error(t('ERR_DELETE_GENERIC_MSG'));
          if (!isRoot) setDataListStatus(DataLoadingStatus.done);
          else setLoadingStatus(DataLoadingStatus.done);
        }
      },
      err => {
        toast.error(err.toString());
        if (!isRoot) setDataListStatus(DataLoadingStatus.done);
        else setLoadingStatus(DataLoadingStatus.done);
      },
    );
  }, []);

  const onDelete = url => {
    setSelectedUrl(url);
    setDeleteModal(true);
  };

  const handleDeleteConfirmation = () => {
    setDataListStatus(DataLoadingStatus.pending);
    deleteItem(selectedUrl!);
    setDeleteModal(false);
  };

  const recentItemActions: IRecentItemActions = [
    {
      label: t('VIEW'),
      iconClass: 'ri-eye-fill align-bottom me-2 text-secondary',
      onClick: dataKey => {
        getFolderDetails(dataKey);
      },
    },
    // {
    //   label: t('RENAME'),
    //   iconClass: 'ri-edit-box-fill align-bottom me-2 text-success',
    //   onClick: dataKey => {
    //     modalToggle('edit', dataKey);
    //   },
    // },
    {
      label: t('DELETE'),
      iconClass: 'ri-delete-bin-fill align-bottom me-2 text-danger',
      onClick: onDelete,
    },
  ];

  const modalToggle = (mode: 'new' | 'edit', url: string, type: 'file' | 'folder') => {
    if (mode === 'edit') {
      console.log(mode + ', url:' + url + ', type:' + type);
    } else if (mode === 'new') {
      setModalMode({ mode, url, type, header: t(type === 'file' ? 'NEW_FILE' : 'NEW_FOLDER') });
    }
  };
  const handleFormSubmit = (errMsg?: string, successMsg?: string): void => {
    setModalMode(null);
    setTimeout(() => {
      if (errMsg) toast.error(errMsg);
      if (successMsg) toast.success(successMsg);
    }, 500);
    if (dataSource.currentFolder === `${process.env.NEXT_PUBLIC_API_BASE_URL}/assets`) {
      setLoadingStatus(DataLoadingStatus.pending);
      loadData();
    } else {
      getFolderDetails(dataSource.currentFolder!);
    }
  };
  const handleDataListOnView = (url: string) => {
    const selectedItem = originDataList.find(x => x.url === url);
    if (selectedItem?.type === 'folder') getFolderDetails(url);
    else getFileDetails(url);
  };

  const DataListSort = () => {
    const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
    setSortedColumn(prev => ({
      sortField: sortField,
      sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
    }));
  };

  const setFilterSort = (field: string, order: number) => {
    filter.sort = { [field]: DataColumnSortTypes[order] } as ISortType;
  };

  const onDataListSort = (e: DataTableStateEvent) => {
    setFilterSort(e.sortField, e.sortOrder!);
    setDataListStatus(DataLoadingStatus.pending);
    loadDataList();
  };

  const onDataListPage = (e: DataTableStateEvent) => {
    setFilterSort(e.sortField, e.sortOrder!);
    filter.skip = e.first;
    setDataListStatus(DataLoadingStatus.pending);
    loadDataList();
  };

  const loadDataList = () => {
    const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
    originDataList = _.orderBy(originDataList, [sortField], [filter.sort![sortField] || DataColumnSortTypes.asc]);

    setDataSource(prev => ({
      ...prev,
      fileOverview: undefined,
      dataList: {
        ...prev.dataList,
        dataSource: {
          ...prev.dataList.dataSource,
          data: originDataList?.slice(filter.skip),
          skipFirst: filter.skip,
        },
        sortedColumn: {
          sortField: sortField,
          sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
        },
      },
    }));
    setTimeout(() => {
      setDataListStatus(DataLoadingStatus.done);
    }, 1000);
  };

  const search = useCallback(async (keyword: string) => {
    if (keyword) {
      setDataListStatus(DataLoadingStatus.pending);
      apiClient.select<ISearchResponse<IFileAsset>>(endpoints.asset.search, { keyword }).then(
        data => {
          if (data && data.results) {
            filter.sort = defaultSortedColumn;
            const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
            DataListSort();
            const originData = { ...dataSource };
            // eslint-disable-next-line react-hooks/exhaustive-deps
            originDataList = _.orderBy(data.results, [sortField], [filter.sort![sortField] || DataColumnSortTypes.asc]);
            originData.dataList.dataSource.data = originDataList;
            originData.dataList.dataSource.totalRecords = data['totalCount'];
            originData.dataList.dataSource.skipFirst = filter.skip;
            originData.dataList.sortedColumn = {
              sortField: sortField,
              sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
            };
            originData.dataListHeader = t('DATA_LIST_SEARCH_HEADER', {
              keyword,
            });
            originData.currentFolder = `${process.env.NEXT_PUBLIC_API_BASE_URL}/assets`;
            // eslint-disable-next-line react-hooks/exhaustive-deps
            originData.folderLevelUp = undefined;

            setDataSource(originData);
          }
          setTimeout(() => {
            setDataListStatus(DataLoadingStatus.done);
          }, 1000);
        },
        err => {
          toast.error(err.toString());
          setDataListStatus(DataLoadingStatus.done);
        },
      );
    } else {
      setLoadingStatus(DataLoadingStatus.pending);
      loadData();
    }
  }, []);

  const [dataSource, setDataSource] = useState<IFileManagerProps>({
    defaultTree: {
      tree: [
        {
          key: 1,
          name: 'My Drive',
          leafs: [],
        },
        {
          key: 2,
          name: 'Documents',
          iconClassName: 'ri-file-list-2-line',
          onClick: e => console.log('get Documents'),
        },
        {
          key: 3,
          name: 'Media',
          iconClassName: 'ri-image-2-line',
          onClick: e => console.log('get Media'),
        },
        {
          key: 4,
          name: 'Recent',
          iconClassName: 'ri-history-line',
          onClick: e => console.log(e),
        },
        {
          key: 5,
          name: 'Important',
          iconClassName: 'ri-star-line',
          onClick: e => console.log('get Important'),
        },
        {
          key: 6,
          name: 'Deleted',
          iconClassName: 'ri-delete-bin-line',
          onClick: e => console.log('get Deleted'),
        },
      ],
      search: search,
      // storageStatus: {
      //   used: '47.52 GB',
      //   total: '119 GB',
      // },
    },
    recentItems: {
      name: t('RECENT_ITEMS'),
      value: [],
    },
    dataListHeader: t('DATA_LIST_HEADER', { folderName: t('FOLDER') }),
    dataList: {
      dataSource: {
        columns,
      },
      header: 'none',
      sortedColumn: sortedColumn,
      onPage: onDataListPage,
      onSort: onDataListSort,
    },
    /*
    folderOverview: {
      data: [
        {
          label: 'Documents',
          color: ChartDataColors.blueSky,
          size: 27.01,
          sizeType: FileSizeType.KB,
          infoTag: '2348 files',
          iconClassName: 'ri-file-text-line',
        },
        {
          label: 'Media',
          color: ChartDataColors.red,
          size: 20.87,
          sizeType: FileSizeType.GB,
          infoTag: '12480 files',
          iconClassName: 'ri-gallery-line',
        },
        {
          label: 'Others',
          color: ChartDataColors.blue,
          size: 33.54,
          sizeType: FileSizeType.B,
          infoTag: '2348 files',
          iconClassName: 'ri-error-warning-line ',
        },
        {
          label: 'Free Space',
          color: ChartDataColors.green,
          size: 37.58,
          sizeType: FileSizeType.KB,
          infoTag: '9873 files',
          iconClassName: 'ri-folder-2-line',
        },
      ],
    },
     */
  });

  /* File Manager */
  const onFileDownload = async url => {
    //Get file name by regx
    const regex = /[^/]+$/;
    window.open(`api/download/${url.match(regex)[0]}?url=${url}`, '_blank');
  };

  const loadData = useCallback(async () => {
    apiClient.select<ISearchResponse<IAssetList>>(endpoints.asset.defaultTree).then(
      data => {
        if (data && data.results) {
          const originData = { ...dataSource };
          const tree = data.results;
          const recentItems = data.results
            .sort((a, b) => new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime())
            .slice(0, 4);
          originData.recentItems!.value = recentItems.map(item => {
            return {
              name: item.name,
              type: item,
              createDate: item.createdDate,
              dataKey: item.url,
              actions: recentItemActions,
              iconClass: Utils.getFileIcon('').icon,
            };
          });
          originData.defaultTree!.tree[0].leafs = tree
            .sort((a, b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();

              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0;
            })
            .map(item => {
              return {
                key: item.url,
                name: item.name,
                onClick: getFolderDetails,
              };
            });
          originData.dataList.dataSource.data = undefined;
          originData.dataList.dataSource.totalRecords = undefined;
          originData.dataList.dataSource.skipFirst = filter.skip;
          originData.currentFolder = `${process.env.NEXT_PUBLIC_API_BASE_URL}/assets`;
          originData.fileOverview = undefined;
          setDataSource(originData);
        }
        setTimeout(() => {
          setLoadingStatus(DataLoadingStatus.done);
          setDataListStatus(DataLoadingStatus.done);
        }, 1000);
      },
      err => {
        toast.error(err.toString());
        setLoadingStatus(DataLoadingStatus.done);
        setDataListStatus(DataLoadingStatus.done);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <ClientOnly>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteConfirmation()}
        onCloseClick={() => setDeleteModal(false)}
        confirmationMessage={t('DELETE_CONFIRMATION_MSG')}
      />
      <DataLoader status={loadingStatus} skeleton={DataLoadingSkeletonType.fileManager}>
        <FileManager
          folderOverview={dataSource.folderOverview}
          defaultTree={dataSource.defaultTree}
          recentItems={dataSource.recentItems}
          fileOverview={dataSource.fileOverview}
          dataList={dataSource.dataList}
          dataListStatus={dataListStatus}
          dataListHeader={dataSource.dataListHeader}
          folderLevelUp={dataSource.folderLevelUp}
          onNewFolder={() => modalToggle('new', dataSource.currentFolder!, 'folder')}
          onNewFile={dataSource.onNewFile}
        />
      </DataLoader>
      <EndSideBar isOpen={!!modalMode} title={modalMode?.header!} toggle={() => setModalMode(null)}>
        <AssetBasicForm {...modalMode!} onCancel={() => setModalMode(null)} onSubmit={handleFormSubmit} />
      </EndSideBar>
    </ClientOnly>
  );
};
export default Page;

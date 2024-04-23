'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, CardBody, Col, CardHeader, Nav, NavItem, NavLink, Row } from 'reactstrap';
import { useRouter } from 'next-intl/client';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';
import { useSession } from 'next-auth/react';

import { changePageLoader } from '@slices/thunks';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import {
  DataLoader,
  DataLoadingStatus,
  DataTableValues,
  Table,
  DataTableColumnsArray,
  DataTableStateEvent,
  SwitchButton,
  DisplayDateText,
  DataTableActions,
  SortedColumn,
  DataColumnSortTypes,
  RGBYSoft,
  IRGBYSoft,
  ClientOnly,
  ExportType,
  EndSideBar,
  DeleteModal,
  IExportFile,
  IsAuthorizedTo,
} from '@components/common';
import { IOrdersList, IOrdersFilter, ISearchResponse, IOrder, ICustomerItem } from '@app/types';
import { endpoints } from '@app/libs';
import { Utils } from '@helpers/utils';
import { OrderAdvancedSearchForm, OrderBasicForm } from '@components/pages';
import { preloaderTypes } from '@components/constants/layout';
import { SecurityUserRoles } from '@helpers/constants';

const OrderList = ({
  disableAdvancedSearch,
  controlledFilter,
  customerInfo,
}: {
  disableAdvancedSearch?: boolean;
  controlledFilter?: IOrdersFilter;
  customerInfo?: ICustomerItem;
}) => {
  const [modal, setModal] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const t = useTranslate('COMP_OrderList');
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>();
  const [modalMode, setModalMode] = useState<'new' | 'edit' | null>(null);
  const [modalHeader, setModalHeader] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const apiClient = useAPIAuthClient();
  const [deleteModal, setDeleteModal] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  const toggleTab = (tab, status) => {
    resetFilter();
    if (activeTab !== tab) {
      setActiveTab(tab);
      filter.status = status;
      setLoadingStatus(DataLoadingStatus.pending);
      loadData(filter);
    }
  };
  const RGBYPreset: IRGBYSoft = {
    danger: ['Cancelled'],
    success: ['Completed'],
    secondary: ['Prepared', 'Partially sent'],
    warning: ['Not payed'],
    info: ['Pending', 'Shipping'],
    primary: ['Processing'],
    light: ['New'],
    dark: ['Ready to send'],
  };
  const defaultSortedColumn: ISortType = useMemo(() => {
    return {
      createdDate: 'desc',
    };
  }, []);
  const filter: IOrdersFilter = useMemo(() => {
    return {
      sort: defaultSortedColumn,
      skip: 0,
      take: 10,
      responseGroup: 'WithItems,WithPrices,WithDynamicProperties',
      keyword: undefined,
    };
  }, [defaultSortedColumn]);
  const exportedDataResolver = (data: IOrdersList, type: ExportType): Array<any> => {
    return data.map((order: IOrder) => {
      const ffcName = order.items.find(item => item.fulfillmentCenterName)?.fulfillmentCenterName || 'N/A';
      const orderSource = order.dynamicProperties?.find(x => x.name === 'orderSource');
      const orderSourceValue =
        orderSource && orderSource.values && orderSource.values.length > 0 ? orderSource.values[0].value : 'Web';

      return {
        ...order,
        orderSource: orderSourceValue,
        ffcName,
        synced: order.outerId ? true : false,
        createdDate: order.createdDate ? new Date(order.createdDate).toLocaleDateString('en-EG') : '',
        modifiedDate: order.modifiedDate ? new Date(order.modifiedDate).toLocaleDateString('en-EG') : '',
      };
    });
  };
  const exportFile: IExportFile | undefined = Utils.isSubsetOfArray(session?.user.roles || [], [
    SecurityUserRoles.MarketingManager,
  ])
    ? undefined
    : {
        fileName: 'orders',
        endpoint: endpoints.orders.list,
        listResultPropName: 'results',
        method: 'search',
        payload: {
          ...filter,
          startDate: filter.startDate ? new Date(moment(filter.startDate).format('YYYY-MM-DD')) : undefined,
          endDate: filter.endDate ? new Date(moment(filter.endDate).add(1, 'days').format('YYYY-MM-DD')) : undefined,
          ...(controlledFilter || {}),
          skip: 0,
          take: 10000,
        },
        dataResolver: exportedDataResolver,
      };

  const modalToggle = (mode: 'new' | 'edit' | null) => {
    if (mode === 'new') setSelectedId(null);
    setModalMode(mode);
    setModalHeader(t(mode === 'edit' ? 'EDIT_ORDER' : 'ADD_ORDER'));
  };

  const handleOnEdit = (id: string) => {
    setSelectedId(id);
    modalToggle('edit');
  };

  const Sort = () => {
    const sortField = Utils.getObjFirstKey(filter.sort) || Utils.getObjFirstKey(defaultSortedColumn);
    setSortedColumn({
      sortField: sortField,
      sortOrder: DataColumnSortTypes[filter.sort![sortField] as string] || DataColumnSortTypes.asc,
    });
  };

  const viewOrderDetails = (id: string) => {
    dispatch(changePageLoader(preloaderTypes.ENABLE) as unknown as AnyAction);
    router.push(`/orders/${id}`);
  };

  const sync = async (id: string) => {
    setLoadingStatus(DataLoadingStatus.pending);
    apiClient.select(endpoints.orders.sync, { urlParams: { id } }).then(
      data => {
        toast.success(t('SYNC_SUCCESS_MSG'));
        loadData(filter);
        setTimeout(() => {
          setLoadingStatus(DataLoadingStatus.done);
        }, 1000);
      },
      err => {
        toast.success(t('ERR_SYNC_MSG'));
        setLoadingStatus(DataLoadingStatus.done);
      },
    );
  };

  const columns: DataTableColumnsArray = useMemo(
    () => [
      { field: 'number', header: t('NUMBER'), sortable: true },
      {
        field: 'status',
        header: t('STATUS'),
        sortable: true,
        body: col => <RGBYSoft preset={RGBYPreset} value={col.status} />,
      },
      { field: 'ffcName', header: t('FULFILLMENT_CENTER_NAME'), sortable: true },
      {
        field: 'customerName',
        header: t('CUSTOMER'),
        sortable: true,
        body: col =>
          col.customerName || (customerInfo && customerInfo.id === col.customerId ? customerInfo.fullName : ''),
      },
      { field: 'total', header: t('TOTAL'), sortable: true },
      { field: 'currency', header: t('CURRENCY'), sortable: true },
      {
        field: 'orderSource',
        header: t('ORDER_SOURCE'),
        sortable: true,
      },
      { field: 'outerId', header: 'OuterID' },
      {
        field: 'synced',
        header: t('SYNCED'),
        body: col => <SwitchButton checked={col.outerId!!} disabled />,
      },
      {
        field: 'isApproved',
        header: t('APPROVED'),
        sortable: true,
        body: col => <SwitchButton checked={col.isApproved} disabled />,
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
        style: { width: '80px' },
        body: col =>
          IsAuthorizedTo(
            <DataTableActions
              data={col.id}
              onEdit={handleOnEdit}
              onDelete={handleOnDelete}
              onView={() => viewOrderDetails(col.id)}
              excludedActions={['add']}
              extraActions={[
                {
                  iconClassName: 'ri-arrow-left-right-fill text-info',
                  label: 'Sync',
                  onClick: sync,
                },
              ]}
            />,
            [SecurityUserRoles.Administrator, SecurityUserRoles.CallCenterAgent, SecurityUserRoles.StoreManager],
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
        .search<ISearchResponse<IOrdersList>>(endpoints.orders.list, { ...searchFilter, ...(controlledFilter || {}) })
        .then(
          data => {
            if (data && data.results) {
              let modifiedData = data.results || null;
              if (modifiedData) {
                modifiedData = modifiedData.map((order: IOrder) => {
                  const ffcName = order.items.find(item => item.fulfillmentCenterName)?.fulfillmentCenterName || 'N/A';
                  const orderSource = order.dynamicProperties?.find(x => x.name === 'orderSource');
                  const orderSourceValue =
                    orderSource && orderSource.values && orderSource.values.length > 0
                      ? orderSource.values[0].value
                      : 'Web';
                  return { ...order, ffcName, orderSource: orderSourceValue };
                });
              }
              setDataSource(prev => ({
                ...prev,
                data: modifiedData,
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
    apiClient.delete(endpoints.orders.delete, { ids: selectedId }).then(
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
  };

  //Advanced Search
  const resetFilter = () => {
    filter.ids = undefined;
    filter.startDate = undefined;
    filter.endDate = undefined;
    filter.fulfillmentCenterIds = undefined;
    filter.customerIds = undefined;
    filter.statuses = undefined;
    filter.keyword = undefined;
    filter.customerMobile = undefined;
    filter.sort = defaultSortedColumn;
    filter.skip = 0;
    filter.take = 10;
  };
  const onAdvancedSearchSubmit = formValues => {
    if (formValues.keyword) filter.keyword = formValues.keyword;
    if (formValues.ids) filter.ids = formValues.ids;
    if (formValues.fulfillmentCenterIds) filter.fulfillmentCenterIds = formValues.fulfillmentCenterIds;
    if (formValues.customerIds) filter.customerIds = _.flatMap(formValues.customerIds, str => str.split(','));
    if (formValues.statuses) filter.statuses = formValues.statuses;
    if (formValues.startDate) filter.startDate = formValues.startDate;
    if (formValues.endDate) filter.endDate = formValues.endDate;
    if (formValues.customerMobile) filter.customerMobile = formValues.customerMobile;
    setLoadingStatus(DataLoadingStatus.pending);
    loadData({
      ...filter,
      startDate: filter.startDate ? new Date(moment(formValues.startDate).format('YYYY-MM-DD')) : undefined,
      endDate: filter.endDate ? new Date(moment(formValues.endDate).add(1, 'days').format('YYYY-MM-DD')) : undefined,
    });
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
        <Col lg={12}>
          <Card id="orderList">
            <CardHeader className="border-0">
              <Row className="align-items-center gy-3">
                <div className="col-sm">
                  <h5 className="card-title mb-0">{t('ORDER_HISTORY')}</h5>
                </div>
              </Row>
            </CardHeader>
            <CardBody className="pt-0">
              <DataLoader status={loadingStatus}>
                <Nav className="nav-tabs nav-tabs-custom nav-success" role="tablist">
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '1' }, 'fw-semibold')}
                      onClick={() => {
                        toggleTab('1', undefined);
                      }}
                      href="#"
                    >
                      <i className="ri-store-2-fill me-1 align-bottom"></i> {t('ALL_ORDERS')}
                      {activeTab === '1' && (
                        <span className="badge bg-primary align-middle ms-1">{dataSource.totalRecords || 0}</span>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '2' }, 'fw-semibold')}
                      onClick={() => {
                        toggleTab('2', 'Completed');
                      }}
                      href="#"
                    >
                      <i className="ri-checkbox-circle-line me-1 align-bottom"></i> {t('DELIVERED')}
                      {activeTab === '2' && (
                        <span className="badge bg-success align-middle ms-1">{dataSource.totalRecords || 0}</span>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '3' }, 'fw-semibold')}
                      onClick={() => {
                        toggleTab('3', 'Ready to send');
                      }}
                      href="#"
                    >
                      <i className="ri-truck-line me-1 align-bottom"></i> {t('PICKUPS')}
                      {activeTab === '3' && (
                        <span className="badge bg-warning align-middle ms-1">{dataSource.totalRecords || 0}</span>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '4' }, 'fw-semibold')}
                      onClick={() => {
                        toggleTab('4', 'Partially sent');
                      }}
                      href="#"
                    >
                      <i className="ri-arrow-left-right-fill me-1 align-bottom"></i>
                      {t('RETURNS')}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '5' }, 'fw-semibold')}
                      onClick={() => {
                        toggleTab('5', 'Cancelled');
                      }}
                      href="#"
                    >
                      <i className="ri-close-circle-line me-1 align-bottom"></i> {t('CANCELLED')}
                      {activeTab === '5' && (
                        <span className="badge bg-danger align-middle ms-1">{dataSource.totalRecords || 0}</span>
                      )}
                    </NavLink>
                  </NavItem>
                </Nav>
                <Table
                  dataSource={dataSource}
                  sortedColumn={sortedColumn}
                  onSort={onSort}
                  onPage={onPage}
                  advancedSearch={
                    !disableAdvancedSearch ? (
                      <OrderAdvancedSearchForm
                        onSubmit={onAdvancedSearchSubmit}
                        onCancel={onAdvancedSearchCancel}
                        initialValues={filter}
                      />
                    ) : undefined
                  }
                  exportFile={exportFile}
                />
              </DataLoader>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <EndSideBar isOpen={!!modalMode} title={modalHeader} toggle={() => modalToggle(null)}>
        <OrderBasicForm
          mode={modalMode}
          onCancel={() => modalToggle(null)}
          onSubmit={handleFormSubmit}
          id={selectedId}
        />
      </EndSideBar>
    </ClientOnly>
  );
};
export default OrderList;

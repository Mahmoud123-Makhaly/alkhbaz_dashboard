'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next-intl/client';
import { Card, Nav, NavItem, NavLink, CardBody, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import { IOrder } from '@app/types';
import { endpoints } from '@app/libs';
import { BreadCrumb, DataLoader, DataLoadingSkeletonType, DataLoadingStatus } from '@components/common';
import { OrderInfo } from './info';
import { OrderChanges } from './changes';
import OrderNotifications from './notification/Notification';

const OrderDetails = ({ id }: { id: string }) => {
  const [dataLoadingStatus, setDataLoadingStatus] = useState<DataLoadingStatus>();
  const [data, setData] = useState<IOrder>();
  const [customHoverTab, setCustomHoverTab] = useState('1');
  const t = useTranslate('COMP_Order.DETAILS');
  const toast = useToast();
  const apiClient = useAPIAuthClient();
  const router = useRouter();

  const loadData = useCallback(() => {
    setDataLoadingStatus(DataLoadingStatus.pending);
    apiClient.select<IOrder>(endpoints.orders.details, { urlParams: { id } }).then(
      (data: IOrder) => {
        if (data && data.number) {
          setData(data);
          setTimeout(() => {
            setDataLoadingStatus(DataLoadingStatus.done);
          }, 600);
        } else {
          toast.error(t('ERR_NOT_FOUNDED'));
          setTimeout(() => {
            router.replace('/orders');
          }, 400);
        }
      },
      err => {
        toast.error(err.toString());
        setDataLoadingStatus(DataLoadingStatus.done);
      },
    );
  }, [apiClient, id, router, t, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const tabs = [
    {
      id: '1',
      title: t('TAP_HEADER_ORDER_INFO'),
      icon: <i className="las la-exclamation-circle nav-icon nav-tab-position" />,
      comp: (
        <OrderInfo
          data={data || null}
          apiClient={apiClient}
          dataLoadingStatus={dataLoadingStatus}
          toast={toast}
          setDataLoadingStatus={setDataLoadingStatus}
          loadData={loadData}
          id={id}
        />
      ),
    },
    {
      id: '2',
      title: t('TAP_HEADER_CHANGES'),
      icon: <i className="ri-git-pull-request-line nav-icon nav-tab-position" />,
      comp: <OrderChanges orderId={data?.id} />,
    },
    {
      id: '3',
      title: t('TAP_HEADER_NOTIFICATIONS'),
      icon: <i className="ri-notification-2-line nav-icon nav-tab-position" />,
      comp: <OrderNotifications orderId={data?.id} />,
    },
  ];

  const customHoverToggle = tab => {
    if (customHoverTab !== tab) {
      setCustomHoverTab(tab);
    }
  };

  return (
    <DataLoader status={dataLoadingStatus} skeleton={DataLoadingSkeletonType.card}>
      <BreadCrumb
        title={t('ORDER_DETAILS')}
        paths={[
          { label: t('ORDER_TITLE'), relativePath: '/orders' },
          { label: '#' + data?.number || t('ORDER_DETAILS'), relativePath: '', isActive: true },
        ]}
      />
      <Card>
        <div className="border">
          <Nav pills className="nav nav-pills custom-hover-nav-tabs">
            {tabs.map(elem => (
              <NavItem key={'prod-tab-' + elem.id}>
                <NavLink
                  style={{ cursor: 'pointer' }}
                  className={classnames({ active: customHoverTab === elem.id })}
                  onClick={() => {
                    customHoverToggle(elem.id);
                  }}
                >
                  {elem.icon}
                  <h5 className="nav-titl nav-tab-position m-0">{elem.title}</h5>
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </div>
        <CardBody>
          <TabContent activeTab={customHoverTab} className="text-muted">
            {tabs.map(elem => (
              <TabPane key={'prod-tab-pane-' + elem.id} tabId={elem.id}>
                {elem.comp}
              </TabPane>
            ))}
          </TabContent>
        </CardBody>
      </Card>
    </DataLoader>
  );
};
export default OrderDetails;

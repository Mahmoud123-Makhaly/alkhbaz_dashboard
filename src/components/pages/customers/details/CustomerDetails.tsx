'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Card, Nav, NavItem, NavLink, CardBody, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { useRouter } from 'next-intl/client';

import { BreadCrumb, DataLoader, DataLoadingSkeletonType, DataLoadingStatus, EmptyTable } from '@components/common';
import { ICustomerItem } from '@app/types';
import { useAPIAuthClient, useTranslate, useToast } from '@app/hooks';
import { endpoints } from '@app/libs';
import { OrderList } from '@components/pages';

import { CustomerInfo } from './info';
import { CustomerChanges } from './changes';
import { CustomerAddress } from './address';

const CustomerDetails = ({ id }: { id: string }) => {
  const [dataLoadingStatus, setDataLoadingStatus] = useState<DataLoadingStatus>(DataLoadingStatus.done);
  const [data, setData] = useState<ICustomerItem | null>(null);
  const [customHoverTab, setCustomHoverTab] = useState('1');
  const t = useTranslate('COMP_CustomerDetails.DETAILS');
  const toast = useToast();
  const apiClient = useAPIAuthClient();
  const router = useRouter();

  const loadData = useCallback(() => {
    setDataLoadingStatus(DataLoadingStatus.pending);
    apiClient.select<ICustomerItem>(endpoints.customers.details, { urlParams: { id } }).then(
      (data: ICustomerItem) => {
        if (data && data['data'] === undefined) {
          setData(data);
          setTimeout(() => {
            setDataLoadingStatus(DataLoadingStatus.done);
          }, 600);
        } else {
          toast.error(t('ERR_NOT_FOUNDED'));
          setTimeout(() => {
            router.replace('/customers');
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
      title: t('TAB_HEADER_INFO'),
      icon: <i className="las la-exclamation-circle nav-icon nav-tab-position" />,
      comp: (
        <CustomerInfo
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
      id: '3',
      title: t('TAB_HEADER_ADDRESSES'),
      icon: <i className="ri-earth-line nav-icon nav-tab-position" />,
      comp: (
        <CustomerAddress
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
      id: '5',
      title: t('TAB_HEADER_ORDERS'),
      icon: <i className="ri-shopping-bag-line nav-icon nav-tab-position" />,
      comp: id ? (
        <OrderList controlledFilter={{ customerId: id }} customerInfo={data || undefined} disableAdvancedSearch />
      ) : (
        <EmptyTable />
      ),
    },
    // {
    //   id: '6',
    //   title: t('TAB_HEADER_CARTS'),
    //   icon: <i className="ri-shopping-cart-2-line nav-icon nav-tab-position" />,
    //   comp: <h1>Carts</h1>,
    // },
    {
      id: '7',
      title: t('TAP_HEADER_CHANGES'),
      icon: <i className="ri-git-pull-request-line nav-icon nav-tab-position" />,
      comp: <CustomerChanges customerId={id} />,
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
        title={t('CUSTOMER_DETAILS')}
        paths={[
          { label: t('BC_CUSTOMER_LABEL'), relativePath: '/customers' },
          { label: data?.fullName || t('ORDER_DETAILS'), relativePath: '', isActive: true },
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
export default CustomerDetails;

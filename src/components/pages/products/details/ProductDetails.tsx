'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next-intl/client';
import { Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { ProductInfo } from './info';
import { FulfillmentCenters } from './fulfillment-centers';
import { ImagesGallery } from './images';
import { PriceList } from './price-list';
import { SEO } from './seo';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import { DataLoadingStatus, IBreadCrumbProps, BreadCrumb } from '@components/common';
import {
  IPricesList,
  IProductDetails,
  IProductFulfillmentCenterList,
  IProductItem,
  IProductPriceWidgetList,
  IRateReviewList,
} from '@app/types';
import { endpoints } from '@app/libs';
import NoImage from '@assets/img/no-image.png';
import { Utils } from '@helpers/utils';

const ProductDetails = ({ id, catalogId }: { id: string; catalogId: string }) => {
  const [dataLoadingStatus, setDataLoadingStatus] = useState<DataLoadingStatus>();
  const [data, setData] = useState<IProductDetails | null>(null);
  const [breadCrumbData, setBreadCrumbData] = useState<IBreadCrumbProps | undefined>();
  const [customHoverTab, setCustomHoverTab] = useState('1');
  const t = useTranslate('COMP_PRODUCT_DETAILS.DETAILS');
  const toast = useToast();
  const apiClient = useAPIAuthClient();
  const router = useRouter();

  const productDetailsEndpoints = useMemo(
    () => [
      {
        endpoint: endpoints.products.info,
        dummyEndpoint: '/demo/data/ProductInfo',
        payload: { urlParams: { id } },
        type: 'info',
        method: 'GET',
      },
      {
        endpoint: endpoints.products.fulfillmentCenters,
        dummyEndpoint: '/demo/data/ProductFulfillmentCenters',
        payload: { urlParams: { id } },
        type: 'ffc',
        method: 'GET',
      },
      {
        endpoint: endpoints.products.prices,
        dummyEndpoint: '/demo/data/ProductPriceLists',
        payload: { urlParams: { id } },
        type: 'prices',
        method: 'GET',
      },
      {
        endpoint: endpoints.products.pricesWidget,
        dummyEndpoint: '/demo/data/ProductPriceWidget',
        payload: { urlParams: { id, catalogId } },
        type: 'pw',
        method: 'GET',
      },
      {
        endpoint: endpoints.reviews.list,
        dummyEndpoint: '/demo/data/ProductReviewList',
        payload: {
          entityIds: [id],
          entityType: 'Product',
          reviewStatus: null,
          sort: { rating: 'desc' },
          skip: 0,
          take: 1000000,
        },
        type: 'rl',
        method: 'SEARCH',
      },
    ],
    [catalogId, id],
  );

  const getList = useCallback(
    async <T extends IProductItem | IProductFulfillmentCenterList | IProductPriceWidgetList | IPricesList>(
      endpoint: string,
      payload: any,
    ): Promise<T | string | null> =>
      new Promise((resolve, reject) =>
        apiClient
          .select<T>(endpoint, payload)
          .then(
            data => {
              if (data) {
                resolve(data);
              } else resolve(null);
            },
            err => reject(err),
          )
          .catch(reason => reject(reason)),
      ),
    [apiClient],
  );
  const search = useCallback(
    async <T extends IRateReviewList>(endpoint: string, payload: any): Promise<T | string | null> =>
      new Promise((resolve, reject) =>
        apiClient
          .search<T>(endpoint, payload)
          .then(
            data => {
              if (data) {
                resolve(data);
              } else resolve(null);
            },
            err => reject(err),
          )
          .catch(reason => reject(reason)),
      ),
    [apiClient],
  );
  const getDummyList = useCallback(
    async <T extends IProductItem | IProductFulfillmentCenterList | IProductPriceWidgetList | IPricesList>(
      endpoint: string,
      payload: any,
    ): Promise<T | string | null> =>
      new Promise((resolve, reject) =>
        Utils.loadJSON(endpoint)
          .then(
            data => {
              if (data) {
                resolve(data);
              } else resolve(null);
            },
            err => reject(err),
          )
          .catch(reason => reject(reason)),
      ),
    [],
  );

  const loadData = useCallback(async () => {
    setDataLoadingStatus(DataLoadingStatus.pending);
    const promises: Array<
      Promise<
        | IProductItem
        | IProductFulfillmentCenterList
        | IProductPriceWidgetList
        | IPricesList
        | IRateReviewList
        | null
        | string
      >
    > = [];
    productDetailsEndpoints.map(item =>
      promises.push(item.method === 'GET' ? getList(item.endpoint, item.payload) : search(item.endpoint, item.payload)),
    );
    //productDetailsEndpoints.map(item => promises.push(getDummyList(item.dummyEndpoint, item.payload)));
    Promise.all(promises)
      .then(
        values => {
          if (values && values[0]) {
            const info = values[0] as IProductItem;
            const fulfillmentCenters = values[1] as IProductFulfillmentCenterList;
            const prices = values[2] as IPricesList;
            const priceWidgets = values[3] as IProductPriceWidgetList;
            const reviewList = values[4] as IRateReviewList;
            setData({
              info: { ...info, imgSrc: info.imgSrc || NoImage.src },
              fulfillmentCenters,
              prices,
              priceWidgets,
              reviewList,
            });
            setTimeout(() => {
              if (info.outlines && info.outlines[0] && info.outlines[0].items) {
                const BCData: IBreadCrumbProps = {
                  title: info.name,
                  paths: info.outlines[0].items.map(item => ({
                    label: item.name,
                    isActive: item.id === info.id,
                    relativePath:
                      item.seoObjectType === 'Catalog'
                        ? `/catalogs?name=${item.name}`
                        : item.seoObjectType === 'Category'
                        ? `/categories?name=${item.name}`
                        : '#',
                  })),
                };
                setBreadCrumbData(BCData);
              }
              setDataLoadingStatus(DataLoadingStatus.done);
            }, 1000);
          } else
            setTimeout(() => {
              router.replace('/products');
            }, 700);
        },
        err => {
          toast.error(t('ERR_GENERIC_MSG', { trace: process.env.NODE_ENV === 'development' ? err : '' }));
          setTimeout(() => {
            router.replace('/products');
          }, 700);
        },
      )
      .catch(reason => {
        toast.error(t('ERR_GENERIC_MSG', { trace: process.env.NODE_ENV === 'development' ? reason : '' }));
        setTimeout(() => {
          router.replace('/products');
        }, 700);
      });
  }, [getList, productDetailsEndpoints, router, search, t, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const tabs = [
    {
      id: '1',
      title: t('TAP_HEADER_PRODUCT_INFO'),
      icon: <i className="las la-exclamation-circle nav-icon nav-tab-position" />,
      comp: (
        <ProductInfo
          id={id}
          catalogId={catalogId}
          apiClient={apiClient}
          data={data}
          toast={toast}
          dataLoadingStatus={dataLoadingStatus}
          setDataLoadingStatus={setDataLoadingStatus}
          loadData={loadData}
        />
      ),
    },
    {
      id: '2',
      title: t('TAP_HEADER_IMAGES_GALLERY'),
      icon: <i className="ri-image-line nav-icon nav-tab-position" />,
      comp: (
        <ImagesGallery
          id={id}
          catalogId={catalogId}
          apiClient={apiClient}
          data={data}
          toast={toast}
          dataLoadingStatus={dataLoadingStatus}
          setDataLoadingStatus={setDataLoadingStatus}
          loadData={loadData}
        />
      ),
    },
    {
      id: '3',
      title: t('TAP_HEADER_PRICE_LIST'),
      icon: <i className="ri-money-dollar-circle-line nav-icon nav-tab-position" />,
      comp: (
        <PriceList
          id={id}
          catalogId={catalogId}
          apiClient={apiClient}
          data={data}
          toast={toast}
          dataLoadingStatus={dataLoadingStatus}
          setDataLoadingStatus={setDataLoadingStatus}
          loadData={loadData}
        />
      ),
    },
    {
      id: '4',
      title: t('TAP_HEADER_FULFILLMENT_CENTERS'),
      icon: <i className="ri-store-3-line nav-icon nav-tab-position" />,
      comp: (
        <FulfillmentCenters
          id={id}
          catalogId={catalogId}
          apiClient={apiClient}
          data={data}
          toast={toast}
          dataLoadingStatus={dataLoadingStatus}
          setDataLoadingStatus={setDataLoadingStatus}
          loadData={loadData}
        />
      ),
    },
    {
      id: '5',
      title: t('TAP_HEADER_SEO'),
      icon: <i className="ri-google-line nav-icon nav-tab-position" />,
      comp: (
        <SEO
          id={id}
          catalogId={catalogId}
          apiClient={apiClient}
          data={data}
          toast={toast}
          dataLoadingStatus={dataLoadingStatus}
          setDataLoadingStatus={setDataLoadingStatus}
          loadData={loadData}
        />
      ),
    },
  ];

  const customHoverToggle = tab => {
    if (customHoverTab !== tab) {
      setCustomHoverTab(tab);
    }
  };
  return (
    <React.Fragment>
      {breadCrumbData && <BreadCrumb {...breadCrumbData} />}
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
    </React.Fragment>
  );
};
export default ProductDetails;

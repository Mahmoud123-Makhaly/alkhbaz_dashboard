'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next-intl/client';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ListGroup,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  UncontrolledDropdown,
} from 'reactstrap';
import moment from 'moment';
import classnames from 'classnames';
//Simple bar
import SimpleBar from 'simplebar-react';

import {
  ClientOnly,
  DataLoader,
  DataLoadingSkeletonType,
  DataLoadingStatus,
  EndSideBar,
  Rating,
} from '@components/common';
import { endpoints } from '@app/libs';

import { useTranslate } from '@app/hooks';
import { SwiperWithPreview, DeleteModal } from '@components/common';
import { IRateReviewList } from '@app/types';

import ProductReview from './Review';
import withProductDetails, { IWithProductDetailsProps } from '../ProductDetails.hoc';
import RatingStatistics from './RatingStatistics';
import PricingWidgetList from './PricingWidget';
import ProductDetailsForm from './ProductDetailsForm';
import ProductDetailsDescriptionForm from './ProductDetailsDescriptionForm';
import ProductDescPreview from './ProductDescPreview';
import ProductDetailsVariationForm from './ProductDetailsVariationForm';
import ProductVariationPreview from './ProductVariationPreview';
import InfoPreview from './InfoPreview';
import SpecsPreview from './SpecsPreview';

function ProductInfo({
  id,
  catalogId,
  apiClient,
  data,
  dataLoadingStatus,
  toast,
  loadData,
  setDataLoadingStatus,
}: IWithProductDetailsProps) {
  const t = useTranslate('COMP_PRODUCT_DETAILS.PRODUCT_INFO');
  const router = useRouter();
  const [customActiveTab, setCustomActiveTab] = useState('1');
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<{
    mode: 'new' | 'edit' | null;
    form?: 'details' | 'desc' | 'var';
    header?: string;
    id?: string;
    width?: string;
  }>({
    mode: null,
  });
  const [infoData, setInfoData] = useState<{
    reviewList?: IRateReviewList;
    PricingWidgetList: Array<{
      icon: string;
      label: string;
      details: React.ReactNode;
    }>;
  }>();
  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab);
    }
  };

  useEffect(() => {
    if (data && data?.info) {
      const _infoData: {
        reviewList?: IRateReviewList;
        PricingWidgetList: Array<{
          icon: string;
          label: string;
          details: React.ReactNode;
        }>;
      } = { reviewList: undefined, PricingWidgetList: [] };
      if (data.reviewList && data.reviewList.results && data.reviewList.results.length > 0) {
        _infoData.reviewList = data.reviewList;
      }
      if (data.priceWidgets && data.priceWidgets.length > 0) {
        _infoData.PricingWidgetList.push({
          icon: 'ri-money-dollar-circle-fill',
          label: t('PRICE'),
          details: (
            <h5 className="mb-0">{`EGP ${data.priceWidgets[0].sale?.toLocaleString('en-US') || 0}-${
              data.priceWidgets[0].list?.toLocaleString('en-US') || 0
            }`}</h5>
          ),
        });
      }
      if (data.fulfillmentCenters && data.fulfillmentCenters.length > 0) {
        _infoData.PricingWidgetList.push({
          icon: 'ri-stack-fill',
          label: t('AVAILABLE_STOCKS'),
          details: (
            <h5 className="mb-0">
              {data.fulfillmentCenters.filter(x => x.inStockQuantity > 0).length.toLocaleString('en-US')}
            </h5>
          ),
        });
        _infoData.PricingWidgetList.push({
          icon: 'ri-shopping-basket-2-fill',
          label: t('STOCK'),
          details: (
            <h5 className="mb-0">
              {data.fulfillmentCenters
                .reduce((accumulator, object) => {
                  return accumulator + object.inStockQuantity;
                }, 0)
                .toLocaleString('en-US')}
            </h5>
          ),
        });
      }
      setInfoData(_infoData);
    }
  }, [data, t]);

  const handleEditProdDetails = () => {
    modalToggle('edit', 'details', undefined, '40%');
  };
  const handleAddProdDetailsDescription = () => {
    modalToggle('new', 'desc');
  };
  const handleEditProdDetailsDescription = descId => {
    modalToggle('edit', 'desc', descId);
  };
  const handleAddVariationProd = () => {
    modalToggle('new', 'var', undefined, '40%');
  };

  const modalToggle = (mode: 'new' | 'edit' | null, form?: 'details' | 'desc' | 'var', id?: string, width?: string) => {
    if (mode === null || !form) {
      setModalMode({ mode: null });
    }
    if (form && mode) {
      switch (form) {
        case 'details':
          setModalMode({ mode: mode, form, header: t(mode === 'edit' ? 'EDIT_PRODUCT' : 'ADD_PRODUCT'), width });
          break;
        case 'desc':
          setModalMode({
            mode: mode,
            form,
            header: t(mode === 'edit' ? 'EDIT_PRODUCT_DESCRIPTION' : 'ADD_PRODUCT_DESCRIPTION'),
            id: mode === 'edit' ? id : undefined,
            width,
          });
          break;
        case 'var':
          setModalMode({
            mode: mode,
            form,
            header: t(mode === 'edit' ? 'EDIT_VARIATION_PRODUCT' : 'ADD_VARIATION_PRODUCT'),
            width,
          });
          break;
      }
    }
  };

  const handleFormSubmit = (): void => {
    modalToggle(null);
    setDataLoadingStatus(DataLoadingStatus.pending);
    loadData();
  };

  const handleDelete = (): void => {
    setDeleteModal(false);
    setDataLoadingStatus(DataLoadingStatus.pending);
    apiClient.delete(endpoints.products.delete, { ids: id }).then(
      data => {
        if (data) {
          setTimeout(() => {
            toast.success(t('DELETE_SUCCESS_MSG'));
            setTimeout(() => {
              router.replace('/products');
            }, 700);
          }, 300);
        } else {
          setDataLoadingStatus(DataLoadingStatus.done);
          toast.error(t('ERR_DELETE_MSG'));
        }
      },
      err => {
        toast.error(err.toString());
        setDataLoadingStatus(DataLoadingStatus.done);
      },
    );
  };

  return (
    <ClientOnly>
      <DeleteModal show={deleteModal} onDeleteClick={() => handleDelete()} onCloseClick={() => setDeleteModal(false)} />

      <DataLoader status={dataLoadingStatus} skeleton={DataLoadingSkeletonType.card}>
        {data && data?.info && (
          <ClientOnly>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <Row className="gx-lg-5">
                      <Col xl={4} md={8} className="mx-auto">
                        <SwiperWithPreview
                          images={
                            data!.info.images && data!.info.images.length > 0
                              ? data!.info.images.map(x => x.url)
                              : [data!.info.imgSrc]
                          }
                        />
                      </Col>

                      <Col xl={8}>
                        <div className="mt-xl-0 mt-5">
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <h4>
                                {data.info.name}
                                <h6 className="text-muted">
                                  (Code: <span className="text-body fw-medium p-1">{data.info.code || t('N/A')}</span>,
                                  OuterId:
                                  <span className="text-body fw-medium p-1">{data.info.outerId || t('N/A')}</span>)
                                </h6>
                              </h4>
                              <div className="hstack gap-3 flex-wrap">
                                <div className="text-muted">
                                  {t('MODIFIED_BY')}:
                                  <span className="text-body fw-medium p-1">{data.info.modifiedBy}</span>
                                </div>
                                <div className="vr"></div>
                                <div className="text-muted">
                                  {t('SELLER')}: <span className="text-body fw-medium p-1">Al Khbaz</span>
                                </div>
                                <div className="vr"></div>
                                <div className="text-muted">
                                  {t('CREATED_AT')}: &nbsp;
                                  <span className="text-body fw-medium p-1">
                                    {moment(data.info?.createdDate).format('DD, MMM yyyy')}
                                  </span>
                                </div>
                                <div className="vr"></div>
                                <div className="text-muted">
                                  {t('CATALOG')}:
                                  <span className="text-body fw-medium p-1">
                                    {data.info.outlines
                                      ? data.info.outlines[0].items?.find(x => x.seoObjectType === 'Catalog')?.name ||
                                        t('N/A')
                                      : t('N/A')}
                                  </span>
                                </div>
                                <div className="vr"></div>
                                <div className="text-muted">
                                  {t('CATEGORY')}:
                                  <span className="text-body fw-medium p-1">
                                    {data.info.outlines
                                      ? data.info.outlines[0].items
                                          ?.filter(x => x.seoObjectType === 'Category')
                                          .map(x => x.name)
                                          ?.join(' > ') || t('N/A')
                                      : t('N/A')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <Button color="danger" outline onClick={() => setDeleteModal(true)}>
                                <i className="ri-delete-bin-fill align-bottom"></i>
                              </Button>
                            </div>
                            <div className="flex-shrink-0 mx-2">
                              <Button className="btn btn-light" onClick={() => handleEditProdDetails()}>
                                <i className="ri-pencil-fill align-bottom"></i>
                              </Button>
                            </div>
                            <div className="flex-shrink-0">
                              <ButtonGroup>
                                <UncontrolledDropdown>
                                  <DropdownToggle tag="button" className="btn btn-primary p-accordion-header-link">
                                    <i className="ri-add-fill"></i>
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem onClick={() => handleAddProdDetailsDescription()}>
                                      {t('DESCRIPTION')}
                                    </DropdownItem>
                                    <DropdownItem onClick={() => handleAddVariationProd()}>
                                      {t('VARIATION_PRODUCTS')}
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </ButtonGroup>
                            </div>
                          </div>

                          {infoData?.reviewList?.results ? (
                            <Rating
                              value={
                                infoData?.reviewList?.results.map(x => x.rating).reduce((a, b) => a + b, 0) /
                                infoData?.reviewList?.totalCount
                              }
                              info={`( ${infoData?.reviewList.totalCount} ${t('CUSTOMER_REVIEW_MSG')} )`}
                            />
                          ) : (
                            <Rating value={0} info={`( ${t('CUSTOMER_REVIEW_NOT_AVAILABLE_MSG')} )`} />
                          )}

                          <Row className="mt-4">
                            {infoData &&
                              infoData.PricingWidgetList.map((widget, key) => (
                                <PricingWidgetList
                                  key={'price-widget-' + key}
                                  label={widget.label}
                                  icon={widget.icon}
                                  details={widget.details}
                                />
                              ))}
                          </Row>

                          <div className="mt-4 text-muted">
                            <h5 className="fs-14">{t('DESCRIPTION')} :</h5>

                            {data.info.reviews && data.info.reviews.length > 0 ? (
                              <p
                                dir={
                                  data.info.reviews[0].languageCode &&
                                  data.info.reviews[0].languageCode.startsWith('ar')
                                    ? 'rtl'
                                    : 'ltr'
                                }
                              >
                                {data.info.reviews[0].content}
                              </p>
                            ) : (
                              <p>{t('NO_DESCRIPTION')}</p>
                            )}
                          </div>

                          <div className="product-content mt-5">
                            <h5 className="fs-14 mb-3">{t('DETAILS')} :</h5>
                            <Nav tabs className="nav-tabs-custom nav-success">
                              <NavItem>
                                <NavLink
                                  style={{ cursor: 'pointer' }}
                                  className={classnames({
                                    active: customActiveTab === '1',
                                  })}
                                  onClick={() => {
                                    toggleCustom('1');
                                  }}
                                >
                                  {t('MEASUREMENTS')}
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink
                                  style={{ cursor: 'pointer' }}
                                  className={classnames({
                                    active: customActiveTab === '4',
                                  })}
                                  onClick={() => {
                                    toggleCustom('4');
                                  }}
                                >
                                  {t('SPECS')}
                                </NavLink>
                              </NavItem>
                              {data?.info?.reviews && data?.info?.reviews.length > 0 && (
                                <NavItem>
                                  <NavLink
                                    style={{ cursor: 'pointer' }}
                                    className={classnames({
                                      active: customActiveTab === '2',
                                    })}
                                    onClick={() => {
                                      toggleCustom('2');
                                    }}
                                  >
                                    {t('DESCRIPTION')}
                                  </NavLink>
                                </NavItem>
                              )}
                              {data?.info?.variations && data?.info?.variations.length > 0 && (
                                <NavItem>
                                  <NavLink
                                    style={{ cursor: 'pointer' }}
                                    className={classnames({
                                      active: customActiveTab === '3',
                                    })}
                                    onClick={() => {
                                      toggleCustom('3');
                                    }}
                                  >
                                    {t('VARIATION_PRODUCTS')}
                                  </NavLink>
                                </NavItem>
                              )}
                            </Nav>
                            <SimpleBar className="simplebar-track-info me-lg-n3 pe-lg-4" style={{ height: '400px' }}>
                              <TabContent
                                activeTab={customActiveTab}
                                className="border border-top-0 p-4"
                                id="nav-tabContent"
                              >
                                {data.info && (
                                  <TabPane id="nav-speci" tabId="1">
                                    <InfoPreview product={data.info} />
                                  </TabPane>
                                )}
                                {data.info && (
                                  <TabPane id="nav-speci" tabId="4">
                                    <SpecsPreview product={data.info} />
                                  </TabPane>
                                )}
                                {data?.info?.reviews && data?.info?.reviews.length > 0 && (
                                  <TabPane id="nav-detail" tabId="2">
                                    <ProductDescPreview
                                      apiClient={apiClient}
                                      data={data}
                                      toast={toast}
                                      dataLoadingStatus={dataLoadingStatus}
                                      setDataLoadingStatus={setDataLoadingStatus}
                                      loadData={loadData}
                                      onEdit={handleEditProdDetailsDescription}
                                    />
                                  </TabPane>
                                )}
                                {data?.info?.variations && data?.info?.variations.length > 0 && (
                                  <TabPane id="nav-detail" tabId="3">
                                    <ListGroup className="mb-1 table-hover">
                                      <ProductVariationPreview
                                        apiClient={apiClient}
                                        data={data}
                                        toast={toast}
                                        dataLoadingStatus={dataLoadingStatus}
                                        setDataLoadingStatus={setDataLoadingStatus}
                                        loadData={loadData}
                                      />
                                    </ListGroup>
                                  </TabPane>
                                )}
                              </TabContent>
                            </SimpleBar>
                          </div>

                          <div className="mt-5">
                            <div>
                              <h5 className="fs-14 mb-3">{t('RATING_AND_REVIEWS_TITLE')}</h5>
                            </div>
                            <Row className="gy-4 gx-0">
                              <Col lg={4}>
                                <RatingStatistics rates={infoData?.reviewList?.results.map(x => x.rating) || []} />
                              </Col>

                              <Col lg={8}>
                                <div className="ps-lg-4">
                                  <div className="d-flex flex-wrap align-items-start gap-3">
                                    <h5 className="fs-14">{t('REVIEWS')} : </h5>
                                  </div>

                                  {infoData?.reviewList?.results && infoData?.reviewList?.results.length > 0 ? (
                                    <SimpleBar
                                      className="simplebar-track-success me-lg-n3 pe-lg-4"
                                      style={{ maxHeight: '225px' }}
                                    >
                                      <ul className="list-unstyled mb-0">
                                        {infoData?.reviewList.results.map((review, key) => (
                                          <ProductReview
                                            key={key}
                                            rating={review.rating.toString()}
                                            comment={review.review}
                                            username={review.userName}
                                            date={review.createdDate}
                                          />
                                        ))}
                                      </ul>
                                    </SimpleBar>
                                  ) : (
                                    <ul className="list-unstyled mb-0">
                                      <ProductReview comment={t('NO_REVIEWS')} />
                                    </ul>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <EndSideBar
              isOpen={!!modalMode.mode}
              title={modalMode.header || ''}
              toggle={() => modalToggle(null)}
              width={modalMode.width}
            >
              {modalMode.mode && modalMode.form && (
                <React.Fragment>
                  {modalMode.form === 'details' && (
                    <ProductDetailsForm
                      mode={modalMode.mode}
                      onCancel={() => modalToggle(null)}
                      onSubmit={handleFormSubmit}
                      apiClient={apiClient}
                      product={data.info}
                      toast={toast}
                    />
                  )}
                  {modalMode.form === 'desc' && (
                    <ProductDetailsDescriptionForm
                      mode={modalMode.mode}
                      id={modalMode.id}
                      onCancel={() => modalToggle(null)}
                      onSubmit={handleFormSubmit}
                      apiClient={apiClient}
                      product={data.info}
                      toast={toast}
                    />
                  )}
                  {modalMode.form === 'var' && (
                    <ProductDetailsVariationForm
                      onCancel={() => modalToggle(null)}
                      onSubmit={handleFormSubmit}
                      apiClient={apiClient}
                      product={data.info}
                      toast={toast}
                    />
                  )}
                </React.Fragment>
              )}
            </EndSideBar>
          </ClientOnly>
        )}
      </DataLoader>
    </ClientOnly>
  );
}

export default withProductDetails(ProductInfo);

'use client';

import { useState } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Badge, Button } from 'reactstrap';
import _ from 'lodash';
import Link from 'next-intl/link';
import { useRouter } from 'next-intl/client';

import { useTranslate } from '@app/hooks';
import { IOrderItem } from '@app/types';
import { Utils } from '@helpers/utils';
import { CustomerOrderStatus } from '@helpers/constants';
import { ClientOnly, DataLoadingStatus, DeleteModal, EndSideBar, ToolTip } from '@components/common';
import { endpoints } from '@app/libs';
import { OrderBasicForm } from '@components/pages';

import ItemCard from './ItemCard';
import StatusTimelineCard from './StatusTimelineCard';
import LogisticCard from './LogisticCard';
import CustomerCard from './CustomerCard';
import AddressCard from './AddressCard';
import PaymentCard from './PaymentCard';
import withOrderDetails, { IWithOrderDetailsProps } from '../OrderDetails.hoc';
import React from 'react';
import CancelReason from './CancelReason';

const OrderInfo = ({
  id,
  data,
  toast,
  apiClient,
  dataLoadingStatus,
  setDataLoadingStatus,
  loadData,
}: IWithOrderDetailsProps) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<{
    mode: 'new' | 'edit' | null;
    form?: 'details';
    header?: string;
    data?: any;
    width?: string;
  }>({
    mode: null,
  });
  const t = useTranslate('COMP_Order.INFO');
  const router = useRouter();

  const ffcName = data?.items.find(item => item.fulfillmentCenterName)?.fulfillmentCenterName || undefined;

  const handleEditOrderDetails = () => {
    modalToggle('edit', 'details', data);
  };

  const modalToggle = (mode: 'new' | 'edit' | null, form?: 'details' | 'desc' | 'var', data?: any, width?: string) => {
    if (mode === null || !form) {
      setModalMode({ mode: null });
    }
    if (form && mode) {
      switch (form) {
        case 'details':
          setModalMode({
            mode: mode,
            form,
            header: t(mode === 'edit' ? 'EDIT_ORDERS' : '', { number: data?.number }),
            data,
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
    apiClient.delete(endpoints.orders.delete, { ids: id }).then(
      data => {
        if (data) {
          setTimeout(() => {
            toast.success(t('DELETE_SUCCESS_MSG'));
            setTimeout(() => {
              router.replace('/orders');
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
      <Row>
        <Col md={8} className="px-0">
          <Card>
            <CardHeader>
              <div className="d-flex align-items-center">
                <h5 className="card-title flex-grow-1 mb-0">
                  {t('ORDER_DETAILS')}
                  <span className="text-muted mx-2">
                    (
                    {`${data?.number ? `#${data?.number}` : ''}${data?.outerId ? ` - OuterId: ${data?.outerId}` : ''}${
                      ffcName ? ` - ${t('FULFILLMENT_CENTER_NAME')}: ${ffcName}` : ''
                    } - ${t('ORDER_SOURCE')}: ${
                      data?.dynamicProperties?.find(x => x.name === 'orderSource')?.values[0].value || t('N/A')
                    }`}
                    )
                  </span>
                  {data?.status && (
                    <Badge
                      color={Utils.orderStatusColor(data?.status as CustomerOrderStatus)}
                      className={`p-1${
                        Utils.orderStatusColor(data?.status as CustomerOrderStatus) === 'light' ? ' text-dark' : ''
                      }`}
                    >
                      {t(`ORDER_STATUS_${Utils.enumKeyByValue(CustomerOrderStatus, data?.status)}`)}
                    </Badge>
                  )}
                </h5>
                <div className="flex-shrink-0">
                  <ToolTip placement="top" msg={t('INVOICE_BTN')} id="order-invoice-details">
                    <Link
                      href={process.env.NEXT_PUBLIC_CUSTOMER_WEBSITE_ORDER_INVOICE_PATH?.replace(':orderId', id) || ''}
                      className="btn btn-secondary"
                      target="_blank"
                      aria-label={`order number ${data?.number} invoice`}
                    >
                      <i className=" ri-file-list-3-line align-bottom"></i>
                    </Link>
                  </ToolTip>
                </div>
                <div className="flex-shrink-0 mx-2">
                  <Button color="danger" outline onClick={() => setDeleteModal(true)}>
                    <i className="ri-delete-bin-fill align-bottom"></i>
                  </Button>
                </div>
                <div className="flex-shrink-0">
                  <Button className="btn btn-light" onClick={() => handleEditOrderDetails()}>
                    <i className="ri-pencil-fill align-bottom"></i>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              {data?.items && data.items.length > 0 && (
                <div className="table-responsive table-card">
                  <table className="table table-nowrap align-middle table-borderless mb-0">
                    <thead className="table-light text-muted">
                      <tr>
                        <th scope="col">{t('TBL_HEADER_PRODUCT_DETAILS')}</th>
                        <th scope="col">{t('TBL_HEADER_ITEM_PRICE')}</th>
                        <th scope="col">{t('TBL_HEADER_QUANTITY')}</th>
                        <th scope="col">{t('TBL_HEADER_SKU')}</th>
                        <th scope="col">{t('TBL_TAX_TYPE')}</th>
                        <th scope="col" className="text-end">
                          {t('TBL_HEADER_TOTAL')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((product: IOrderItem) => (
                        <ItemCard product={product} key={'product-' + product.id} />
                      ))}
                      <tr className="border-top border-top-dashed">
                        <td colSpan={2}></td>
                        <td colSpan={2}>
                          <table className="table table-borderless mb-0">
                            <tbody>
                              <tr>
                                <td>{t('CALC_SUBTOTAL')}</td>
                                <td className="text-end">
                                  {data.subTotal} {data.currency}
                                </td>
                              </tr>
                              <tr>
                                <td>{t('CALC_DISCOUNT')}</td>
                                <td className="text-end">
                                  {data.discountTotal} {data.currency}
                                </td>
                              </tr>
                              <tr>
                                <td>{t('CALC_SHIPPING_SUBTOTAL')}</td>
                                <td className="text-end">
                                  {data.shippingSubTotal} {data.currency}
                                </td>
                              </tr>
                              <tr>
                                <td>{t('CALC_TOTAL_TAX')}</td>
                                <td className="text-end">
                                  {data.taxTotal} {data.currency}
                                </td>
                              </tr>
                              <tr className="border-top border-top-dashed">
                                <th scope="row">&nbsp;</th>
                                <th className="text-end">&nbsp;</th>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td colSpan={2} className="fw-medium p-0">
                          <table className="table table-borderless mb-0">
                            <tbody>
                              <tr>
                                <td>{t('CALC_PRODUCT_TYPES_COUNT')}</td>
                                <td className="text-end">{data.items.length || 0}</td>
                              </tr>
                              <tr>
                                <td>{t('CALC_TAX_TYPES')}</td>
                                <td className="text-end">{_.uniq(data.items.map(x => x.taxType)).join(', ')}</td>
                              </tr>
                              <tr>
                                <td>{t('CALC_PAYMENT_SUBTOTAL')}</td>
                                <td className="text-end">
                                  {data.paymentSubTotal} {data.currency}
                                </td>
                              </tr>
                              <tr>
                                <td>{t('CALC_SUBTOTAL_WITH_TAX')}</td>
                                <td className="text-end">
                                  {data.subTotalWithTax} {data.currency}
                                </td>
                              </tr>
                              <tr className="border-top border-top-dashed">
                                <th scope="row">{t('CALC_TOTAL', { currency: data.currency })}</th>
                                <th className="text-end">
                                  {data.total} {data.currency}
                                </th>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>

          {data?.childrenOperations && data?.childrenOperations.length > 0 && (
            <StatusTimelineCard
              data={data}
              loadData={loadData}
              id={id}
              apiClient={apiClient}
              toast={toast}
              dataLoadingStatus={undefined}
              setDataLoadingStatus={() => undefined}
            />
          )}
        </Col>

        <Col md={4}>
          {data?.cancelReason && <CancelReason reason={data?.cancelReason} />}
          {data?.shipments && data?.shipments.length > 0 && <LogisticCard shipments={data.shipments} />}

          {((data?.addresses && data.addresses.length > 0) || data?.customerName) && <CustomerCard data={data} />}

          {data?.addresses &&
            data.addresses.length > 0 &&
            data.addresses.map(add => <AddressCard address={add} key={'address-' + add.key} />)}

          {data?.inPayments && data?.inPayments.length > 0 && <PaymentCard orderPayments={data.inPayments} />}
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
              <OrderBasicForm
                mode={modalMode.mode}
                onCancel={() => modalToggle(null)}
                onSubmit={handleFormSubmit}
                data={data}
              />
            )}
          </React.Fragment>
        )}
      </EndSideBar>
    </ClientOnly>
  );
};
export default withOrderDetails(OrderInfo);

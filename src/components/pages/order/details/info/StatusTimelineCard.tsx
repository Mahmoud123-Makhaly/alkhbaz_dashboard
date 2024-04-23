'use client';

import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import {
  Card,
  CardHeader,
  CardBody,
  Collapse,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import classNames from 'classnames';
import { useLookup, useTranslate, useToast, useAPIAuthClient } from '@app/hooks';
import { Utils } from '@helpers/utils';
import { CustomerOrderStatus, OrderOperationTypes } from '@helpers/constants';
import { ILookupOption, IOrder, IOrderInPayment } from '@app/types';
import { orderStatuses, endpoints } from '@app/libs';
import { DataLoadingStatus, DataLoader, ConfirmationModal } from '@components/common';
import withOrderDetails, { IWithOrderDetailsProps } from '../OrderDetails.hoc';

const StatusTimelineCard = ({ data, toast, apiClient, loadData }: IWithOrderDetailsProps) => {
  const t = useTranslate('COMP_Order.INFO');
  const [accordionItem, setAccordionItem] = useState<string>('0');
  const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState<{ show: boolean; status?: string }>({
    show: false,
  });
  const [dataLoadingStatus, setDataLoadingStatus] = useState<DataLoadingStatus>();
  const [orderStatusData, setOrderStatusData] = useState<Array<ILookupOption>>();
  const lookup = useLookup([orderStatuses]);

  function toggleAccordion(item: string) {
    setAccordionItem(item);
  }

  const formatDateTime = (date?: Date, withTime?: boolean) =>
    moment(date).format(`ddd, DD MMM yyyy${withTime ? ' hh:mm A' : ''}`);

  const onStatusChange = (status: string) => {
    setConfirmationModalIsOpen({ show: true, status });
  };

  const updateOrder = useCallback(() => {
    setDataLoadingStatus(DataLoadingStatus.pending);
    apiClient
      .update<IOrder>(endpoints.orders.update, { ...data, status: confirmationModalIsOpen.status })
      .then(
        results => {
          if (results.status === 204) {
            toast.success(t('UPDATE_SUCCESS'));
            setTimeout(() => {
              loadData();
            }, 500);
          } else {
            toast.error(t('ERR_GENERIC_MSG', { trace: '' }));
            setDataLoadingStatus(DataLoadingStatus.done);
          }
        },
        err => {
          toast.error(err.toString());
          setDataLoadingStatus(DataLoadingStatus.done);
        },
      )
      .finally(() => {
        setConfirmationModalIsOpen({ show: false, status: undefined });
      });
  }, [apiClient, confirmationModalIsOpen.status, data, loadData, t, toast]);

  useEffect(() => {
    lookup.load().then(
      data => {
        setOrderStatusData(data.orderStatuses);
        setTimeout(() => {
          setDataLoadingStatus(DataLoadingStatus.done);
        }, 500);
      },
      err => {
        toast.error(t('ERR_GENERIC_MSG', { trace: process.env.NODE_ENV === 'development' ? JSON.stringify(err) : '' }));
        setDataLoadingStatus(DataLoadingStatus.done);
      },
    );
  }, []);

  return (
    <DataLoader status={dataLoadingStatus}>
      <ConfirmationModal
        show={confirmationModalIsOpen.show}
        isLoading={false}
        header={t('CHANGE_STATUS_MODAL_HEADER')}
        iconClass="ri-question-line text-primary"
        msg={t('CHANGE_STATUS_MODAL_MSG', { status: confirmationModalIsOpen.status })}
        onSubmit={function (): void {
          updateOrder();
        }}
        onCancel={function (): void {
          setConfirmationModalIsOpen({ show: false, status: undefined });
        }}
      />
      <Card>
        <CardHeader>
          <div className="d-sm-flex align-items-center">
            <h5 className="card-title flex-grow-1 mb-0">{t('STC_HEADER')}</h5>
            <div
              className={`flex-shrink-0 mt-2 mt-sm-0${
                data?.status === CustomerOrderStatus.Completed || data?.status === CustomerOrderStatus.Cancelled
                  ? ' disabled'
                  : ''
              }`}
            >
              {orderStatusData && (
                <UncontrolledDropdown className="dropdown d-inline-block">
                  <DropdownToggle
                    className={`btn btn-${Utils.orderStatusColor(data!.status as CustomerOrderStatus)} ${
                      Utils.orderStatusColor(data!.status as CustomerOrderStatus) === 'light'
                        ? ' bg-light text-dark'
                        : ''
                    } btn-sm`}
                    tag="button"
                  >
                    {data!.status
                      ? t(`ORDER_STATUS_${Utils.enumKeyByValue(CustomerOrderStatus, data!.status)}`)
                      : t('ORDER_NO_STATUS')}
                    <i className="mdi mdi-chevron-down"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    {orderStatusData.map((elem, indx) => (
                      <DropdownItem
                        key={'order-status-' + indx}
                        onClick={e => {
                          onStatusChange(elem.value);
                        }}
                      >
                        {elem.value}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="profile-timeline">
            <div className="accordion accordion-flush">
              {data!.childrenOperations.map((op: IOrderInPayment, index: number) => (
                <div key={op.id} className="accordion-item border-0" onClick={() => op.id && toggleAccordion(op.id)}>
                  <div className="accordion-header">
                    <a
                      role="button"
                      className={classNames('accordion-button', 'p-2', 'shadow-none', {
                        collapsed: accordionItem != op.id && accordionItem != '0',
                      })}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 avatar-xs">
                          <div className="avatar-title bg-success rounded-circle">
                            <i className={Utils.orderOperationTypesIcon(OrderOperationTypes[op.operationType])}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="fs-15 mb-0 fw-semibold">
                            {op.operationType} - <span className="fw-normal">{formatDateTime(op.modifiedDate)}</span>
                          </h6>
                        </div>
                      </div>
                    </a>
                  </div>
                  <Collapse className="accordion-collapse" isOpen={accordionItem === op.id || accordionItem === '0'}>
                    <div className="accordion-body ms-2 ps-5 pt-0">
                      <h6 className="mb-1">{'#' + op.number}</h6>
                      <p className="text-muted">{formatDateTime(op.modifiedDate, true)}</p>
                    </div>
                  </Collapse>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </DataLoader>
  );
};

export default withOrderDetails(StatusTimelineCard);

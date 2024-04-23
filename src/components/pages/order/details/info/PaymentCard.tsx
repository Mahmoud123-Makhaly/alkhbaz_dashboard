'use client';

import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { IOrderInPayment } from '@app/types';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { useTranslate } from '@app/hooks';

const PaymentCard = ({ orderPayments }: { orderPayments: Array<IOrderInPayment> }) => {
  const t = useTranslate('COMP_Order.INFO');
  const recentPayment = _.maxBy(orderPayments, x => x.createdDate);
  const formatDateTime = (date: Date) => moment(date).format('DD, MMM yyyy hh:mm A');
  return (
    <Card>
      <CardHeader>
        <h5 className="card-title mb-0">
          <i className="ri-secure-payment-line align-bottom me-1 text-muted"></i> {t('PC_HEADER')}
        </h5>
      </CardHeader>
      <CardBody>
        <div className="d-flex align-items-center mb-2">
          <div className="flex-shrink-0">
            <p className="text-muted mb-0">{t('PC_TRANSACTION_NUMBER')}</p>
          </div>
          <div className="flex-grow-1 ms-2">
            <h6 className="mb-0">#{recentPayment?.number}</h6>
          </div>
        </div>
        <div className="d-flex align-items-center mb-2">
          <div className="flex-shrink-0">
            <p className="text-muted mb-0">{t('PC_PAYMENT_STATUS')}</p>
          </div>
          <div className="flex-grow-1 ms-2">
            <h6 className="mb-0">{recentPayment?.paymentStatus}</h6>
          </div>
        </div>
        <div className="d-flex align-items-center mb-2">
          <div className="flex-shrink-0">
            <p className="text-muted mb-0">{t('PC_GATEWAY')}</p>
          </div>
          <div className="flex-grow-1 ms-2">
            <h6 className="mb-0">{recentPayment?.gatewayCode}</h6>
          </div>
        </div>
        {(recentPayment?.modifiedDate || recentPayment?.createdDate) && (
          <div className="d-flex align-items-center mb-2">
            <div className="flex-shrink-0">
              <p className="text-muted mb-0">{t('PC_TRANSACTION_DATE')}</p>
            </div>
            <div className="flex-grow-1 ms-2">
              <h6 className="mb-0">
                {recentPayment?.modifiedDate
                  ? formatDateTime(recentPayment.modifiedDate)
                  : recentPayment?.createdDate
                  ? formatDateTime(recentPayment.createdDate)
                  : 'N/A'}
              </h6>
            </div>
          </div>
        )}
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0">
            <p className="text-muted mb-0">{t('PC_TOTAL')}</p>
          </div>
          <div className="flex-grow-1 ms-2">
            <h6 className="mb-0">{recentPayment?.sum}</h6>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0">
            <p className="text-muted mb-0">{t('PC_CURRENCY')}</p>
          </div>
          <div className="flex-grow-1 ms-2">
            <h6 className="mb-0">{recentPayment?.currency}</h6>
          </div>
        </div>
        {recentPayment?.paymentMethod && (
          <React.Fragment>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <p className="text-muted mb-0">{t('PC_METHOD')}</p>
              </div>
              <div className="flex-grow-1 ms-2">
                <h6 className="mb-0">{recentPayment?.paymentMethod.paymentMethodGroupType}</h6>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <p className="text-muted mb-0">{t('PC_METHOD_NAME')}</p>
              </div>
              <div className="flex-grow-1 ms-2">
                <h6 className="mb-0">{recentPayment?.paymentMethod.name}</h6>
              </div>
            </div>
          </React.Fragment>
        )}
      </CardBody>
    </Card>
  );
};

export default PaymentCard;

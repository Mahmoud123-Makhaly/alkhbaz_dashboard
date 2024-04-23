'use client';

import React from 'react';
import { useTranslate } from '@app/hooks';
import { Card, CardHeader, CardBody } from 'reactstrap';

const CancelReason = ({ reason }: { reason: string }) => {
  const t = useTranslate('COMP_Order.INFO');
  return (
    <Card>
      <CardHeader>
        <h5 className="card-title mb-0">
          <i className="ri-close-circle-fill align-middle me-1 text-danger fs-24"></i>
          {t('CR_CARD_HEADER')}
        </h5>
      </CardHeader>
      <CardBody>
        <p>{reason}</p>
      </CardBody>
    </Card>
  );
};

export default CancelReason;

'use client';

import React from 'react';
import { useTranslate } from '@app/hooks';
import { IAddress } from '@app/types';
import { Card, CardHeader, CardBody } from 'reactstrap';

const AddressCard = ({ address }: { address: IAddress }) => {
  const t = useTranslate('COMP_Order.INFO');
  return (
    <Card>
      <CardHeader>
        <h5 className="card-title mb-0">
          <i className="ri-map-pin-line align-middle me-1 text-muted"></i>
          {t(
            address.addressType === 'Billing'
              ? 'ADC_BILLING_HEADER'
              : address.addressType === 'Shipping'
              ? 'ADC_SHIPPING_HEADER'
              : 'ADC_BILLING_AND_SHIPPING_HEADER',
          )}
        </h5>
      </CardHeader>
      <CardBody>
        <ul className="list-unstyled vstack gap-2 fs-13 mb-0">
          {(address.firstName || address.lastName) && (
            <li className="fw-medium fs-14">{`${address.firstName} ${address.lastName}`}</li>
          )}
          {address.phone && <li>{address.phone}</li>}
          {address.line1 && <li>{address.line1}</li>}
          {address.line2 && <li>{address.line2}</li>}
          {address.city && <li>{address.city}</li>}
          {address.countryName && <li>{address.countryName}</li>}
        </ul>
      </CardBody>
    </Card>
  );
};

export default AddressCard;

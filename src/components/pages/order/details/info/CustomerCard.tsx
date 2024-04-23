'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslate } from '@app/hooks';
import { IOrder } from '@app/types';
import { Card, CardHeader, CardBody } from 'reactstrap';
import CustomerPNG from '@assets/img/customers.png';

const CustomerCard = ({ data }: { data: IOrder }) => {
  const t = useTranslate('COMP_Order.INFO');

  const selectedAddressName = (data.addresses || []).find(x => x.firstName && x.lastName);
  const selectedAddressEmail = (data.addresses || []).find(x => x.email)?.email || null;
  const selectedAddressPhone = (data.addresses || []).find(x => x.phone)?.phone || null;
  const userFullName = data.customerName || `${selectedAddressName?.firstName} ${selectedAddressName?.lastName}`;
  return (
    <Card>
      <CardHeader>
        <div className="d-flex">
          <h5 className="card-title flex-grow-1 mb-0">{t('CC_HEADER')}</h5>
          {/* <div className="flex-shrink-0">
            <Link href="#" className="link-secondary">
              {t('CC_VIEW_PROFILE_LNK')}
            </Link>
          </div> */}
        </div>
      </CardHeader>
      <CardBody>
        <ul className="list-unstyled mb-0 vstack gap-3">
          <li>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 avatar-sm rounded">
                <Image
                  src={CustomerPNG.src}
                  alt={userFullName}
                  className="avatar-sm rounded"
                  width={0}
                  height={0}
                  loading="lazy"
                  sizes="100vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '100%',
                  }}
                />
              </div>
              <div className="flex-grow-1 ms-3">
                <h6 className="fs-14 mb-1">{userFullName}</h6>
              </div>
            </div>
          </li>
          {selectedAddressEmail && (
            <li>
              <i className="ri-mail-line me-2 align-middle text-muted fs-16"></i>
              {selectedAddressEmail}
            </li>
          )}
          {selectedAddressPhone && (
            <li>
              <i className="ri-phone-line me-2 align-middle text-muted fs-16"></i>
              {selectedAddressPhone}
            </li>
          )}
        </ul>
      </CardBody>
    </Card>
  );
};

export default CustomerCard;

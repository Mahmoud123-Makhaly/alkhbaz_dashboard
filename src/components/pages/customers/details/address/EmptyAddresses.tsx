import React from 'react';
import noData from '@assets/img/no-data.svg';
import { Col, Row } from 'reactstrap';
import { useTranslate } from '@app/hooks';
import Image from 'next/image';
function EmptyAddresses() {
  const t = useTranslate('COMP_CustomerDetails.ADDRESSES.EMPTY');
  return (
    <Row>
      <Col lg={12} xxl={12}>
        <div className="card card-body text-center align-items-center shadow-none">
          <Image src={noData.src} alt="" height={210} width={245} className="avatar-xl" />
          <h4 className="card-title">{t('EMPTY')}</h4>
        </div>
      </Col>
    </Row>
  );
}

export default EmptyAddresses;

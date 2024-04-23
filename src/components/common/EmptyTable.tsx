'use client';

import { Card, CardBody, Row, Col } from 'reactstrap';
import noData from '@assets/img/no-data.svg';
import Image from 'next/image';
import { useTranslate } from '@app/hooks';
const EmptyTable = ({ message }: { message?: string }) => {
  const t = useTranslate('COMP_EmptyMessage');

  return (
    <Row>
      <Col lg={12} xxl={12}>
        <div className="card card-body text-center align-items-center shadow-none">
          <Image src={noData.src} alt="" height={210} width={245} className="avatar-xl" />
          <h4 className="card-title">{message || t('EMPTY')}</h4>
        </div>
      </Col>
    </Row>
  );
};

export default EmptyTable;

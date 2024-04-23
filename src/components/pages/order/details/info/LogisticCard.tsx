'use client';

import React from 'react';
import Image from 'next/image';
import _ from 'lodash';
import moment from 'moment';
import { Card, CardHeader, CardBody, Badge } from 'reactstrap';
import { useTranslate } from '@app/hooks';
import { IOrderShipmentItem } from '@app/types';
import TruckDeliveryOutline from '@assets/images/gif/truck-delivery-outline.gif';
import { Utils } from '@helpers/utils';
import { ShipmentStatus } from '@helpers/constants';

const LogisticCard = ({ shipments }: { shipments: Array<IOrderShipmentItem> }) => {
  const t = useTranslate('COMP_Order.INFO');
  const recentShipment = _.maxBy(shipments, x => x.createdDate);
  const formatDateTime = (date?: Date) => moment(date).format('DD, MMM yyyy hh:mm A');
  return (
    <Card>
      <CardHeader>
        <div className="d-flex">
          <h5 className="card-title flex-grow-1 mb-0">
            <i className="mdi mdi-truck-fast-outline align-middle me-1 text-muted"></i>
            {t('SHC_HEADER')}
          </h5>
          {recentShipment?.status && (
            <div className="flex-shrink-0">
              <Badge color={Utils.shipmentStatusColor(recentShipment?.status as ShipmentStatus)} className="p-1">
                {t(`SHC_SHIPMENT_STATUS_${recentShipment?.status}`)}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <div className="text-center">
          <Image
            src={TruckDeliveryOutline.src}
            alt="test"
            color="primary:#405189,secondary:#0ab39c"
            width={80}
            height={80}
          />
          {recentShipment?.trackingNumber && (
            <h5 className="fs-16 mt-2">
              {recentShipment?.trackingNumber} {t('SHC_TRACK_LABEL')}
            </h5>
          )}
          <p className="text-muted mb-0">
            {t('SHC_NUMBER_LABEL')} {recentShipment?.number}
          </p>
          <p className="text-muted mb-0">
            {t('FULFILLMENT_CENTER_NAME')} {recentShipment?.fulfillmentCenterName}
          </p>
          <p className="text-muted mb-0">
            {t('SHC_ITEMS_COUNT_LABEL')} {recentShipment?.items?.length || 0}
          </p>
          {recentShipment?.status && recentShipment?.status === ShipmentStatus.Cancelled && (
            <p className="text-muted mb-0">
              {t('SHC_REASON_LABEL')} {recentShipment?.cancelReason}
            </p>
          )}
          <p className="text-muted mb-0">
            {t('SHC_LAST_MODIFICATION_DATE')}
            {formatDateTime(recentShipment?.modifiedDate) || formatDateTime(recentShipment?.createdDate)}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default LogisticCard;

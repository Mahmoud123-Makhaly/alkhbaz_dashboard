'use client';

import { useState } from 'react';
import { Col, Row } from 'reactstrap';
import _ from 'lodash';

//import Components
import { ClientOnly, BreadCrumb } from '@components/common';
import {
  ShipmentAnimatedNumbersStatistics,
  ShipmentHeaderSection,
  ShipmentIncompleteOrdersStatistics,
  ShipmentOrderFFCSalesStatistics,
  ShipmentOrderStatusSalesStatistics,
  ShipmentCompareOrdersMonthsStatistics,
  ShipmentOrderBySourceSalesStatistics,
  ShipmentsOrderByPaymentMethodSalesStatistics,
  ShipmentCompareOrdersDaysStatistics,
} from '@components/pages';
import { useTranslate } from '@app/hooks';

const Page = () => {
  const t = useTranslate('REPORTS_SALES_SHIPMENTS');
  const [filterCriteriaValues, setFilterCriteriaValues] = useState<{
    start?: Date;
    end?: Date;
    dataType?: 'Sales' | 'Count';
  }>();

  const onSearch = (values, setSubmitting) => {
    let searchCriteria = { ...(filterCriteriaValues || {}) };
    if (values) {
      if (values.date) {
        searchCriteria.start = _.min(values.date);
        searchCriteria.end = _.max(values.date);
      }
      if (values.dataType) {
        searchCriteria.dataType = values.dataType;
      }

      setFilterCriteriaValues({ ...searchCriteria });
    }
    setTimeout(() => {
      setSubmitting(false);
    }, 3000);
  };

  return (
    <ClientOnly>
      <BreadCrumb title={t('BC_TITLE')} />
      <ShipmentHeaderSection onSubmit={onSearch} />
      <Row>
        <Col>
          <ShipmentAnimatedNumbersStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <ShipmentOrderStatusSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
        <Col md={6}>
          <ShipmentOrderFFCSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <ShipmentOrderBySourceSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
        <Col md={6}>
          <ShipmentsOrderByPaymentMethodSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <ShipmentCompareOrdersMonthsStatistics dataType={filterCriteriaValues?.dataType} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <ShipmentCompareOrdersDaysStatistics />
        </Col>
      </Row>
      <Row>
        <Col>
          <ShipmentIncompleteOrdersStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
      </Row>
    </ClientOnly>
  );
};

export default Page;

'use client';

import { useState } from 'react';
import { Col, Row } from 'reactstrap';
import _ from 'lodash';

//import Components
import { ClientOnly, BreadCrumb } from '@components/common';
import {
  AnimatedNumbersStatistics,
  DashboardHeaderSection,
  IncompleteOrdersStatistics,
  OrderFFCSalesStatistics,
  OrderStatusSalesStatistics,
  CompareOrdersMonthsStatistics,
  ProductCategorySalesStatistics,
  ProductSalesStatistics,
  CompareOrdersDaysStatistics,
} from '@components/pages';
import { useTranslate } from '@app/hooks';

const Page = () => {
  const t = useTranslate('DASHBOARD');
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
      <DashboardHeaderSection onSubmit={onSearch} />
      <Row>
        <Col>
          <AnimatedNumbersStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <OrderStatusSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
        <Col md={6}>
          <OrderFFCSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <ProductCategorySalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
        <Col md={6}>
          <ProductSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <CompareOrdersMonthsStatistics dataType={filterCriteriaValues?.dataType} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <CompareOrdersDaysStatistics />
        </Col>
      </Row>
      <Row>
        <Col>
          <IncompleteOrdersStatistics
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

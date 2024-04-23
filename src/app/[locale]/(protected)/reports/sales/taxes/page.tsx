'use client';

import { useState } from 'react';
import { Col, Row } from 'reactstrap';
import _ from 'lodash';

//import Components
import { ClientOnly, BreadCrumb } from '@components/common';
import {
  TaxAnimatedNumbersStatistics,
  TaxHeaderSection,
  TaxIncompleteOrdersStatistics,
  TaxOrderFFCSalesStatistics,
  TaxOrderStatusSalesStatistics,
  TaxCompareOrdersMonthsStatistics,
  TaxOrderBySourceSalesStatistics,
  TaxesOrderByPaymentMethodSalesStatistics,
  TaxCompareOrdersDaysStatistics,
} from '@components/pages';
import { useTranslate } from '@app/hooks';

const Page = () => {
  const t = useTranslate('REPORTS_SALES_TAXES');
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
      <TaxHeaderSection onSubmit={onSearch} />
      <Row>
        <Col>
          <TaxAnimatedNumbersStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <TaxOrderStatusSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
        <Col md={6}>
          <TaxOrderFFCSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <TaxOrderBySourceSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
        <Col md={6}>
          <TaxesOrderByPaymentMethodSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <TaxCompareOrdersMonthsStatistics dataType={filterCriteriaValues?.dataType} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <TaxCompareOrdersDaysStatistics />
        </Col>
      </Row>
      <Row>
        <Col>
          <TaxIncompleteOrdersStatistics
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

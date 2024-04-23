'use client';

import { useState } from 'react';
import { Col, Row } from 'reactstrap';
import _ from 'lodash';

//import Components
import { ClientOnly, BreadCrumb } from '@components/common';
import {
  ReportSalesDiscountAnimatedNumbersStatistics,
  ReportSalesDiscountHeaderSection,
  ReportSalesDiscountIncompleteOrdersStatistics,
  ReportSalesDiscountOrderFFCSalesStatistics,
  ReportSalesDiscountOrderStatusSalesStatistics,
  ReportSalesDiscountCompareOrdersMonthsStatistics,
  ReportSalesDiscountOrderBySourceSalesStatistics,
  ReportSalesDiscountsOrderByPaymentMethodSalesStatistics,
  ReportSalesDiscountCompareOrdersDaysStatistics,
} from '@components/pages';
import { useTranslate } from '@app/hooks';

const Page = () => {
  const t = useTranslate('REPORTS_SALES_DISCOUNTS');
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
      <ReportSalesDiscountHeaderSection onSubmit={onSearch} />
      <Row>
        <Col>
          <ReportSalesDiscountAnimatedNumbersStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <ReportSalesDiscountOrderStatusSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
        <Col md={6}>
          <ReportSalesDiscountOrderFFCSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <ReportSalesDiscountOrderBySourceSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
        <Col md={6}>
          <ReportSalesDiscountsOrderByPaymentMethodSalesStatistics
            startDate={filterCriteriaValues?.start}
            endDate={filterCriteriaValues?.end}
            dataType={filterCriteriaValues?.dataType}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <ReportSalesDiscountCompareOrdersMonthsStatistics dataType={filterCriteriaValues?.dataType} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <ReportSalesDiscountCompareOrdersDaysStatistics />
        </Col>
      </Row>
      <Row>
        <Col>
          <ReportSalesDiscountIncompleteOrdersStatistics
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

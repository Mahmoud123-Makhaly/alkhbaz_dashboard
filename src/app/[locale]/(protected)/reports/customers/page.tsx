'use client';

import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import _ from 'lodash';

import { BreadCrumb } from '@components/common';
import {
  TopSellingCustomersByCount,
  TopSellingCustomersBySales,
  BestSellingCustomersCountChart,
  BestSellingCustomersSalesChart,
  CustomerOrderStatusStatistics,
  CustomerReportHeaderSection,
} from '@components/pages';
import { useTranslate } from '@app/hooks';

const CustomersReport = () => {
  const t = useTranslate('COMP_CustomersReport');
  const [filterCriteriaValues, setFilterCriteriaValues] = useState<{
    start?: Date;
    end?: Date;
  }>();

  const onSearch = (values, setSubmitting) => {
    let searchCriteria = { ...(filterCriteriaValues || {}) };
    if (values) {
      if (values.date) {
        searchCriteria.start = _.min(values.date);
        searchCriteria.end = _.max(values.date);
      }

      setFilterCriteriaValues({ ...searchCriteria });
    }
    setTimeout(() => {
      setSubmitting(false);
    }, 3000);
  };

  return (
    <React.Fragment>
      <BreadCrumb title={t('BC_TITLE')} />
      <CustomerReportHeaderSection onSubmit={onSearch} />
      <Row>
        <Col>
          <CustomerOrderStatusStatistics startDate={filterCriteriaValues?.start} endDate={filterCriteriaValues?.end} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <BestSellingCustomersCountChart startDate={filterCriteriaValues?.start} endDate={filterCriteriaValues?.end} />
        </Col>
        <Col md={6}>
          <BestSellingCustomersSalesChart startDate={filterCriteriaValues?.start} endDate={filterCriteriaValues?.end} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <TopSellingCustomersByCount startDate={filterCriteriaValues?.start} endDate={filterCriteriaValues?.end} />
        </Col>
        <Col md={6}>
          <TopSellingCustomersBySales startDate={filterCriteriaValues?.start} endDate={filterCriteriaValues?.end} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default CustomersReport;

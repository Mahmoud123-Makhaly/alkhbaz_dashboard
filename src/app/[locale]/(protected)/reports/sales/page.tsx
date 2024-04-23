'use client';

import { useState } from 'react';
import { Col, Row } from 'reactstrap';
import _ from 'lodash';

import { ClientOnly, BreadCrumb } from '@components/common';
import { BestSellingProductsSales, DashboardHeaderSection, OrderSourceStatistics } from '@components/pages';
import { useTranslate } from '@app/hooks';

import Widget from './Widgets';
import RecentActivity from './RecentActivity';
import RecentOrders from './RecentOrders';
import Revenue from './Revenue';
import StoreVisits from './StoreVisits';
import TopSellers from './TopSellers';

const SalesReport = () => {
  const t = useTranslate('SALES_REPORT');
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
  //Template Code
  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <ClientOnly>
      <BreadCrumb title={t('BC_TITLE')} />

      <Row>
        <Col>
          <div className="h-100">
            <DashboardHeaderSection onSubmit={onSearch} />
            <Row>
              <Widget />
            </Row>
            <Row className="mb-4">
              <Col md={6}>
                <Revenue />
              </Col>
              <Col md={6}>
                <OrderSourceStatistics
                  startDate={filterCriteriaValues?.start}
                  endDate={filterCriteriaValues?.end}
                  dataType={filterCriteriaValues?.dataType}
                />
              </Col>
            </Row>
            <Row className="mb-4">
              <Col xl={6}>
                <BestSellingProductsSales />
              </Col>
              <Col xl={6}>
                <TopSellers />
              </Col>
            </Row>
            <Row>
              <StoreVisits />
              <RecentOrders />
            </Row>
          </div>
        </Col>
        <RecentActivity rightColumn={rightColumn} hideRightColumn={toggleRightColumn} />
      </Row>
    </ClientOnly>
  );
};
export default SalesReport;

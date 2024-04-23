'use client';

import { useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import Widget from '../sales/Widgets';
import { BestSellingProducts } from '@components/pages';
import RecentActivity from '../sales/RecentActivity';
import RecentOrders from '../sales/RecentOrders';
import Revenue from '../sales/Revenue';
import SalesByLocations from '../sales/SalesByLocations';
import Section from '../sales/Section';
import StoreVisits from '../sales/StoreVisits';
import TopSellers from '../sales/TopSellers';

const StoresReport = () => {
  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <Row>
      <Col>
        <div className="h-100">
          <Section rightClickBtn={toggleRightColumn} />
          <Row>
            <Widget />
          </Row>
          <Row>
            <Col xl={8}>
              <Revenue />
            </Col>
            <SalesByLocations />
          </Row>
          <Row>
            <Col xl={6}>
              <BestSellingProducts />
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
  );
};
export default StoresReport;

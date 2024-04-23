'use client';

import Link from 'next-intl/link';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';

const Unauthorized = () => {
  return (
    <Row>
      <Col>
        <div className="text-center h-100">
          <div className="unauthorized mt-4 mb-4 "></div>
          <h4 className="text-uppercase">Sorry, You are not authorized to access this page 😭</h4>
          <Link href="/dashboard" className="btn btn-success">
            <i className="mdi mdi-home me-1"></i>Back to home
          </Link>
        </div>
      </Col>
    </Row>
  );
};
export default Unauthorized;

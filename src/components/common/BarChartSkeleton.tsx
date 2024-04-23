'use client';

import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
const BarChartSkeleton = () => (
  <Card className="placeholder-glow h-100">
    <CardBody className="d-flex align-items-baseline justify-content-center">
      <span className="placeholder col-1 mx-4" style={{ height: '100px' }}></span>
      <span className="placeholder col-1 mx-4" style={{ height: '300px' }}></span>
      <span className="placeholder col-1 mx-4" style={{ height: '200px' }}></span>
      <span className="placeholder col-1 mx-4" style={{ height: '150px' }}></span>
      <span className="placeholder col-1 mx-4" style={{ height: '250px' }}></span>
      <span className="placeholder col-1 mx-4" style={{ height: '350px' }}></span>
    </CardBody>
  </Card>
);
export default BarChartSkeleton;

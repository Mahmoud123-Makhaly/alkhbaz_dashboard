'use client';

import { Card, CardBody } from 'reactstrap';
const CardSkeleton = () => (
  <p className="card-text placeholder-glow">
    <Card>
      <span className="placeholder col-12" style={{ height: '250px' }}></span>
      <CardBody>
        <h5 className="card-title placeholder-glow">
          <span className="placeholder col-6"></span>
        </h5>
        <span className="placeholder col-7"></span>
        <span className="placeholder col-4"></span>
        <span className="placeholder col-4"></span>
        <span className="placeholder col-6"></span>
        <span className="placeholder col-4 bg-primary mt-2" style={{ height: '30px' }}></span>
      </CardBody>
    </Card>
  </p>
);
export default CardSkeleton;

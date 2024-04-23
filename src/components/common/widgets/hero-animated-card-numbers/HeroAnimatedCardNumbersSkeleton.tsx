'use client';

import { Card, CardBody } from 'reactstrap';

const HeroAnimatedCardNumbersSkeleton = () => (
  <Card className="placeholder-glow card-animate">
    <CardBody>
      <div className="d-flex align-items-center">
        <div className="flex-grow-1 overflow-hidden">
          <h5 className="placeholder col-4"></h5>
        </div>
      </div>
      <div className="d-flex align-items-end justify-content-between mt-4">
        <h4 className="placeholder col-8 fs-22 fw-semibold ff-secondary mb-4"></h4>
      </div>
    </CardBody>
  </Card>
);
export default HeroAnimatedCardNumbersSkeleton;

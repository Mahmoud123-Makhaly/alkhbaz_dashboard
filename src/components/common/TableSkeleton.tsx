'use client';

import { Card, CardBody } from 'reactstrap';
const TableSkeleton = ({ count = 5 }: { count: number }) => (
  <Card>
    <CardBody>
      <p className="card-text placeholder-glow">
        {[...Array(count)].map((e, i) => (
          <span key={`skel-${i}`} className="placeholder col-12 placeholder-table"></span>
        ))}
      </p>
    </CardBody>
  </Card>
);

export default TableSkeleton;

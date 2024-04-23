import React from 'react';
import { Col } from 'reactstrap';

const PricingWidgetList = ({ icon, label, details }: { icon: string; label: string; details: React.ReactNode }) => {
  return (
    <React.Fragment>
      <Col lg={3} sm={6}>
        <div className="p-2 border border-dashed rounded">
          <div className="d-flex align-items-center">
            <div className="avatar-sm me-2">
              <div className="avatar-title rounded bg-transparent text-success fs-24">
                <i className={icon}></i>
              </div>
            </div>
            <div className="flex-grow-1">
              <p className="text-muted mb-1">{label} :</p>
              {details}
            </div>
          </div>
        </div>
      </Col>
    </React.Fragment>
  );
};
export default PricingWidgetList;

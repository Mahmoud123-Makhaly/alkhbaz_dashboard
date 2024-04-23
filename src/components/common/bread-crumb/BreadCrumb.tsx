'use client';

import React from 'react';
import Link from 'next-intl/link';
import { Col, Row } from 'reactstrap';
export interface IBreadCrumbProps {
  title: string;
  paths?: Array<{ label: string; relativePath: string; isActive?: boolean }>;
}
const BreadCrumb = ({ title, paths }: IBreadCrumbProps) => {
  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">{title}</h4>

            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                {paths &&
                  paths.map((path, indx) => (
                    <li key={'bc-path-' + indx} className={`breadcrumb-item${path.isActive ? ' active' : ''}`}>
                      {path.isActive ? path.label : <Link href={path.relativePath}>{path.label}</Link>}
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BreadCrumb;

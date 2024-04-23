'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';

//import images
import googleAnalytics from '@assets/img/brands/google-analytics.svg';
import eCommerceManager from '@assets/img/brands/e-commerce-manager.svg';
import reports from '@assets/img/brands/reports.svg';
import hotJar from '@assets/img/brands/hotjar.svg';
import appSearch from '@assets/img/brands/app-search.svg';
import channelsManager from '@assets/img/brands/channels-manager.svg';
import Link from 'next-intl/link';

const WebAppsDropdown = () => {
  const [isWebAppDropdown, setIsWebAppDropdown] = useState(false);
  const toggleWebAppDropdown = () => {
    setIsWebAppDropdown(!isWebAppDropdown);
  };
  return (
    <Dropdown isOpen={isWebAppDropdown} toggle={toggleWebAppDropdown} className="topbar-head-dropdown ms-1 header-item">
      <DropdownToggle tag="button" type="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
        <i className="bx bx-category-alt fs-22"></i>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-lg p-0 dropdown-menu-end">
        <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
          <Row className="align-items-center">
            <Col>
              <h6 className="m-0 fw-semibold fs-15"> Web Apps </h6>
            </Col>
            <div className="col-auto">
              {/* <Link href="#" className="btn btn-sm btn-soft-info">
                  View All Apps
                  <i className="ri-arrow-right-s-line align-middle"></i>
                </Link> */}
            </div>
          </Row>
        </div>

        <div className="p-2">
          <div className="row g-0">
            <Col>
              <Link className="dropdown-icon-item" href="#">
                <Image src={googleAnalytics.src} alt="Github" width="24" height="24" />
                <span>Google Analytics</span>
              </Link>
            </Col>
            <Col>
              <Link className="dropdown-icon-item" href="#">
                <Image src={reports.src} alt="bitbucket" width="24" height="24" />
                <span>Reports</span>
              </Link>
            </Col>
            <Col>
              <Link className="dropdown-icon-item" href="#">
                <Image src={eCommerceManager.src} alt="mail_chimp" width="24" height="24" />
                <span>Commerce Manager</span>
              </Link>
            </Col>
          </div>

          <div className="row g-0">
            <Col>
              <Link className="dropdown-icon-item" href="#">
                <Image src={appSearch.src} alt="dropbox" width="24" height="24" />
                <span>App Search</span>
              </Link>
            </Col>
            <Col>
              <Link className="dropdown-icon-item" href="#">
                <Image src={hotJar.src} alt="dribbble" width="24" height="24" />
                <span>HotJar</span>
              </Link>
            </Col>
            <Col>
              <Link className="dropdown-icon-item" href="#">
                <Image src={channelsManager.src} alt="slack" width="24" height="24" />
                <span>Channel Manager</span>
              </Link>
            </Col>
          </div>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default WebAppsDropdown;

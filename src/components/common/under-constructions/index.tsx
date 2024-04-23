'use client';
import React from 'react';
import './index.css';
import Link from 'next-intl/link';
import { Container, Row, Col } from 'reactstrap';
import maintenanceImg from '@assets/img/bg.jpg';
import comingsoon from '@assets/images/under-construction.png';
import Image from 'next/image';
const UnderConstructions = () => (
  <React.Fragment>
    {/* <div className="under-construction">Under Construction</div> */}

    <Container>
      <Row>
        <Col lg={12}>
          <div className="text-center ">
            <div className="mb-5 text-white-50">
              <p className="fs-14"></p>
              <div className="UnderConstructionsImg mt-4 "></div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  </React.Fragment>
);
export default UnderConstructions;

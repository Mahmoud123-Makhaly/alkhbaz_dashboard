'use client';

import React from 'react';
import Link from 'next-intl/link';
import Image from 'next/image';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Offline from '@assets/img/offline.gif';

const Offlinepage = () => {
  document.title = 'Offline';
  return (
    <React.Fragment>
      <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div className="bg-overlay"></div>
        <div className="auth-page-content overflow-hidden pt-lg-5">
          <Container>
            <Row className="justify-content-center">
              <Col xl={5}>
                <Card className="overflow-hidden">
                  <CardBody className="p-4">
                    <div className="text-center">
                      <Image src={Offline.src} alt="" height={210} width={245} />
                      <h3 className="mt-4 fw-semibold">We are currently offline</h3>
                      <p className="text-muted mb-4 fs-14">
                        We can not show you this images because you are not connected to the internet. When you are back
                        online refresh the page or hit the button below
                      </p>
                      <Link href="/dashboard" color="success" className="btn-border">
                        <i className="ri-refresh-line align-bottom"></i> Refresh
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Offlinepage;

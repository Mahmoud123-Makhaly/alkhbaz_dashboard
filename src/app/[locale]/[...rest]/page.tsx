'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Col, Container, Row } from 'reactstrap';

// Import Images
import error400cover from '@assets/img/error400-cover.png';

const CatchAllPage = () => {
  return (
      <div className="auth-page-content">
        <div className="auth-page-wrapper py-5 d-flex justify-content-center align-items-center min-vh-100">
          <div className="auth-page-content overflow-hidden p-0">
            <Container>
              <Row className="justify-content-center">
                <Col xl={7} lg={8}>
                  <div className="text-center">
                    <Image src={error400cover.src} alt="error img" className="img-fluid" width={641} height={329} />
                    <div className="mt-3">
                      <h3 className="text-uppercase">Sorry, Page not Found 😭</h3>
                      <p className="text-muted mb-4">The page you are looking for not available!</p>
                      <Link href="/dashboard" className="btn btn-success">
                        <i className="mdi mdi-home me-1"></i>Back to home
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
  );
};
export default CatchAllPage;

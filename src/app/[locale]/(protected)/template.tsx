'use client';

import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next-intl/client';
import Layout from '@components/layouts';
import { Col, Container, Row } from 'reactstrap';
import { useSelector } from 'react-redux';
import Loader from '@components/common/Loader';
import { preloaderTypes } from '@components/constants/layout';
import { ClientOnly } from '@components/common';

const Template = props => {
  const { children }: { children: ReactNode } = props;
  const router = useRouter();
  const { pageLoader } = useSelector<any, any>(state => ({
    pageLoader: state.Layout.pageLoader,
  }));

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  return (
    <ClientOnly>
      <Layout>
        {pageLoader === preloaderTypes.ENABLE && <Loader />}
        <div className="page-content">
          <Container fluid={true}>
            <Row>
              <Col xs={12}>{status === 'authenticated' && children}</Col>
            </Row>
          </Container>
        </div>
      </Layout>
    </ClientOnly>
  );
};
export default Template;

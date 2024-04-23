'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next-intl/client';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert } from 'reactstrap';
import ParticlesAuth from '@components/layouts/ParticlesAuth';

//redux
import { useSelector, useDispatch } from 'react-redux';

import Link from 'next-intl/link';

// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';

// actions
import { resetLoginFlag } from '@slices/thunks';

import logoLightSrc from '@assets/img/logo-light.png';
import { AnyAction } from 'redux';
import { Loader } from '@components/common';

//import images

export default function Login(props) {
  const {
    searchParams: { callbackUrl },
  } = props;
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const { user, error, loading, errorMsg } = useSelector<any, any>(state => ({
    user: state.Account.user,
    error: state.Login.error,
    loading: state.Login.loading,
    errorMsg: state.Login.errorMsg,
  }));

  const [userLogin, setUserLogin] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordShow, setPasswordShow] = useState(false);

  const locale = useLocale();
  const t = useTranslations('login');
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/' + locale);
    }
  }, [session, locale, router, status]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: userLogin.email || '',
      password: userLogin.password || '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your Email'),
      password: Yup.string().required('Please Enter Your Password'),
    }),
    onSubmit: values => {
      setIsLoading(true);
      signIn('credentials', {
        username: values.email,
        password: values.password,
        redirect: true,
      })
        .then(result => {})
        .catch(err => {
          setIsLoading(false);
        });
    },
  });

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetLoginFlag() as unknown as AnyAction);
      }, 3000);
    }
  }, [dispatch, errorMsg]);

  return (
    <ParticlesAuth>
      {isLoading && <Loader />}
      <div className="auth-page-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link href="/" className="d-inline-block auth-logo">
                    <img src={logoLightSrc.src} alt="tot" />
                  </Link>
                </div>
                <p className="mt-3 fs-15 fw-medium">{t('TITLE_LABEL')}</p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">{t('WELCOME_LABEL')}</h5>
                    <p className="text-muted">{t('SIGNIN_LABEL')}</p>
                  </div>
                  {error && error ? <Alert color="danger"> {error} </Alert> : null}
                  <div className="p-2 mt-4">
                    <Form
                      onSubmit={e => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-3">
                        <Label htmlFor="email" className="form-label">
                          {t('EMAIL_LABEL')}
                        </Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder={t('EMAIL_PLACEHOLDER')}
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ''}
                          invalid={validation.touched.email && validation.errors.email ? true : false}
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">{validation.errors.email as string}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <div className="float-end">
                          <Link href="/forgot-password" className="text-muted">
                            {t('FORGOT_PASSWORD_LABEL')}
                          </Link>
                        </div>
                        <Label className="form-label" htmlFor="password-input">
                          {t('PASSWORD_LABEL')}
                        </Label>
                        <div className="position-relative auth-pass-inputgroup mb-3">
                          <Input
                            name="password"
                            value={validation.values.password || ''}
                            type={passwordShow ? 'text' : 'password'}
                            className="form-control pe-5"
                            placeholder={t('PASSWORD_PLACEHOLDER')}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={validation.touched.password && validation.errors.password ? true : false}
                          />
                          {validation.touched.password && validation.errors.password ? (
                            <FormFeedback type="invalid">{validation.errors.password as string}</FormFeedback>
                          ) : null}
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                            type="button"
                            id="password-addon"
                            onClick={() => setPasswordShow(!passwordShow)}
                          >
                            <i className="ri-eye-fill align-middle"></i>
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          color="success"
                          disabled={error ? false : loading ? true : false}
                          className="btn btn-success w-100"
                          type="submit"
                        >
                          {t('LOGIN_BTN_LABEL')}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
}

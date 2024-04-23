'use client';

import React, { useState } from 'react';
import { Button, ButtonGroup, Col, Row } from 'reactstrap';
import { useSession } from 'next-auth/react';
import { Formik } from 'formik';
import classNames from 'classnames';

import { FormPicker } from '@components/common/form';
import { useTranslate } from '@app/hooks';
import { Utils } from '@helpers/utils';

const HeaderSection = ({ onSubmit }: { onSubmit: (values, setSubmitting) => void }) => {
  const { data: session, status } = useSession();
  const [dataType, setDataType] = useState<'Sales' | 'Count'>('Sales');
  const t = useTranslate('COMP_ShipmentsHeaderSection');
  const todayRanges = Utils.getTodayDateRanges('DD MMM YYYY HH:mm:ss');

  const initialValues = {
    date: [todayRanges.thisYear.start, todayRanges.thisYear.end],
  };

  return (
    <Row className="mb-3 pb-1">
      <Col xs={12}>
        <div className="d-flex align-items-lg-center flex-lg-row flex-column">
          <div className="flex-grow-1">
            <h4 className="fs-16 mb-1"></h4>
          </div>
          <div className="mt-3 mt-lg-0">
            <Formik
              initialValues={initialValues}
              onSubmit={(values, { setSubmitting }) => {
                onSubmit({ ...values, dataType }, setSubmitting);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <form onSubmit={handleSubmit}>
                  <Row className="g-3 mb-0 align-items-center">
                    <div className="col-sm-auto">
                      <div className="input-group">
                        <div className="d-flex gap-1">
                          <ButtonGroup>
                            <Button
                              type="button"
                              className={classNames({ active: dataType === 'Sales' }, 'btn btn-soft-secondary')}
                              onClick={() => {
                                setDataType('Sales');
                              }}
                              outline
                            >
                              {t('SALES_OPTION_LABEL')}
                            </Button>
                            <Button
                              type="button"
                              className={classNames({ active: dataType === 'Count' }, 'btn btn-soft-secondary')}
                              onClick={() => {
                                setDataType('Count');
                              }}
                              outline
                            >
                              {t('COUNT_OPTION_LABEL')}
                            </Button>
                          </ButtonGroup>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div className="input-group">
                        <FormPicker name="date" options={{ mode: 'range', altInput: true, altFormat: 'd M, Y' }} />
                        <div className="input-group-text bg-secondary border-secondary text-white">
                          <i className="ri-calendar-2-line"></i>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto">
                      <Button type="submit" disabled={isSubmitting} size="md" color="primary">
                        <i className="ri-search-2-line"></i>
                      </Button>
                    </div>
                  </Row>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default HeaderSection;

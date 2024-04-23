'use client';

import React from 'react';
import { Button, Col, Row } from 'reactstrap';
import { Formik } from 'formik';

import { FormPicker } from '@components/common/form';
import { Utils } from '@helpers/utils';

const HeaderSection = ({ onSubmit }: { onSubmit: (values, setSubmitting) => void }) => {
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
                onSubmit({ ...values }, setSubmitting);
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

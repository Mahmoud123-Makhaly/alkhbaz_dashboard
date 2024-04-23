'use client';

import React, { useState } from 'react';
import { Button, ButtonGroup, CardHeader, Col, Row } from 'reactstrap';
import { useSession } from 'next-auth/react';
import { Formik } from 'formik';
import classNames from 'classnames';

import { FormPicker } from '@components/common/form';
import { useTranslate } from '@app/hooks';

export const CompareOrdersDaysStatisticsHeader = ({
  onSubmit,
  initialValues,
}: {
  onSubmit: (values, setSubmitting) => void;
  initialValues?: { date?: Array<string>; dataType: 'Sales' | 'Count' };
}) => {
  const [dataType, setDataType] = useState<'Sales' | 'Count'>(initialValues?.dataType || 'Sales');
  const t = useTranslate('COMP_CompareOrdersDaysStatisticsHeaderSection');

  return (
    <CardHeader className="border-0 align-items-center d-flex">
      <h4 className="card-title mb-0 flex-grow-1">{t('CARD_HEADER')}</h4>
      <Formik
        initialValues={{ date: initialValues?.date }}
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
    </CardHeader>
  );
};

'use client';

import { Row, Col, FormGroup, Label, FormFeedback, Form, Spinner } from 'reactstrap';
import { useFormik, FormikProvider } from 'formik';
import { IFormControl } from './FormControl.types';
import React from 'react';
import { useRouter } from 'next-intl/client';
import { useTranslate } from '@app/hooks';
import FormField from '../form-field/FormField';

const FormControl = (props: IFormControl) => {
  const {
    initialValues,
    validationSchema,
    fields,
    withAdvancedLink,
    isLoading,
    submitLabel,
    cancelLabel,
    onCancel,
    onSubmit,
  } = props;
  const router = useRouter();
  const t = useTranslate('COMP_Form');
  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues,
    validationSchema,
    onSubmit,
  });
  return (
    <FormikProvider value={validation}>
      <Form
        className={'needs-validation' + (isLoading ? ' disabled' : '')}
        onSubmit={e => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <Row>
          {fields &&
            fields.map((elem, indx) => {
              const { id, col, label, name, placeholder, type, onElementChange, ...rest } = elem;
              return (
                <Col md={col || 12} key={id || 'form-elem-' + indx.toString()}>
                  <FormGroup>
                    <Label htmlFor={id || 'form-elem-' + indx.toString()}>{label}</Label>
                    <FormField
                      name={name}
                      placeholder={placeholder}
                      type={type}
                      className="form-control"
                      id={id || name}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values[name]}
                      invalid={validation.touched[name] && validation.errors[name] ? true : false}
                      onKeyUp={e => {
                        if (onElementChange) onElementChange(e, validation.values);
                      }}
                      {...rest}
                    />
                    {validation.touched[name] && validation.errors[name] ? (
                      <FormFeedback type="invalid">{validation.errors[name] as React.ReactNode}</FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>
              );
            })}
        </Row>
        <Row>
          <Col md={12}>
            <div className="text-center mt-3">
              <button type="reset" className="btn px-24 btn-light m-1" onClick={onCancel}>
                {cancelLabel ? cancelLabel : t('CANCEL')}
              </button>

              <button type="submit" className="btn px-24 btn-primary m-1">
                <span className="d-flex align-items-center">
                  <span className="flex-grow-1 me-2">{submitLabel ? submitLabel : t('SUBMIT')}</span>
                  {isLoading && <Spinner size="sm" type="grow" className="flex-shrink-0" role="status" />}
                </span>
              </button>
              <br />
              {withAdvancedLink && (
                <button
                  type="button"
                  onClick={() => router.replace(withAdvancedLink.url)}
                  className="btn px-24 btn-link m-1"
                >
                  {withAdvancedLink.label || t('ADVANCED')}
                </button>
              )}
            </div>
          </Col>
        </Row>
      </Form>
    </FormikProvider>
  );
};
export default FormControl;

'use client';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useToast, useTranslate } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { endpoints } from '@app/libs';

interface IResetPasswordBasicFormProps {
  onCancel: () => void;
  onSubmit: () => void;
  userName: string | null;
}

const ResetPasswordBasicForm = (props: IResetPasswordBasicFormProps) => {
  const { onCancel, onSubmit, userName } = props;
  const [values, setValues] = useState<any>({});
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const t = useTranslate('COMP_ResetUserPasswordBasicForm');
  const [loadingStatus, setLoadingStatus] = useState(DataLoadingStatus.pending);
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'newPassword',
      label: t('PASSWORD_LABEL'),
      placeholder: t('PASSWORD_PLACEHOLDER'),
      type: 'password',
    },
    {
      name: 'passwordConfirmation',
      label: t('PASSWORD_CONFIRMATION_LABEL'),
      placeholder: t('REPEAT_PASSWORD_PLACEHOLDER'),
      type: 'password',
    },

    {
      name: 'forcePasswordChangeOnNextSignIn',
      label: t('FLAG_LABEL'),
      type: 'checkbox',
    },
  ];
  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .matches(appRegx.PasswordRegExp, t('ERR_PASSWORD_REGX'))
      .required(t('ERR_PASSWORD_REQUIRED')),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('newPassword')], t('REPEAT_PASSWORD_ERR'))
      .required(t('REPEAT_PASSWORD_REQUIRED')),
  });

  const initialValues = useMemo(() => {
    return {
      newPassword: '',
      passwordConfirmation: '',
      forcePasswordChangeOnNextSignIn:false
    };
  }, []);
  const onFormSubmit = formValues => {
    resetPassword({
      ...formValues,
    });
  };
  const resetPassword = useCallback(async value => {
    setLoadingStatus(DataLoadingStatus.pending);
    apiClient.create(endpoints.users.resetPassword, value, { urlParams: { userName: userName } }).then(
      data => {
        if (data) {
          setTimeout(() => {
            toast.success(t('UPDATE_SUCCESS'));
            setLoadingStatus(DataLoadingStatus.pending);
            onSubmit();
          }, 300);
        } else {
          toast.error(t('ERR_UPDATE_GENERIC_MSG'));
          setLoadingStatus(DataLoadingStatus.pending);
        }
      },
      err => {
        toast.error(err.toString());
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (formFields) {
      setValues(initialValues);
      setLoadingStatus(DataLoadingStatus.done);
    }
  }, [formFields, initialValues]);

  useEffect(() => {
    setFormFields(defaultFormFields);
  }, []);
  return (
    <div>
      <Row>
        <Col md={12}>
          <Card className="shadow-none">
            <CardBody>
              <DataLoader status={loadingStatus}>
                {formFields && (
                  <FormControl
                    initialValues={values}
                    validationSchema={validationSchema}
                    onSubmit={onFormSubmit}
                    fields={formFields}
                    onCancel={onCancel}
                  />
                )}
              </DataLoader>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPasswordBasicForm;

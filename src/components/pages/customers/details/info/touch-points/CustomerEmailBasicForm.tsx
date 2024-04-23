import React, { useCallback, useState } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { FormControl, FormFieldType } from '@components/common';
import { useSession } from 'next-auth/react';
import * as Yup from 'yup';
import { useAPIAuthClient, useToast, useTranslate } from '@app/hooks';
import { endpoints } from '@app/libs';
import { ICustomerItem } from '@app/types';
import { appRegx } from '@helpers/regex';

interface ICustomerEmailBasicFormProps {
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
  data: ICustomerItem;
}
const CustomerEmailBasicForm = (props: ICustomerEmailBasicFormProps) => {
  const { mode, onCancel, onSubmit, data } = props;
  const { data: session } = useSession();
  const toast = useToast();
  const apiClient = useAPIAuthClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslate('COMP_CustomerDetails.INFO.CustomerEmailBasicForm');

  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'email',
      label: t('Email_LABEL'),
      placeholder: t('Email_PLACEHOLDER'),
      type: 'text',
    },
  ];
  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('ERR_EMAIL_WRONG'))
      .required(t('ERR_EMAIL_REQUIRED'))
      .matches(appRegx.EmailFormat, t('ERR_EMAIL_WRONG')),
  });

  const updateData = useCallback(async formValues => {
    setIsLoading(true);

    const emails = data?.emails || [];
    emails.push(formValues.email);

    apiClient
      .update<ICustomerItem>(endpoints.customers.update, { ...data, emails, modifiedBy: session?.user.userName })
      .then(
        data => {
          if (data) {
            onSubmit();
            setTimeout(() => {
              setIsLoading(false);
              toast.success(t('UPDATE_SUCCESS'));
              onSubmit();
            }, 300);
          } else {
            setIsLoading(false);
            toast.error(t('ERR_UPDATE_GENERIC_MSG'));
          }
        },
        err => {
          toast.error(err.toString());
          setIsLoading(false);
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Row>
      <Col md={12}>
        <Card className="shadow-none">
          <CardBody>
            {defaultFormFields && (
              <FormControl
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={updateData}
                fields={defaultFormFields}
                onCancel={onCancel}
                isLoading={isLoading}
              />
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default CustomerEmailBasicForm;

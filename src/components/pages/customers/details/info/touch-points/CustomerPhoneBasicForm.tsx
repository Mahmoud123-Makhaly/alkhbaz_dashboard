import React, { useCallback, useState } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { useSession } from 'next-auth/react';
import * as Yup from 'yup';

import { FormControl, FormFieldType } from '@components/common';
import { useAPIAuthClient, useToast, useTranslate } from '@app/hooks';
import { endpoints } from '@app/libs';
import { ICustomerItem } from '@app/types';
interface ICustomerPhoneBasicFormProps {
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
  data: ICustomerItem;
}
const CustomerPhoneBasicForm = (props: ICustomerPhoneBasicFormProps) => {
  const { mode, data, onCancel, onSubmit } = props;
  const { data: session } = useSession();
  const toast = useToast();
  const apiClient = useAPIAuthClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslate('COMP_CustomerDetails.INFO.CustomerPhoneBasicForm');

  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'phone',
      label: t('PHONE_LABEL'),
      placeholder: t('PHONE_PLACEHOLDER'),
      type: 'text',
    },
  ];
  const initialValues = {
    phone: '',
  };
  const validationSchema = Yup.object({
    phone: Yup.string()
      .min(11, t('ERR_PHONE_MIN'))
      .required(t('ERR_PHONE_REQUIRED'))
      .test({
        name: 'phone-existence',
        message: t('ALREADY_EXIST_MSG'),
        test: value => !data.phones.includes(value),
      }),
  });
  const updateData = useCallback(async formValues => {
    setIsLoading(true);
    const phones = data?.phones || [];
    phones.push(formValues.phone);
    apiClient
      .update<ICustomerItem>(endpoints.customers.update, { ...data, phones, modifiedBy: session?.user.userName })
      .then(
        data => {
          if (data) {
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
  }, []);
  return (
    <Row>
      <Col md={12}>
        <Card className="shadow-none">
          <CardBody>
            <FormControl
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={updateData}
              fields={defaultFormFields}
              onCancel={onCancel}
              isLoading={isLoading}
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default CustomerPhoneBasicForm;

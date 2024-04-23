'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';

import { useAPIAuthClient, useToast, useTranslate } from '@app/hooks';
import { endpoints } from '@app/libs';
import { IPropertiesAttribute } from '@app/types';

interface IOrderSourceBasicFormProps {
  propertyId: string;
  data: Partial<IPropertiesAttribute> | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const OrderSourceBasicForm = (props: IOrderSourceBasicFormProps) => {
  const { mode, data, propertyId, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const t = useTranslate('COMP_OrderSourceBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();

  //Form fields
  const defaultFormFields = useCallback((): Array<FormFieldType> => {
    let fields: Array<FormFieldType> = [
      {
        name: 'name',
        label: t('NAME_LABEL'),
        placeholder: t('NAME_PLACEHOLDER'),
        type: 'text',
      },
    ];
    return fields;
  }, [t]);

  //Form fields validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('ERR_NAME_REQUIRED')),
  });

  const onFormSubmit = formValues => {
    if (mode === 'new')
      create([
        {
          ...formValues,
        },
      ]);
    if (mode === 'edit')
      updateData([
        {
          ...formValues,
        },
      ]);
  };

  const loadData = useCallback(async () => {
    if (data) {
      setValues(data);
      setLoadingStatus(DataLoadingStatus.done);
    } else onCancel();
  }, []);

  const updateData = useCallback(async (value: Array<IPropertiesAttribute>) => {
    setIsLoading(true);
    apiClient.create(endpoints.dictionaries.orderSource.edit.replace(':propertyId', propertyId), value).then(
      data => {
        if (data && data.status === 204) {
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
        if (err.includes('500')) {
          toast.error(t('ERR_ORDER_SOURCE_EXISTS'));
        } else toast.error(err.toString());
        setIsLoading(false);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = useCallback(async (value: Array<IPropertiesAttribute>) => {
    setIsLoading(true);
    apiClient.create(endpoints.dictionaries.orderSource.add.replace(':propertyId', propertyId), value).then(
      data => {
        if (data && data.status === 204) {
          setTimeout(() => {
            setIsLoading(false);
            toast.success(t('CREATE_SUCCESS', { name: value[0].name }));
            onSubmit();
          }, 300);
        } else {
          setIsLoading(false);
          toast.error(t('ERR_CREATE_GENERIC_MSG'));
        }
      },
      err => {
        if (err.includes('500')) {
          toast.error(t('ERR_ORDER_SOURCE_EXISTS'));
        } else toast.error(err.toString());
        setIsLoading(false);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formFields) loadData();
  }, [formFields, loadData]);

  useEffect(() => {
    setFormFields(defaultFormFields());
  }, []);
  return (
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
                  isLoading={isLoading}
                />
              )}
            </DataLoader>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
export default OrderSourceBasicForm;

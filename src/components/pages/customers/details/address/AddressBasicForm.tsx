'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSession } from 'next-auth/react';
import * as Yup from 'yup';
import _ from 'lodash';

import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import { useAPIAuthClient, useToast, useTranslate } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { endpoints, addressType } from '@app/libs';
import { IAddress, ICustomerItem } from '@app/types';
import { DefaultCountry } from '@helpers/constants';

interface IAddressBasicFormProps {
  id?: string | undefined;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
  data: ICustomerItem | null | undefined;
}
const AddressBasicForm = (props: IAddressBasicFormProps) => {
  const { mode, id, onCancel, onSubmit, data } = props;
  const { data: session } = useSession();
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_CustomerDetails.ADDRESSES.AddressBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();

  const onAddressTypeSelect = (name, selectedOption) => {
    if (selectedOption.value !== 'BillingAndShipping') setFormFields(defaultFormFields);
    else setFormFields(defaultFormFields.filter(x => x.name != 'isDefault'));
  };
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'isDefault',
      label: t('DEFAULT_LABEL'),
      type: 'checkbox',
    },
    {
      name: 'firstName',
      label: t('FIRST_NAME_LABEL'),
      placeholder: t('FIRST_NAME_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'lastName',
      label: t('LAST_NAME_LABEL'),
      placeholder: t('LAST_NAME_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'email',
      label: t('EMAIL_LABEL'),
      placeholder: t('EMAIL_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },

    {
      name: 'phone',
      label: t('PHONE_LABEL'),
      placeholder: t('PHONE_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'line1',
      label: t('LINE_ONE'),
      placeholder: t('LINE_ONE_PLACEHOLDER'),
      type: 'textarea',
    },
    {
      name: 'line2',
      label: t('LINE_TWO'),
      placeholder: t('LINE_TWO_PLACEHOLDER'),
      type: 'textarea',
    },
    {
      name: 'postalCode',
      label: t('ZIP_LABEL'),
      placeholder: t('ZIP_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'city',
      label: t('CITY_LABEL'),
      placeholder: t('CITY_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'regionName',
      label: t('REGION_LABEL'),
      placeholder: t('REGION_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'addressType',
      label: t('ADDRESS_TYPE_LABEL'),
      type: 'select',
      options: addressType.map(x => ({ value: x.value, label: x.label })),
      onSelectChange: onAddressTypeSelect,
      col: 6,
    },
    {
      name: 'description',
      label: t('DESCRIPTION_LABEL'),
      type: 'textarea',
      placeholder: t('DESCRIPTION_PLACEHOLDER'),
    },
  ];
  //Form fields validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(3, t('ERR_FIRST_NAME_MIN', { length: 3 }))
      .max(50, t('ERR_FIRST_NAME_MAX', { length: 50 }))
      .trim()
      .matches(appRegx.StartWithCharAllowSpace, t('ERR_FIRST_NAME_REGX'))
      .required(t('ERR_FIRST_NAME_REQUIRED')),
    lastName: Yup.string()
      .min(3, t('ERR_LAST_NAME_MIN', { length: 3 }))
      .max(50, t('ERR_LAST_NAME_MAX', { length: 50 }))
      .trim()
      .matches(appRegx.StartWithCharAllowSpace, t('ERR_LAST_NAME_REGX'))
      .required(t('ERR_LAST_NAME_REQUIRED')),
    city: Yup.string().required(t('ERR_CITY_REQUIRED')),
    line1: Yup.string().required(t('ERR_LINE_ONE_REQUIRED')),
    postalCode: Yup.string().required(t('ERR_ZIP_REQUIRED')),
    phone: Yup.string().required(t('ERR_PHONE_REQUIRED')),
    addressType: Yup.string().required(t('ERR_ADDRESS_TYPE_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      firstName: '',
      lastName: '',
      line1: '',
      isDefault: false,
      phone: '',
      postalCode: '',
      city: '',
      addressType: '',
    };
  }, []);
  const onFormSubmit = formValues => {
    if (formValues.addressType === 'BillingAndShipping') formValues.isDefault = false;
    if (mode === 'new') {
      create({
        ...formValues,
        countryCode: DefaultCountry.code,
        countryName: DefaultCountry.name,
      });
    }
    if (mode === 'edit') {
      const addresses: Array<IAddress> = data?.addresses!;
      _.remove(addresses, item => item.key === id);
      addresses.push(formValues);
      updateData({ ...data!, addresses: addresses, modifiedBy: session?.user.userName });
    }
  };
  const loadData = useCallback(async () => {
    const addressData = data?.addresses.find(x => x.key === id);
    if (addressData?.addressType === 'BillingAndShipping')
      setFormFields(defaultFormFields.filter(x => x.name != 'isDefault'));
    else setFormFields(defaultFormFields);
    setValues(addressData);
    setLoadingStatus(DataLoadingStatus.done);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateData = useCallback(async (value: ICustomerItem) => {
    setIsLoading(true);
    apiClient.update<ICustomerItem>(endpoints.customers.update, value).then(
      data => {
        if (data) {
          setValues(data);
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

  const create = useCallback(async (value: IAddress) => {
    setIsLoading(true);
    const addresses = data?.addresses || [];
    addresses.push(value);
    apiClient
      .update<ICustomerItem>(endpoints.customers.update, {
        ...data,
        addresses,
        modifiedBy: session?.user.userName,
      })
      .then(
        data => {
          if (data) {
            setValues(data);
            setTimeout(() => {
              setIsLoading(false);
              toast.success(t('CREATE_SUCCESS'));
              onSubmit();
            }, 300);
          } else {
            setIsLoading(false);
            toast.error(t('ERR_CREATE_GENERIC_MSG'));
          }
        },
        err => {
          toast.error(err.toString());
          setIsLoading(false);
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode === 'new') {
      setFormFields(defaultFormFields.filter(x => x.name != 'isDefault'));
      setTimeout(() => {
        setValues(initialValues);
        setLoadingStatus(DataLoadingStatus.done);
      }, 300);
    }
    if (mode === 'edit') {
      loadData();
    }
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
                    isLoading={isLoading}
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

export default AddressBasicForm;

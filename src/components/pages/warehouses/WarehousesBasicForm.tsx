'use client';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useToast, useTranslate, useLookup } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { useSession } from 'next-auth/react';
import { endpoints, countriesLookup } from '@app/libs';
import { IInventoryItem } from '@app/types';
interface IWarehousesBasicFormProps {
  id: string | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}
const WarehousesBasicForm = (props: IWarehousesBasicFormProps) => {
  const { mode, id, onCancel, onSubmit } = props;
  const { data: session } = useSession();
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const t = useTranslate('COMP_WarehousesBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([countriesLookup]);
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'name',
      label: t('NAME_LABEL'),
      placeholder: t('NAME_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'outerId',
      label: t('OUTERID_LABEL'),
      placeholder: t('OUTERID_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'geoLocation',
      label: t('LOCATION_LABEL'),
      placeholder: t('LOCATION_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'line1',
      label: t('ADDRESS_LABEL'),
      placeholder: t('ADDRESS_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'synced',
      label: t('SYNCED_LABEL'),
      type: 'checkbox',
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
      name: 'postalCode',
      label: t('ZIP_LABEL'),
      placeholder: t('ZIP_PLACEHOLDER'),
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
      name: 'city',
      label: t('CITY_LABEL'),
      placeholder: t('CITY_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'countryName',
      label: t('COUNTRY_LABEL'),
      type: 'select',
      col: 6,
    },
    {
      name: 'description',
      label: t('DESCRIPTION_LABEL'),
      type: 'textarea',
    },
    {
      name: 'shortDescription',
      label: t('SHORT_DESCRIPTION_LABEL'),
      type: 'textarea',
    },
  ];

  //Form fields validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('ERR_NAME_MIN', { length: 3 }))
      .max(50, t('ERR_NAME_MAX', { length: 50 }))
      .trim()
      .matches(appRegx.StartWithCharAllowSpace, t('ERR_NAME_REGX'))
      .required(t('ERR_NAME_REQUIRED')),
    description: Yup.string().required(t('ERR_DESCRIPTION_REQUIRED')),
    shortDescription: Yup.string().required(t('ERR_SHORT_DESCRIPTION_REQUIRED')),
    line1: Yup.string().required(t('ERR_ADDRESS_REQUIRED')),
    city: Yup.string().required(t('ERR_CITY_REQUIRED')),
    countryName: Yup.string().required(t('ERR_COUNTRY_REQUIRED')),
    postalCode: Yup.string().required(t('ERR_ZIP_REQUIRED')),
    phone: Yup.string().matches(appRegx.PhoneRegExp, 'Enter Valid phone number').required(t('ERR_PHONE_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      name: '',
      description: '',
      shortDescription: '',
      geoLocation: '',
      line1: '',
      phone: '',
      postalCode: '',
      email: '',
      city: '',
      countryName: '',
      synced: true,
    };
  }, []);

  const onFormSubmit = formValues => {
    if (mode === 'new')
      create({
        ...formValues,
        address: {
          line1: formValues.line1,
          phone: formValues.phone,
          countryName: formValues.countryName,
          postalCode: formValues.postalCode,
          email: formValues.email,
          city: formValues.city,
        },
        createdBy: session?.user.userName,
        modifiedBy: session?.user.userName,
      });
    if (mode === 'edit')
      updateData({
        ...formValues,
        id,
        address: {
          line1: formValues.line1,
          phone: formValues.phone,
          countryName: formValues.countryName,
          postalCode: formValues.postalCode,
          email: formValues.email,
          city: formValues.city,
        },
        modifiedBy: session?.user.userName,
      });
  };
  const loadData = useCallback(async () => {
    apiClient.select<IInventoryItem>(endpoints.warehouses.details, { urlParams: { id } }).then(
      data => {
        const initialDataValues = data;
        initialDataValues.line1 = data.address.line1;
        initialDataValues.phone = data.address.phone;
        initialDataValues.countryName = data.address.countryName;
        initialDataValues.postalCode = data.address.postalCode;
        initialDataValues.email = data.address.email;
        initialDataValues.city = data.address.city;
        setValues(initialDataValues);
        setTimeout(() => {
          setLoadingStatus(DataLoadingStatus.done);
        }, 1000);
      },
      err => {
        toast.error(err.toString());
        setLoadingStatus(DataLoadingStatus.done);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateData = useCallback(async (value: IInventoryItem) => {
    setIsLoading(true);
    apiClient.update<IInventoryItem>(endpoints.warehouses.update, value).then(
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
  const create = useCallback(async (value: IInventoryItem) => {
    setIsLoading(true);
    apiClient.update<IInventoryItem>(endpoints.warehouses.create, value).then(
      data => {
        if (data) {
          setValues(data);
          setTimeout(() => {
            setIsLoading(false);
            toast.success(t('CREATE_SUCCESS', { name: data.firstName }));
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
    if (formFields) {
      if (mode === 'new') {
        setValues(initialValues);
        setLoadingStatus(DataLoadingStatus.done);
      }
      if (mode === 'edit') {
        loadData();
      }
    }
  }, [formFields, initialValues, loadData, mode]);
  useEffect(() => {
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'countryName')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.countries,
        ];
        setFormFields(defaultFormFields);
      },
      err => {
        toast.error(t('ERR_CREATE_GENERIC_MSG'));
        onCancel();
      },
    );
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

export default WarehousesBasicForm;

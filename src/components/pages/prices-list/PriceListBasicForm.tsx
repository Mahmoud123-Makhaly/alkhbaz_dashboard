'use client';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useLookup, useToast, useTranslate } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { currencyLookup, endpoints } from '@app/libs';
import { useSession } from 'next-auth/react';
import { IPriceListItem } from '@app/types';
interface IPriceListBasicFormFormProps {
  id: string | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const PriceListBasicForm = (props: IPriceListBasicFormFormProps) => {
  const { mode, id, onCancel, onSubmit } = props;
  const { data: session } = useSession();
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_PriceListBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([currencyLookup]);
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'name',
      label: t('NAME_LABEL'),
      placeholder: t('NAME_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'currency',
      label: t('CURRENCY_LABEL'),
      type: 'select',
    },
    {
      name: 'description',
      label: t('DESCRIPTION_LABEL'),
      placeholder: t('DESCRIPTION_PLACEHOLDER'),
      type: 'textarea',
    },
  ];
  //Form fields validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('ERR_NAME_MIN', { length: 3 }))
      .max(20, t('ERR_NAME_MAX', { length: 20 }))
      .trim()
      .matches(appRegx.StartWithCharAllowSpace, t('ERR_NAME_REGX'))
      .required(t('ERR_NAME_REQUIRED')),
    description: Yup.string().required(t('ERR_DESCRIPTION_REQUIRED')),
    currency: Yup.string().required(t('ERR_CURRENCY_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      name: '',
      description: '',
      currency: '',
    };
  }, []);
  const onFormSubmit = formValues => {
    if (mode === 'new')
      create({ ...formValues, createdBy: session?.user.userName, modifiedBy: session?.user.userName });
    if (mode === 'edit') updateData({ ...formValues, id, modifiedBy: session?.user.userName });
  };
  const loadData = useCallback(async () => {
    apiClient.select<IPriceListItem>(endpoints.pricesList.details, { urlParams: { id } }).then(
      data => {
        setValues(data);
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
  const updateData = useCallback(async (value: IPriceListItem) => {
    setIsLoading(true);
    apiClient.create<IPriceListItem>(endpoints.pricesList.update, value).then(
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
  const create = useCallback(async (value: IPriceListItem) => {
    setIsLoading(true);
    apiClient.create<IPriceListItem>(endpoints.pricesList.create, value).then(
      data => {
        if (data) {
          setValues(data);
          setTimeout(() => {
            setIsLoading(false);
            toast.success(t('CREATE_SUCCESS', { name: data.name }));
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
        defaultFormFields.find(x => x.name === 'currency')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.currency,
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

export default PriceListBasicForm;

'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useLookup, useToast, useTranslate } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { useSession } from 'next-auth/react';
import { endpoints, catalogLookup, priceListLookup, storesLookup } from '@app/libs';
import { IPricesAssignmentItem } from '@app/types';

interface IPricesAssignmentsProps {
  id: string | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const PricesAssignmentsBasicForm = (props: IPricesAssignmentsProps) => {
  const { mode, id, onCancel, onSubmit } = props;
  const { data: session } = useSession();
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_PricesAssignmentsBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([catalogLookup, priceListLookup, storesLookup]);
  const onSelectChange = (fieldName?, selectedOption?) => {
    if (fieldName && (fieldName === 'catalogId' || fieldName === 'storeId')) {
      defaultFormFields.find(x => x.name === 'catalogId')!.readOnly =
        selectedOption.value === '' ? false : fieldName === 'storeId';
      defaultFormFields.find(x => x.name === 'storeId')!.readOnly =
        selectedOption.value === '' ? false : fieldName === 'catalogId';
      setFormFields(defaultFormFields);
    }
  };
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'name',
      label: t('NAME_LABEL'),
      placeholder: t('NAME_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'catalogId',
      label: t('ASSIGNMENT_CATALOG_LABEL'),
      type: 'select',
      onSelectChange,
    },
    {
      name: 'pricelistId',
      label: t('ASSIGNMENT_PRICE_LABEL'),
      type: 'select',
    },
    {
      name: 'priority',
      label: t('PREIORTY_LABEL'),
      placeholder: t('PREIORTY_PLACEHOLDER'),
      type: 'number',
      col: 6,
    },
    {
      name: 'storeId',
      label: t('STORE_LABEL'),
      type: 'select',
      col: 6,
      onSelectChange,
    },
    {
      name: 'startDate',
      label: t('START_LABEL'),
      type: 'date',
      options: { minDate: new Date(), enableTime: true, altInput: true, altFormat: 'F j, Y H:i' },
      col: 6,
    },
    {
      name: 'endDate',
      label: t('END_LABEL'),
      type: 'date',
      options: { enableTime: true, altInput: true, altFormat: 'F j, Y H:i' },
      col: 6,
    },
    {
      name: 'description',
      label: t('DESCRIPTION_LABEL'),
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
    pricelistId: Yup.string().required(t('ERR_PRICE_REQUIRED')),
    description: Yup.string().required(t('ERR_DESCRIPTION_REQUIRED')),
    priority: Yup.string().required(t('ERR_PRIORTY_REQUIRED')),
    startDate: Yup.date().required(t('ERR_STARTDATE_REQUIRED')),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), t(`ERR_ENDDATE_MIN`))
      .notOneOf([Yup.ref('startDate')])
      .required(t('ERR_ENDDATE_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      name: '',
      catalogId: '',
      pricelistId: '',
      startDate: null,
      endDate: null,
      description: '',
      priority: '',
      storeId: '',
    };
  }, []);
  const onFormSubmit = formValues => {
    if (mode === 'new')
      create({ ...formValues, createdBy: session?.user.userName, modifiedBy: session?.user.userName });
    if (mode === 'edit') updateData({ ...formValues, id, modifiedBy: session?.user.userName });
  };

  const loadData = useCallback(async () => {
    apiClient.select<IPricesAssignmentItem>(endpoints.assignments.details, { urlParams: { id } }).then(
      data => {
        setValues(data);
        if (data.catalogId) {
          defaultFormFields.find(x => x.name === 'storeId')!.readOnly = true;
        }
        if (data.storeId) {
          defaultFormFields.find(x => x.name === 'catalogId')!.readOnly = true;
        }
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

  const updateData = useCallback(async (value: IPricesAssignmentItem) => {
    setIsLoading(true);
    apiClient.update<IPricesAssignmentItem>(endpoints.assignments.update, value).then(
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

  const create = useCallback(async (value: IPricesAssignmentItem) => {
    setIsLoading(true);
    apiClient.create<IPricesAssignmentItem>(endpoints.assignments.create, value).then(
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
    lookup.load().then(data => {
      defaultFormFields.find(x => x.name === 'pricelistId')!.options = [
        { value: '', label: t('DEFAULT_OPTION') },
        ...data.priceList,
      ];
      defaultFormFields.find(x => x.name === 'catalogId')!.options = [
        { value: '', label: t('DEFAULT_OPTION') },
        ...data.catalogs,
      ];
      defaultFormFields.find(x => x.name === 'storeId')!.options = [
        { value: '', label: t('DEFAULT_OPTION') },
        ...data.stores,
      ];
      setFormFields(defaultFormFields);
    });
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
export default PricesAssignmentsBasicForm;

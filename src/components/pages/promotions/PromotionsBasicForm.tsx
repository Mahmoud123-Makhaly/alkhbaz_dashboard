'use client';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useToast, useTranslate, useLookup } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { endpoints, storesLookup } from '@app/libs';
import { useSession } from 'next-auth/react';
import { IPromotionItem } from '@app/types';
interface IPromotionBasicFormProps {
  id: string | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const PromotionsBasicForm = (props: IPromotionBasicFormProps) => {
  const { mode, id, onCancel, onSubmit } = props;
  const { data: session } = useSession();
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const t = useTranslate('COMP_PromotionBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([storesLookup]);
  const today = new Date();
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'name',
      label: t('NAME_LABEL'),
      placeholder: t('NAME_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'startDate',
      label: t('STARTDATE_LABEL'),
      type: 'date',
      options: { minDate: today, enableTime: true, altInput: true, altFormat: 'F j, Y H:i' },
    },
    {
      name: 'endDate',
      label: t('ENDDATE_LABEL'),
      type: 'date',
      options: { enableTime: true, altInput: true, altFormat: 'F j, Y H:i' },
    },
    {
      name: 'storeIds',
      label: t('STORE_LABEL'),
      placeholder: t('STORE_PLACEHOLDER'),
      type: 'select',
      isMulti: true,
      col: 12,
    },

    {
      name: 'isExclusive',
      label: t('EXCLUSIVITY_LABEL'),
      type: 'select',
      col: 12,
      options: [
        {
          label: 'Valid with other offers',
          value: false,
        },
        {
          label: 'Globally exclusive',
          value: true,
        },
      ],
    },
    {
      name: 'description',
      label: t('DESCRIPTION_LABEL'),
      type: 'textarea',
    },
    {
      name: 'isActive',
      label: t('ISACTIVE_LABEL'),
      type: 'checkbox',
      col: 6,
    },
    {
      name: 'hasCoupons',
      label: t('HASCOUPONS_LABEL'),
      type: 'checkbox',
      col: 6,
    },
    {
      name: 'isAllowCombiningWithSelf',
      label: t('ALLOW_COMBINING_LABEL'),
      type: 'checkbox',
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
    startDate: Yup.date().required(t('ERR_STARTDATE_REQUIRED')),
    endDate: Yup.date().required(t('ERR_ENDDATE_REQUIRED')),
    description: Yup.string().required(t('ERR_DESCRIPTION_REQUIRED')),
    storeIds: Yup.array().min(1, t('ERR_STORE_MIN')).required(t('ERR_STORE_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      name: '',
      startDate: null,
      endDate: null,
      description: '',
      isActive: true,
      hasCoupons: false,
      storeIds: '',
      isAllowCombiningWithSelf: false,
      isExclusive: false,
    };
  }, []);
  const onFormSubmit = formValues => {
    const stores = formFields
      ?.find(x => x.name === 'storeIds')!
      .options.filter(x => formValues.storeIds.includes(x.value))
      .map(item => {
        return {
          id: item.value,
          name: item.label,
        };
      });
    if (mode === 'new')
      create({ ...formValues, stores, createdBy: session?.user.userName, modifiedBy: session?.user.userName });
    if (mode === 'edit') updateData({ ...formValues, id, stores, modifiedBy: session?.user.userName });
  };
  const loadData = useCallback(async () => {
    apiClient.select<IPromotionItem>(endpoints.promotions.details, { urlParams: { id } }).then(
      data => {
        const manipulatedData = data;
        manipulatedData.storeIds = data.storeIds.map(item => item);
        setValues(manipulatedData);
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
  const updateData = useCallback(async (value: IPromotionItem) => {
    setIsLoading(true);
    apiClient.update<IPromotionItem>(endpoints.promotions.update, value).then(
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
  const create = useCallback(async (value: IPromotionItem) => {
    setIsLoading(true);
    apiClient.create<IPromotionItem>(endpoints.promotions.create, value).then(
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
        defaultFormFields.find(x => x.name === 'storeIds')!.options = [...data.stores];
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

export default PromotionsBasicForm;

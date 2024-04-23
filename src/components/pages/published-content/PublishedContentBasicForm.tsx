'use client';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useToast, useTranslate, useLookup } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { endpoints, contentPlaceLookup, contentItemsLookup, storesLookup } from '@app/libs';
import { IPublishedContentItem } from '@app/types';
interface IPublishedContentBasicFormProps {
  id: string | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}
const PublishedContentBasicForm = (props: IPublishedContentBasicFormProps) => {
  const { mode, id, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_PublishedContentBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([contentPlaceLookup, contentItemsLookup, storesLookup]);
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
      name: 'contentPlaces',
      label: t('CONTENT_PLACE_LABEL'),
      type: 'select',
      isMulti: true,
      placeholder: t('CONTENT_PLACE_PLACEHOLDER'),
    },
    {
      name: 'storeId',
      label: t('STORE_LABEL'),
      type: 'select',
    },
    {
      name: 'contentItems',
      label: t('CONTENT_ITEMS_LABEL'),
      type: 'select',
      isMulti: true,
      placeholder: t('CONTENT_ITEM_PLACEHOLDER'),
      col: 8,
    },
    {
      name: 'isActive',
      label: t('ACTIVE_LABEL'),
      type: 'checkbox',
      col: 4,
    },
    {
      name: 'startDate',
      label: t('START_LABEL'),
      type: 'date',
      options: { minDate: today, enableTime: true, altInput: true, altFormat: 'F j, Y H:i' },
    },
    {
      name: 'endDate',
      label: t('END_LABEL'),
      type: 'date',
      options: { minDate: today, enableTime: true, altInput: true, altFormat: 'F j, Y H:i' },
    },
    {
      name: 'description',
      label: t('DESCRIPTION_LABEL'),
      type: 'textarea',
      col: 12,
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
    contentItems: Yup.array().min(1, t('ERR_CONTENT_ITEMS_MIN')).required(t('ERR_CONTENT_ITEMS_REQUIRED')),
    contentPlaces: Yup.array().min(1, t('ERR_CONTENT_PLACE_MIN')).required(t('ERR_CONTENT_PLACE_REQUIRED')),
    storeId: Yup.string().required(t('ERR_STORE_REQUIRED')),
    description: Yup.string().required(t('ERR_DESCRIPTION_REQUIRED')),
    startDate: Yup.date().required(t('ERR_START_DATE_REQUIRED')),
    endDate: Yup.date()
      .required(t('ERR_END_DATE_REQUIRED'))
      .when('startDate', (startDate, schema) => {
        return schema.min(startDate, t('ERR_END_DATE_MIN'));
      }),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      name: '',
      contentPlaces: '',
      contentItems: '',
      storeId: '',
      isActive: false,
      startDate: new Date(),
      endDate: new Date(),
      description: '',
    };
  }, []);
  const onFormSubmit = formValues => {
    if (mode === 'new')
      create({
        ...formValues,
        contentPlaces: formValues.contentPlaces.map(item => {
          return {
            id: item,
          };
        }),
        contentItems: formValues.contentItems.map(item => {
          return {
            id: item,
          };
        }),
      });
    if (mode === 'edit')
      updateData({
        ...formValues,
        id,
        contentPlaces: formValues.contentPlaces.map(item => {
          return {
            id: item,
          };
        }),
        contentItems: formValues.contentItems.map(item => {
          return {
            id: item,
          };
        }),
      });
  };
  const loadData = useCallback(async () => {
    apiClient.select<IPublishedContentItem>(endpoints.publishedContent.details, { urlParams: { id } }).then(
      data => {
        const manipulatedData = data;
        manipulatedData.contentItems = data.contentItems.map(item => item.id);
        manipulatedData.contentPlaces = data.contentPlaces.map(item => item.id);
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
  const updateData = useCallback(async (value: IPublishedContentItem) => {
    setIsLoading(true);
    apiClient.update<IPublishedContentItem>(endpoints.publishedContent.update, value).then(
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
  const create = useCallback(async (value: IPublishedContentItem) => {
    setIsLoading(true);
    apiClient.create<IPublishedContentItem>(endpoints.publishedContent.create, value).then(
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
        defaultFormFields.find(x => x.name === 'contentPlaces')!.options = [...data.contentPlaces];
        defaultFormFields.find(x => x.name === 'contentItems')!.options = [...data.contentItems];
        defaultFormFields.find(x => x.name === 'storeId')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.stores,
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

export default PublishedContentBasicForm;

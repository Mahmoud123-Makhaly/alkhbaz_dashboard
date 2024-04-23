'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLookup, useTranslate } from '@app/hooks';
import { endpoints, IApiAPPClient, editorialReviewTypes, languagesLookup } from '@app/libs';
import { IProductItem } from '@app/types';
import { ToastContent } from 'react-toastify';
interface IProductDetailsDescriptionFormProps {
  id?: string | null;
  apiClient: IApiAPPClient;
  product: IProductItem;
  mode: 'new' | 'edit' | null;
  toast: {
    success: (content: ToastContent) => void;
    info: (content: ToastContent) => void;
    error: (content: ToastContent) => void;
    warn: (content: ToastContent) => void;
  };
  onCancel: () => void;
  onSubmit: () => void;
}

const ProductDetailsDescriptionForm = (props: IProductDetailsDescriptionFormProps) => {
  const { mode, id, apiClient, product, toast, onCancel, onSubmit } = props;
  const { data: session } = useSession();
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_ProductDetailsDescriptionForm');
  const lookup = useLookup([editorialReviewTypes, languagesLookup]);

  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'reviewType',
      label: t('REVIEW_TYP_LABEL'),
      type: 'select',
    },
    {
      name: 'languageCode',
      label: t('LANGUAGES_LABEL'),
      type: 'select',
    },
    {
      name: 'content',
      label: t('DESCRIPTION'),
      placeholder: t('DESCRIPTION_PLACEHOLDER'),
      type: 'textarea',
      style: { minHeight: '200px' },
    },
  ];
  //Form fields validation schema
  const validationSchema = Yup.object({
    reviewType: Yup.string().required(t('ERR_REVIEW_TYP_REQUIRED')),
    languageCode: Yup.string().required(t('ERR_LANGUAGES_REQUIRED')),
    content: Yup.string().required(t('ERR_DESCRIPTION_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      reviewType: '',
      languageCode: '',
      content: '',
    };
  }, []);

  const onFormSubmit = formValues => {
    if (mode === 'new') {
      const descriptionData = [...(product.reviews || [])];
      descriptionData.push({ ...formValues });
      create({
        ...product,
        reviews: [...descriptionData],
        modifiedBy: session?.user.userName || '',
      });
    }
    if (mode === 'edit') {
      const descriptionData = [...(product.reviews?.filter(x => x.id != id) || [])];
      descriptionData.push({ ...formValues, id });
      updateData({
        ...product,
        reviews: [...descriptionData],
        modifiedBy: session?.user.userName || '',
      });
    }
  };

  const loadData = useCallback(async () => {
    if (product && product.reviews) {
      const descriptionData = product.reviews.find(x => x.id === id);
      if (descriptionData) {
        setValues(descriptionData);
      }
    }

    setTimeout(() => {
      setLoadingStatus(DataLoadingStatus.done);
    }, 1000);
  }, [id, product]);

  const updateData = useCallback(async (value: IProductItem) => {
    setIsLoading(true);
    apiClient.create<IProductItem>(endpoints.products.update, value).then(
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

  const create = useCallback(async (value: IProductItem) => {
    setIsLoading(true);
    apiClient.create<IProductItem>(endpoints.products.create, value).then(
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
      if (mode === 'edit') loadData();
    }
  }, [formFields, initialValues, loadData, mode]);

  useEffect(() => {
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'reviewType')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.editorialReviewTypes,
        ];
        defaultFormFields.find(x => x.name === 'languageCode')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.languages,
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
export default ProductDetailsDescriptionForm;

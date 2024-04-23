'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useLookup, useToast, useTranslate } from '@app/hooks';
import { endpoints, languagesLookup, imageCategories } from '@app/libs';
import { useSession } from 'next-auth/react';
import { IProductItem, IProductImage } from '@app/types';
interface IProductImageBasicFormProps {
  id: string | null;
  image: any;
  product: any;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const EditProductImageBasicForm = (props: IProductImageBasicFormProps) => {
  const { mode, id, onCancel, onSubmit, image, product } = props;
  const { data: session } = useSession();
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_EditProductImageBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([languagesLookup, imageCategories]);
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'name',
      label: t('NAME_LABEL'),
      placeholder: t('NAME_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'languageCode',
      label: t('LANGUAGE_LABEL'),
      type: 'select',
      col: 6,
    },
    {
      name: 'group',
      label: t('GROUP_LABEL'),
      type: 'select',
      col: 6,
    },
    {
      name: 'sortOrder',
      label: t('SORT_LABEL'),
      type: 'number',
    },
    {
      name: 'altText',
      label: t('ALT_TEXT_LABEL'),
      placeholder: t('ALT_TEXT_PLACEHOLDER'),
      type: 'textarea',
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
    name: Yup.string().required(t('ERR_NAME_REQUIRED')),
    languageCode: Yup.string().required(t('ERR_LANGUAGE_REQUIRED')),
    group: Yup.string().required(t('ERR_GROUP_REQUIRED')),
    sortOrder: Yup.number().required(t('ERR_SORT_REQUIRED')),
    altText: Yup.string().required(t('ERR_ALT_TEXT_REQUIRED')),
    description: Yup.string().required(t('ERR_DESCRIPTION_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      name: '',
      languageCode: '',
      group: '',
      sortOrder: 1,
      altText: '',
      description: '',
    };
  }, []);
  const onFormSubmit = formValues => {
    if (mode === 'edit') {
      const newImageObj: Array<IProductImage> = product.images || [];
      const index = newImageObj.findIndex(i => i.id === id);

      if (index !== -1) {
        newImageObj.splice(index, 1);
      }
      newImageObj.push(formValues);
      updateData({
        ...product,
        modifiedBy: session?.user.userName,
        images: newImageObj,
      });
    }
  };
  const loadData = useCallback(async () => {
    const newImage = image;
    newImage.altText = newImage.altText ? newImage.altText : product.name;
    newImage.description = newImage.description ? newImage.description : product.name;
    setValues(newImage);
    setTimeout(() => {
      setLoadingStatus(DataLoadingStatus.done);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        defaultFormFields.find(x => x.name === 'group')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.imageCategories,
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
export default EditProductImageBasicForm;

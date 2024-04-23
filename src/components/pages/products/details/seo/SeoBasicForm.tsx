'use client';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useLookup, useToast, useTranslate } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { endpoints, storesLookup, languagesLookup } from '@app/libs';
import { IProductItem, ISEOInfo } from '@app/types';
import { useSession } from 'next-auth/react';

interface ISeoBasicFormProps {
  seoItem?: ISEOInfo | null;
  seoId: string | null;
  mode: 'new' | 'edit' | null;
  product: IProductItem;
  onCancel: () => void;
  onSubmit: () => void;
}

const SeoBasicForm = (props: ISeoBasicFormProps) => {
  const { mode, seoItem, product, onCancel, onSubmit, seoId } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_SeoBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([storesLookup, languagesLookup]);
  const { data: session } = useSession();

  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'storeId',
      label: t('STORE_LABEL'),
      type: 'select',
      col: 6,
    },

    {
      name: 'languageCode',
      label: t('LANGUAGE_LABEL'),
      type: 'select',
      placeholder: t('LANGUAGE_CODE_PLACEHOLDER'),
      col: 6,
    },
    {
      name: 'semanticUrl',
      label: t('URL_SLUG_LABEL'),
      type: 'text',
      placeholder: t('SEMANTIC_URL_PLACEHOLDER'),
      col: 6,
    },

    {
      name: 'pageTitle',
      label: t('PAGE_TITLE_LABEL'),
      type: 'text',
      placeholder: t('PAGE_TITLE_PLACEHOLDER'),
      col: 6,
    },
    {
      name: 'metaDescription',
      label: t('META_DESCRIPTION_LABEL'),
      type: 'textarea',
      placeholder: t('META_DESCRIPTION_PLACEHOLDER'),
    },
    {
      name: 'metaKeywords',
      label: t('META_KEYWORDS_LABEL'),
      type: 'textarea',
      placeholder: t('META_KEYWORDS_PLACEHOLDER'),
    },
    {
      name: 'imageAltDescription',
      label: t('IMAGE_ALT_DESCRIPTION_LABEL'),
      type: 'textarea',
      placeholder: t('IMAGE_ALT_DESCRIPTION_PLACEHOLDER'),
    },
  ];
  //Form fields validation schema
  const validationSchema = Yup.object({
    storeId: Yup.string().required(t('ERR_STORE_REQUIRED')),
    languageCode: Yup.string().required(t('ERR_LANGUAGE_REQUIRED')),
    semanticUrl: Yup.string().required(t('ERR_URL_SLUG_REQUIRED')),
    pageTitle: Yup.string().required(t('ERR_PAGE_TITLE_REQUIRED')),
    metaDescription: Yup.string().required(t('ERR_META_DESCRIPTION_REQUIRED')),
    metaKeywords: Yup.string().required(t('ERR_META_KEYWORDS_REQUIRED')),
    imageAltDescription: Yup.string().required(t('ERR_IMAGE_ALT_DESCRIPTION_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      storeId: '',
      languageCode: '',
      semanticUrl: '',
      pageTitle: '',
      metaDescription: '',
      metaKeywords: '',
      imageAltDescription: '',
    };
  }, []);
  const onFormSubmit = formValues => {
    if (mode === 'new') {
      const newSEOObj: Array<ISEOInfo> = product.seoInfos || [];
      newSEOObj.push(formValues);
      create({
        ...product,
        seoInfos: newSEOObj,
        modifiedBy: session?.user.userName!,
      });
    }
    if (mode === 'edit') {
      const newSEOObj: Array<ISEOInfo> = product.seoInfos || [];
      _.remove(newSEOObj, item => item.id === seoId);
      newSEOObj.push(formValues);
      updateData({
        ...product,
        seoInfos: newSEOObj,
        modifiedBy: session?.user.userName!,
      });
    }
  };
  const loadData = useCallback(async () => {
    setValues(seoItem);
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
  const create = useCallback(async (value: IProductItem) => {
    setIsLoading(true);
    apiClient.create<IProductItem>(endpoints.products.update, value).then(
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
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'storeId')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.stores,
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

export default SeoBasicForm;

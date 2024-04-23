'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastContent } from 'react-toastify';
import { useSession } from 'next-auth/react';

import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import { useLookup, useTranslate } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import {
  endpoints,
  companiesLookup,
  productTax,
  IApiAPPClient,
  packageTypes,
  weightUnits,
  measureUnits,
} from '@app/libs';
import { IProductItem, ISEOInfo } from '@app/types';
import { DefaultLangCode } from '@helpers/constants';
import { Utils } from '@helpers/utils';
interface IProductDetailsVariationFormProps {
  apiClient: IApiAPPClient;
  product: IProductItem;
  toast: {
    success: (content: ToastContent) => void;
    info: (content: ToastContent) => void;
    error: (content: ToastContent) => void;
    warn: (content: ToastContent) => void;
  };
  onCancel: () => void;
  onSubmit: () => void;
}

const ProductDetailsVariationForm = (props: IProductDetailsVariationFormProps) => {
  const { apiClient, product, toast, onCancel, onSubmit } = props;
  const { data: session } = useSession();
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_ProductDetailsVariationForm');

  const lookup = useLookup([companiesLookup, productTax, packageTypes, weightUnits, measureUnits]);
  const today = new Date();

  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'name',
      label: t('NAME_LABEL'),
      placeholder: t('NAME_PLACEHOLDER'),
      type: 'text',
      col: 6,
      fieldDisplayOrder: 1,
    },
    {
      name: 'priority',
      label: t('PRIORITY_LABEL'),
      placeholder: t('PRIORITY_PLACEHOLDER'),
      type: 'number',
      col: 6,
      fieldDisplayOrder: 2,
    },
    {
      name: 'outerId',
      label: t('OUTERID_LABEL'),
      placeholder: t('OUTERID_PLACEHOLDER'),
      type: 'text',
      col: 6,
      fieldDisplayOrder: 3,
    },
    {
      name: 'code',
      label: t('CODE_LABEL'),
      placeholder: t('CODE_PLACEHOLDER'),
      type: 'text',
      col: 6,
      fieldDisplayOrder: 4,
    },
    {
      name: 'vendor',
      label: t('VENDOR_LABEL'),
      type: 'select',
      col: 6,
      fieldDisplayOrder: 5,
    },
    {
      name: 'taxType',
      label: t('TAX_LABEL'),
      type: 'select',
      col: 6,
      fieldDisplayOrder: 6,
    },
    {
      name: 'minQuantity',
      label: t('MIN_LABEL'),
      placeholder: t('MIN_PLACEHOLDER'),
      type: 'number',
      col: 6,
      fieldDisplayOrder: 7,
    },
    {
      name: 'maxQuantity',
      label: t('MAX_LABEL'),
      placeholder: t('MAX_PLACEHOLDER'),
      type: 'number',
      col: 6,
      fieldDisplayOrder: 8,
    },
    {
      name: 'startDate',
      label: t('START_LABEL'),
      type: 'date',
      options: { minDate: today, enableTime: true, altInput: true, altFormat: 'F j, Y H:i' },
      col: 6,
      fieldDisplayOrder: 9,
    },
    {
      name: 'endDate',
      label: t('END_LABEL'),
      type: 'date',
      options: { minDate: today, enableTime: true, altInput: true, altFormat: 'F j, Y H:i' },
      col: 6,
      fieldDisplayOrder: 10,
    },
    {
      name: 'packageType',
      label: t('PACKAGE_TYPE_LABEL'),
      placeholder: t('PACKAGE_TYPE_PLACEHOLDER'),
      type: 'select',
      col: 6,
      fieldDisplayOrder: 13,
    },
    {
      name: 'weightUnit',
      label: t('MASS_UNIT_LABEL'),
      placeholder: t('MASS_UNIT_PLACEHOLDER'),
      type: 'select',
      col: 3,
      fieldDisplayOrder: 14,
    },
    {
      name: 'weight',
      label: t('WEIGHT_LABEL'),
      placeholder: t('WEIGHT_PLACEHOLDER'),
      type: 'number',
      col: 3,
      fieldDisplayOrder: 15,
    },
    {
      name: 'measureUnit',
      label: t('MEASUREMENT_TYPE_LABEL'),
      placeholder: t('MEASUREMENT_TYPE_PLACEHOLDER'),
      type: 'select',
      col: 3,
      fieldDisplayOrder: 16,
    },
    {
      name: 'length',
      label: t('LENGTH_LABEL'),
      placeholder: t('LENGTH_PLACEHOLDER'),
      type: 'number',
      col: 3,
      fieldDisplayOrder: 17,
    },
    {
      name: 'height',
      label: t('HEIGHT_LABEL'),
      placeholder: t('HEIGHT_PLACEHOLDER'),
      type: 'number',
      col: 3,
      fieldDisplayOrder: 18,
    },
    {
      name: 'width',
      label: t('WIDTH_LABEL'),
      placeholder: t('WIDTH_PLACEHOLDER'),
      type: 'number',
      col: 3,
      fieldDisplayOrder: 19,
    },
    {
      name: 'isActive',
      label: t('ACTIVE_LABEL'),
      type: 'checkbox',
      col: 3,
      fieldDisplayOrder: 20,
    },
    {
      name: 'isBuyable',
      label: t('BUYABLE_LABEL'),
      type: 'checkbox',
      col: 3,
      fieldDisplayOrder: 21,
    },
    {
      name: 'synced',
      label: t('SYNCED_LABEL'),
      type: 'checkbox',
      col: 3,
      fieldDisplayOrder: 22,
    },
    {
      name: 'trackInventory',
      label: t('TRACK_LABEL'),
      type: 'checkbox',
      col: 3,
      fieldDisplayOrder: 23,
    },
  ];
  //Form fields validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('ERR_NAME_MIN', { length: 3 }))
      .max(100, t('ERR_NAME_MAX', { length: 100 }))
      .trim()
      .matches(appRegx.StartWithCharAllowSpaceBackSlashForwardSlashDash, t('ERR_NAME_REGX'))
      .required(t('ERR_NAME_REQUIRED')),
    code: Yup.string().required(t('ERR_CODE_REQUIRED')),
    priority: Yup.number().required(t('ERR_PRIORITY_REQUIRED')),
    taxType: Yup.string().required(t('ERR_TAX_REQUIRED')),
    vendor: Yup.string().required(t('ERR_VENDOR_REQUIRED')),
    minQuantity: Yup.number().integer().required(t('ERR_MIN_REQUIRED')),
    maxQuantity: Yup.number()
      .integer()
      .required(t('ERR_MAX_REQUIRED'))
      .min(Yup.ref('minQuantity'), t('ERR_MAX_MORE_THAN_MIN')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      name: '',
      code: `${Utils.generateCode(3, true).toUpperCase()}-${new Date().getTime()}`,
      priority: '',
      startDate: today,
      endDate: null,
      isActive: true,
      isBuyable: true,
      trackInventory: true,
      vendor: '',
      taxType: '',
      minQuantity: '',
      maxQuantity: '',
      outerId: '',
      synced: true,
      packageType: '',
      weightUnit: '',
      weight: '',
      measureUnit: '',
      length: '',
    };
  }, []);

  const onFormSubmit = formValues => {
    const newSEOInfos: Array<ISEOInfo> = [
      {
        name: formValues.name.replace(' ', '-'),
        semanticUrl: formValues.name.replace(' ', '-'),
        languageCode: DefaultLangCode,
        metaDescription: `${formValues.name},${product.name}`,
        imageAltDescription: '',
        metaKeywords: `${formValues.name},${product.name}`,
        isActive: true,
      },
    ];
    const modifiedProd: IProductItem = {
      ...formValues,
      catalogId: product.catalogId,
      categoryId: product.categoryId,
      mainProductId: product.id,
      titularItemId: product.id,
      startDate: today,
      seoObjectType: 'CatalogProduct',
      seoInfos: newSEOInfos,
      createdBy: session?.user.userName,
      modifiedBy: session?.user.userName,
    };

    if (product.properties && product.properties.length > 0)
      modifiedProd.properties = [
        ...product.properties.map(item => {
          Utils.removeKeysDeep(item, ['id']);
          return item;
        }),
      ];
    if (product.assets && product.assets.length > 0)
      modifiedProd.assets = [
        ...product.assets.map(item => {
          Utils.removeKeysDeep(item, ['id']);
          return item;
        }),
      ];
    if (product.reviews && product.reviews.length > 0)
      modifiedProd.reviews = [
        ...product.reviews.map(item => {
          Utils.removeKeysDeep(item, ['id']);
          return item;
        }),
      ];
    if (product.images && product.images.length > 0)
      modifiedProd.images = [
        ...product.images.map(item => {
          Utils.removeKeysDeep(item, ['id']);
          return item;
        }),
      ];

    create({ ...modifiedProd });
  };

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
      setValues(initialValues);
      setLoadingStatus(DataLoadingStatus.done);
    }
  }, [formFields, initialValues]);

  useEffect(() => {
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'vendor')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.companies,
        ];
        defaultFormFields.find(x => x.name === 'taxType')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.productTax,
        ];
        defaultFormFields.find(x => x.name === 'packageType')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.packageTypes,
        ];
        defaultFormFields.find(x => x.name === 'weightUnit')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.weightUnits,
        ];
        defaultFormFields.find(x => x.name === 'measureUnit')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.measureUnits,
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
export default ProductDetailsVariationForm;

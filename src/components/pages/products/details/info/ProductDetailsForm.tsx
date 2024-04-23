'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ToastContent } from 'react-toastify';
import _ from 'lodash';
import { useLocale } from 'next-intl';

import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import { useLookup, useTranslate } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { ILookupOption, IProductItem, IProperties, ICatalogPropertiesAttribute, ISearchResponse } from '@app/types';
import { Utils } from '@helpers/utils';
import {
  endpoints,
  catalogLookup,
  categoriesLookup,
  vendorsLookup,
  productTax,
  IApiAPPClient,
  packageTypes,
  weightUnits,
  measureUnits,
} from '@app/libs';
interface IProductDetailsFormProps {
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

const ProductDetailsForm = (props: IProductDetailsFormProps) => {
  const { mode, apiClient, product, toast, onCancel, onSubmit } = props;
  const { data: session } = useSession();
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const locale = useLocale() === 'en' ? 'en-US' : 'ar-EG';
  const [ingredientsDP, setIngredientsDP] = useState<{
    property?: IProperties;
    propertyValues?: Array<ICatalogPropertiesAttribute>;
  }>();
  const t = useTranslate('COMP_ProductDetailsForm');
  const today = new Date();

  const lookup = useLookup([
    catalogLookup,
    categoriesLookup,
    vendorsLookup,
    productTax,
    packageTypes,
    weightUnits,
    measureUnits,
  ]);

  const onCatalogSelect = (name, selectedOption, meta, values) => {
    if (selectedOption && selectedOption.value && selectedOption.value != '') {
      toggleCategorySelect(selectedOption.value, { ...values, categoryId: '' });
    }
  };

  const toggleCategorySelect = useCallback((catalogId: string, data?: IProductItem) => {
    let filteredCategories = [
      ...(defaultFormFields
        .find(x => x.name === 'categoryId')!
        .options.filter(x => x.meta && x.meta.catalogId === catalogId) || []),
    ];

    if (filteredCategories && filteredCategories.length > 0) {
      let newCategoryFields = { ...defaultFormFields!.find(x => x.name === 'categoryId') } as FormFieldType;
      newCategoryFields.options = [{ value: '', label: t('DEFAULT_OPTION') }, ...filteredCategories];
      setFormFields(
        [...defaultFormFields.filter(x => x.name != 'categoryId'), newCategoryFields].sort(
          (a, b) => a.fieldDisplayOrder - b.fieldDisplayOrder,
        ),
      );
    } else
      setFormFields(
        defaultFormFields.filter(x => x.name != 'categoryId').sort((a, b) => a.fieldDisplayOrder - b.fieldDisplayOrder),
      );
    if (data) setValues({ ...data, catalogId, categoryId: data.categoryId });
  }, []);

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
      name: 'numberOfPieces',
      label: t('NUMBER_OF_PIECES'),
      type: 'number',
      col: 6,
      fieldDisplayOrder: 11,
    },
    {
      name: 'size',
      label: t('SIZE'),
      type: 'text',
      col: 3,
      fieldDisplayOrder: 12,
    },
    {
      name: 'enoughFor',
      label: t('ENOUGH_FOR'),
      type: 'number',
      col: 3,
      fieldDisplayOrder: 13,
    },
    {
      name: 'ingredients',
      label: t('INGREDIENTS'),
      type: 'select',
      isMulti: true,
      fieldDisplayOrder: 14,
    },
    {
      name: 'catalogId',
      label: t('PRO_CATALOG_LABEL'),
      type: 'select',
      onSelectChange: onCatalogSelect,
      col: 6,
      fieldDisplayOrder: 15,
    },
    {
      name: 'categoryId',
      label: t('PRO_CATEGORY_LABEL'),
      type: 'select',
      col: 6,
      fieldDisplayOrder: 16,
    },
    {
      name: 'packageType',
      label: t('PACKAGE_TYPE_LABEL'),
      placeholder: t('PACKAGE_TYPE_PLACEHOLDER'),
      type: 'select',
      col: 6,
      fieldDisplayOrder: 17,
    },
    {
      name: 'weightUnit',
      label: t('MASS_UNIT_LABEL'),
      placeholder: t('MASS_UNIT_PLACEHOLDER'),
      type: 'select',
      col: 3,
      fieldDisplayOrder: 18,
    },
    {
      name: 'weight',
      label: t('WEIGHT_LABEL'),
      placeholder: t('WEIGHT_PLACEHOLDER'),
      type: 'number',
      col: 3,
      fieldDisplayOrder: 19,
    },
    {
      name: 'measureUnit',
      label: t('MEASUREMENT_TYPE_LABEL'),
      placeholder: t('MEASUREMENT_TYPE_PLACEHOLDER'),
      type: 'select',
      col: 3,
      fieldDisplayOrder: 20,
    },
    {
      name: 'length',
      label: t('LENGTH_LABEL'),
      placeholder: t('LENGTH_PLACEHOLDER'),
      type: 'number',
      col: 3,
      fieldDisplayOrder: 21,
    },
    {
      name: 'height',
      label: t('HEIGHT_LABEL'),
      placeholder: t('HEIGHT_PLACEHOLDER'),
      type: 'number',
      col: 3,
      fieldDisplayOrder: 22,
    },
    {
      name: 'width',
      label: t('WIDTH_LABEL'),
      placeholder: t('WIDTH_PLACEHOLDER'),
      type: 'number',
      col: 3,
      fieldDisplayOrder: 23,
    },
    {
      name: 'isActive',
      label: t('ACTIVE_LABEL'),
      type: 'checkbox',
      col: 3,
      fieldDisplayOrder: 24,
    },
    {
      name: 'isBuyable',
      label: t('BUYABLE_LABEL'),
      type: 'checkbox',
      col: 3,
      fieldDisplayOrder: 25,
    },
    {
      name: 'synced',
      label: t('SYNCED_LABEL'),
      type: 'checkbox',
      col: 3,
      fieldDisplayOrder: 26,
    },
    {
      name: 'trackInventory',
      label: t('TRACK_LABEL'),
      type: 'checkbox',
      col: 3,
      fieldDisplayOrder: 27,
    },
  ];
  //Form fields validation schema
  const validationSchema = Yup.object({
    mainProductId: Yup.string().nullable(),
    name: Yup.string()
      .min(3, t('ERR_NAME_MIN', { length: 3 }))
      .max(100, t('ERR_NAME_MAX', { length: 100 }))
      .trim()
      .matches(appRegx.StartWithCharAllowSpaceBackSlashForwardSlashDash, t('ERR_NAME_REGX'))
      .required(t('ERR_NAME_REQUIRED')),
    code: Yup.string().required(t('ERR_CODE_REQUIRED')),
    priority: Yup.number().required(t('ERR_PRIORITY_REQUIRED')),
    catalogId: Yup.string().required(t('ERR_CATALOG_REQUIRED')),
    categoryId: Yup.string().required(t('ERR_CATEGORY_REQUIRED')),
    taxType: Yup.string().required(t('ERR_TAX_REQUIRED')),
    vendor: Yup.string().required(t('ERR_VENDOR_REQUIRED')),
    minQuantity: Yup.number().integer().required(t('ERR_MIN_REQUIRED')),
    maxQuantity: Yup.number()
      .integer()
      .required(t('ERR_MAX_REQUIRED'))
      .min(Yup.ref('minQuantity'), t('ERR_MAX_MORE_THAN_MIN')),
    size: Yup.string().required(t('ERR_SIZE_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      name: '',
      code: '',
      priority: '',
      catalogId: '',
      categoryId: '',
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
    if (formValues['numberOfPieces']) {
      const selectedProp = { ...product?.properties?.find(x => x.name === 'numberOfPieces') };
      if (selectedProp && selectedProp.id && formValues['numberOfPieces']) {
        selectedProp.values = [
          {
            propertyName: selectedProp.name,
            propertyId: selectedProp.id,
            value: formValues['numberOfPieces'],
            valueType: selectedProp.valueType,
            propertyMultivalue: selectedProp.multivalue,
          },
        ];
        (formValues?.properties || []).splice(
          formValues?.properties?.findIndex(x => x.name === 'numberOfPieces') || 0,
          1,
          selectedProp,
        );
      }
    }
    if (formValues['size']) {
      const selectedProp = { ...product?.properties?.find(x => x.name === 'size') };
      if (selectedProp && selectedProp.id && formValues['size']) {
        selectedProp.values = [
          {
            propertyName: selectedProp.name,
            propertyId: selectedProp.id,
            value: formValues['size'],
            valueType: selectedProp.valueType,
            propertyMultivalue: selectedProp.multivalue,
          },
        ];
        (formValues?.properties || []).splice(
          formValues?.properties?.findIndex(x => x.name === 'size') || 0,
          1,
          selectedProp,
        );
      }
    }
    if (formValues['enoughFor']) {
      const selectedProp = { ...product?.properties?.find(x => x.name === 'enoughFor') };
      if (selectedProp && selectedProp.id && formValues['enoughFor']) {
        selectedProp.values = [
          {
            propertyName: selectedProp.name,
            propertyId: selectedProp.id,
            value: formValues['enoughFor'],
            valueType: selectedProp.valueType,
            propertyMultivalue: selectedProp.multivalue,
          },
        ];
        (formValues?.properties || []).splice(
          formValues?.properties?.findIndex(x => x.name === 'enoughFor') || 0,
          1,
          selectedProp,
        );
      }
    }
    if (formValues['ingredients']) {
      const selectedProp = { ...ingredientsDP?.property };
      if (selectedProp && selectedProp.id && formValues['ingredients']) {
        const selectedValues = [
          ...(ingredientsDP?.propertyValues?.filter(prop => formValues['ingredients'].includes(prop.id)) || []),
        ];

        selectedProp.values = selectedValues.map(value => ({
          valueId: value.id,
        }));

        (formValues?.properties || []).splice(
          formValues?.properties?.findIndex(x => x.name === 'ingredients') || 0,
          1,
          selectedProp,
        );
      }
    }

    const updatedObj = {
      ...Utils.removeObjectKeys(formValues, ['numberOfPieces', 'size', 'enoughFor', 'ingredients']),
      modifiedBy: session?.user.userName,
    };

    if (mode === 'new') {
      create({
        ...product,
        ...updatedObj,
        createdBy: session?.user.userName,
        modifiedBy: session?.user.userName,
      });
    }
    if (mode === 'edit')
      updateData({
        ...product,
        ...updatedObj,
        modifiedBy: session?.user.userName,
      });
  };

  const loadData = useCallback(async () => {
    const modifiedProduct = { ...product };

    const enoughForProp = modifiedProduct.properties?.find(dp => dp.name === 'enoughFor');
    const ingredientsProp = modifiedProduct.properties?.find(dp => dp.name === 'ingredients');
    const numberOfPiecesProp = modifiedProduct.properties?.find(dp => dp.name === 'numberOfPieces');
    const sizeProp = modifiedProduct.properties?.find(dp => dp.name === 'size');

    let extraFormValues = {};
    if (ingredientsProp && ingredientsProp.values && ingredientsProp.values.length > 0) {
      extraFormValues = { ...extraFormValues, ingredients: _.flatMap(ingredientsProp.values, x => x.valueId) };
    }
    if (enoughForProp && enoughForProp.values && enoughForProp.values.length > 0) {
      extraFormValues = { ...extraFormValues, enoughFor: enoughForProp.values[0].value };
    }
    if (numberOfPiecesProp && numberOfPiecesProp.values && numberOfPiecesProp.values.length > 0) {
      extraFormValues = { ...extraFormValues, numberOfPieces: numberOfPiecesProp.values[0].value };
    }
    if (sizeProp && sizeProp.values && sizeProp.values.length > 0) {
      extraFormValues = { ...extraFormValues, size: sizeProp.values[0].value };
    }

    if (modifiedProduct.mainProductId) {
      const conditionalFields = [...defaultFormFields];
      conditionalFields.find(x => x.name === 'catalogId')!.readOnly = true;
      conditionalFields.find(x => x.name === 'categoryId')!.readOnly = true;

      setFormFields([...conditionalFields.sort((a, b) => a.fieldDisplayOrder - b.fieldDisplayOrder)]);
      setTimeout(() => setValues({ ...modifiedProduct, ...extraFormValues }), 200);
    } else toggleCategorySelect(modifiedProduct.catalogId, { ...modifiedProduct, ...extraFormValues });
    setTimeout(() => {
      setLoadingStatus(DataLoadingStatus.done);
    }, 500);
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

  const loadIngredientsDictionary = useCallback(async (): Promise<Array<ILookupOption>> => {
    const ingredientsProperty = product.properties?.find(prop => prop.name === 'ingredients');
    if (ingredientsProperty)
      return apiClient
        .search<ISearchResponse<Array<ICatalogPropertiesAttribute>>>(
          endpoints.dynamicProperties.catalogDictionaryItems,
          {
            propertyIds: [ingredientsProperty?.id],
          },
        )
        .then(
          data => {
            if (data.results && data.results.length > 0) {
              const ingredients = data.results.filter(
                ingredient => ingredient.languageCode === locale || !ingredient.languageCode,
              );
              setIngredientsDP({
                property: ingredientsProperty,
                propertyValues: ingredients,
              });
              return Promise.resolve(
                ingredients.map(
                  (item: ICatalogPropertiesAttribute): ILookupOption => ({
                    value: item.id!,
                    label: item.alias,
                    meta: { property: ingredientsProperty, propertyValue: item },
                  }),
                ),
              );
            } else {
              setIngredientsDP({ property: ingredientsProperty });
              return Promise.resolve([]);
            }
          },
          err => {
            setIngredientsDP({ property: ingredientsProperty });
            toast.error(t('GENERIC_MSG'));
            return Promise.reject(err);
          },
        );
    else return Promise.resolve([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'categoryId')!.options = [...data.categories];
        defaultFormFields.find(x => x.name === 'catalogId')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.catalogs,
        ];
        defaultFormFields.find(x => x.name === 'vendor')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.vendors,
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

        if (mode === 'new') {
          setFormFields(
            defaultFormFields
              .filter(x => x.name != 'categoryId')
              .sort((a, b) => a.fieldDisplayOrder - b.fieldDisplayOrder),
          );
          setTimeout(() => {
            setValues(initialValues);
            setLoadingStatus(DataLoadingStatus.done);
          }, 300);
        }
        if (mode === 'edit') {
          if (product.properties && product.properties.length > 0) {
            loadIngredientsDictionary().then(dictionaryItems => {
              defaultFormFields.find(x => x.name === 'ingredients')!.options = [
                { value: '', label: t('DEFAULT_OPTION') },
                ...dictionaryItems,
              ];
              loadData();
            });
          } else loadData();
        }
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
export default ProductDetailsForm;

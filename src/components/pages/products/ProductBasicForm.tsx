'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import * as Yup from 'yup';

import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import { Utils } from '@helpers/utils';
import { useAPIAuthClient, useLookup, useToast, useTranslate } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { endpoints, catalogLookup, categoriesLookup, productTax, vendorsLookup } from '@app/libs';
import { IProductItem, ISEOInfo } from '@app/types';
import { DefaultLangCode, DefaultProductDescriptionType } from '@helpers/constants';

interface IProductBasicFormProps {
  id: string | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const ProductBasicForm = (props: IProductBasicFormProps) => {
  const { mode, id, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_ProductBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([catalogLookup, categoriesLookup, vendorsLookup, productTax]);
  const today = new Date();
  const { data: session } = useSession();

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
      options: { enableTime: true, altInput: true, altFormat: 'F j, Y H:i' },
      col: 6,
      fieldDisplayOrder: 10,
    },
    {
      name: 'catalogId',
      label: t('PRO_CATALOG_LABEL'),
      type: 'select',
      onSelectChange: onCatalogSelect,
      col: 6,
      fieldDisplayOrder: 11,
    },
    {
      name: 'categoryId',
      label: t('PRO_CATEGORY_LABEL'),
      type: 'select',
      col: 6,
      fieldDisplayOrder: 12,
    },
    {
      name: 'isActive',
      label: t('ACTIVE_LABEL'),
      type: 'checkbox',
      col: 3,
      fieldDisplayOrder: 13,
    },
    {
      name: 'isBuyable',
      label: t('BUYABLE_LABEL'),
      type: 'checkbox',
      col: 3,
      fieldDisplayOrder: 14,
    },
    {
      name: 'synced',
      label: t('SYNCED_LABEL'),
      type: 'checkbox',
      col: 3,
      fieldDisplayOrder: 15,
    },
    {
      name: 'trackInventory',
      label: t('TRACK_LABEL'),
      type: 'checkbox',
      col: 3,
      fieldDisplayOrder: 16,
    },
    {
      name: 'content',
      label: t('DESCRIPTION'),
      placeholder: t('DESCRIPTION_PLACEHOLDER'),
      type: 'textarea',
      fieldDisplayOrder: 17,
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
    catalogId: Yup.string().required(t('ERR_CATALOG_REQUIRED')),
    categoryId: Yup.string().required(t('ERR_CATEGORY_REQUIRED')),
    taxType: Yup.string().required(t('ERR_TAX_REQUIRED')),
    minQuantity: Yup.number().integer().required(t('ERR_MIN_REQUIRED')),
    maxQuantity: Yup.number()
      .integer()
      .required(t('ERR_MAX_REQUIRED'))
      .min(Yup.ref('minQuantity'), t('ERR_MAX_MORE_THAN_MIN')),
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
      code: `${Utils.generateCode(3, true).toUpperCase()}-${new Date().getTime()}`,
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
      content: '',
    };
  }, []);

  const onFormSubmit = formValues => {
    if (mode === 'new') {
      const { content, ...otherValues } = formValues;
      create({
        ...otherValues,
        reviews: content
          ? [{ content: content, languageCode: DefaultLangCode, reviewType: DefaultProductDescriptionType }]
          : undefined,
        createdBy: session?.user.userName,
        modifiedBy: session?.user.userName,
      });
    }
    if (mode === 'edit')
      updateData({
        ...formValues,
        id,
        reviews: [
          {
            content: formValues.content,
            languageCode: formValues.languageCode ?? DefaultLangCode,
            reviewType: formValues.reviewType ?? DefaultProductDescriptionType,
          },
        ],
        modifiedBy: session?.user.userName,
      });
  };

  const loadData = useCallback(async () => {
    apiClient.select<IProductItem>(endpoints.products.details, { urlParams: { id } }).then(
      data => {
        const descriptionData = data;
        descriptionData.content =
          descriptionData.reviews && descriptionData.reviews[0] ? descriptionData.reviews[0].content : '';

        if (descriptionData.mainProductId) {
          const conditionalFields = [...defaultFormFields];
          conditionalFields.find(x => x.name === 'catalogId')!.readOnly = true;
          conditionalFields.find(x => x.name === 'categoryId')!.readOnly = true;
          setFormFields([...conditionalFields.sort((a, b) => a.fieldDisplayOrder - b.fieldDisplayOrder)]);
          setTimeout(() => setValues({ ...descriptionData }), 200);
        } else toggleCategorySelect(descriptionData.catalogId, { ...descriptionData });

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
    const newSEOInfos: Array<ISEOInfo> = [
      {
        name: value.name.replace(' ', '-'),
        semanticUrl: value.name.replace(' ', '-'),
        languageCode: DefaultLangCode,
        metaDescription: `${value.name},${value.name}`,
        imageAltDescription: '',
        metaKeywords: `${value.name},${value.name}`,
        isActive: true,
      },
    ];
    setIsLoading(true);
    apiClient.create<IProductItem>(endpoints.products.create, { ...value, seoInfos: newSEOInfos }).then(
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
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'categoryId')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.categories,
        ];
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
          loadData();
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
export default ProductBasicForm;

'use client';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useLookup, useToast, useTranslate } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { endpoints, catalogLookup, categoriesLookup, taxType } from '@app/libs';
import { ICategoryItem } from '@app/types';
import { Utils } from '@helpers/utils';
import { useSession } from 'next-auth/react';
interface ICategoryBasicFormProps {
  id: string | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const CategoryBasicForm = (props: ICategoryBasicFormProps) => {
  const { mode, id, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_CategoryBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([catalogLookup, categoriesLookup, taxType]);
  const { data: session } = useSession();

  const onCatalogSelect = (name, selectedOption, meta, values) => {
    if (selectedOption && selectedOption.value && selectedOption.value != '') {
      toggleCategorySelect(selectedOption.value, { ...values, parentId: '' });
    }
  };

  const toggleCategorySelect = useCallback((catalogId: string, data?: ICategoryItem) => {
    let filteredCategories = [
      ...(defaultFormFields
        .find(x => x.name === 'parentId')!
        .options.filter(x => x.meta && x.meta.catalogId === catalogId) || []),
    ];

    if (filteredCategories && filteredCategories.length > 0) {
      let newFormFields = { ...defaultFormFields!.find(x => x.name === 'parentId') } as FormFieldType;
      newFormFields.options = [{ value: '', label: t('DEFAULT_OPTION') }, ...filteredCategories];
      setFormFields([...defaultFormFields.filter(x => x.name != 'parentId'), newFormFields]);
    } else setFormFields(defaultFormFields.filter(x => x.name != 'parentId'));
    if (data) setValues({ ...data, catalogId, parentId: data.parentId });
  }, []);

  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'name',
      label: t('NAME_LABEL'),
      placeholder: t('NAME_PLACEHOLDER'),
      type: 'text',
    },

    {
      name: 'code',
      label: t('CODE_LABEL'),
      placeholder: t('CODE_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'outerId',
      label: t('OUTERID_LABEL'),
      placeholder: t('OUTERID_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'priority',
      label: t('PREIORTY_LABEL'),
      placeholder: t('PREIORTY_PLACEHOLDER'),
      type: 'number',
      col: 6,
    },
    {
      name: 'taxType',
      label: t('TAXTYPE_LABEL'),
      type: 'select',
      col: 6,
    },
    {
      name: 'synced',
      label: t('SYNCED_LABEL'),
      type: 'checkbox',
      col: 6,
    },

    {
      name: 'isActive',
      label: t('ACTIVE_LABEL'),
      type: 'checkbox',
      col: 6,
    },
    {
      name: 'catalogId',
      label: t('CATALOG_LABEL'),
      type: 'select',
      onSelectChange: onCatalogSelect,
      col: 6,
    },
    {
      name: 'parentId',
      label: t('PARENT_LABEL'),
      type: 'select',
      col: 6,
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
    code: Yup.string().required(t('ERR_CODE_REQUIRED')),
    catalogId: Yup.string().required(t('ERR_CATALOGID_REQUIRED')),
    priority: Yup.string().required(t('ERR_PRIORTY_REQUIRED')),
    taxType: Yup.string().required(t('ERR_TAXTYPE_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      name: '',
      code: '',
      catalogId: '',
      parentId: '',
      priority: '',
      isActive: true,
      taxType: '',
      synced: false,
      outerId: '',
    };
  }, []);
  const onFormSubmit = formValues => {
    if (formValues.parentId === '') {
      formValues = Utils.withoutProperty(formValues, 'parentId');
    }
    if (mode === 'new')
      create({ ...formValues, createdBy: session?.user.userName, modifiedBy: session?.user.userName });
    if (mode === 'edit') updateData({ ...formValues, id, modifiedBy: session?.user.userName });
  };
  const loadData = useCallback(async () => {
    apiClient.select<ICategoryItem>(endpoints.categories.details, { urlParams: { id } }).then(
      data => {
        toggleCategorySelect(data.catalogId, { ...data });
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
  const updateData = useCallback(async (value: ICategoryItem) => {
    setIsLoading(true);
    apiClient.create<ICategoryItem>(endpoints.categories.update, value).then(
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
  const create = useCallback(async (value: ICategoryItem) => {
    setIsLoading(true);
    apiClient.create<ICategoryItem>(endpoints.categories.create, value).then(
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
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'catalogId')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.catalogs,
        ];
        defaultFormFields.find(x => x.name === 'taxType')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.taxType,
        ];
        defaultFormFields.find(x => x.name === 'parentId')!.options =
          mode === 'edit' ? [...data.categories.filter(category => category.value != id)] : [...data.categories];
        if (mode === 'new') {
          setFormFields(defaultFormFields.filter(x => x.name != 'parentId'));
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

export default CategoryBasicForm;

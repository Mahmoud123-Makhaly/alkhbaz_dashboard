'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useToast, useTranslate, useLookup } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { endpoints, languagesLookup } from '@app/libs';
import { ICatalogItem } from '@app/types';
import { useSession } from 'next-auth/react';

interface ICatalogBasicFormProps {
  id: string | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const CatalogBasicForm = (props: ICatalogBasicFormProps) => {
  const { mode, id, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const t = useTranslate('COMP_CatalogBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([languagesLookup]);
  const { data: session } = useSession();

  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'name',
      label: t('NAME_LABEL'),
      placeholder: t('NAME_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'languages',
      label: t('LANGUAGES_LABEL'),
      type: 'select',
      isMulti: true,
      placeholder: t('LANGUAGE_PLACEHOLDER'),
      col: 12,
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
    languages: Yup.array().min(1, t('ERR_LANGUAGES_MIN')).required(t('ERR_LANGUAGES_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      name: '',
      code: '',
      languages: '',
    };
  }, []);

  const onFormSubmit = formValues => {
    const languages = formFields
      ?.find(x => x.name === 'languages')!
      .options.filter(x => formValues.languages.includes(x.value))
      .map((item, index) => {
        return {
          priority: index + 1,
          isDefault: true,
          languageCode: item.label,
        };
      });

    if (mode === 'new')
      create({
        ...formValues,
        languages,
        createdBy: session?.user.userName,
        modifiedBy: session?.user.userName,
      });
    if (mode === 'edit')
      updateData({
        ...formValues,
        id,
        languages,
        modifiedBy: session?.user.userName,
      });
  };

  const loadData = useCallback(async () => {
    apiClient.select<ICatalogItem>(endpoints.catalogs.details, { urlParams: { id } }).then(
      data => {
        const manipulatedData = data;
        manipulatedData.languages = data.languages.map(item => item.languageCode);
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

  const updateData = useCallback(async (value: ICatalogItem) => {
    setIsLoading(true);
    apiClient.update<ICatalogItem>(endpoints.catalogs.update, value).then(
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

  const create = useCallback(async (value: ICatalogItem) => {
    setIsLoading(true);
    apiClient.create<ICatalogItem>(endpoints.catalogs.update, value).then(
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
      if (mode === 'edit') loadData();
    }
  }, [formFields, initialValues, loadData, mode]);
  useEffect(() => {
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'languages')!.options = [...data.languages];
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
export default CatalogBasicForm;

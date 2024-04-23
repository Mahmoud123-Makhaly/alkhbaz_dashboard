'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

import { useAPIAuthClient, useToast, useTranslate } from '@app/hooks';
import { endpoints } from '@app/libs';
import { IDictionaryItem, IDictionaryItemLocalizedValue } from '@app/types';
import { Utils } from '@helpers/utils';

interface IIngredientBasicFormProps {
  propertyId: string;
  data: IDictionaryItem | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const IngredientBasicForm = (props: IIngredientBasicFormProps) => {
  const { mode, data, propertyId, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const t = useTranslate('COMP_IngredientBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();

  //Form fields
  const defaultFormFields = useCallback((): Array<FormFieldType> => {
    let fields: Array<FormFieldType> = [
      {
        name: 'alias',
        label: t('ALIAS_LABEL'),
        placeholder: t('ALIAS_PLACEHOLDER'),
        type: 'text',
      },
      {
        name: 'sortOrder',
        label: t('SORT_ORDER_LABEL'),
        placeholder: t('SORT_ORDER_PLACEHOLDER'),
        type: 'number',
      },
    ];

    if (data?.localizedValues && data.localizedValues?.length > 0) {
      data.localizedValues.forEach(val => {
        fields.push({
          name: `alias-${val.languageCode}`,
          label: t('LABEL_LANG', { code: val.languageCode }),
          placeholder: t('LABEL_LANG_PLACEHOLDER', { code: val.languageCode }),
          type: 'text',
        });
      });
    }

    return fields;
  }, [data?.localizedValues, t]);

  //Form fields validation schema
  const validationSchema = Yup.object().shape({
    alias: Yup.string().required(t('ERR_ALIAS_REQUIRED')),
    sortOrder: Yup.string().required(t('ERR_SORT_ORDER_REQUIRED')),
    ..._.flatMap(
      defaultFormFields().filter(x => x.name.startsWith('alias-')),
      x => x.name,
    ).reduce((obj, k) => {
      obj[k] = Yup.string().required(t(`ERR_LABEL_REQUIRED`, { name: k }));
      return obj;
    }, {}),
  });

  const onFormSubmit = formValues => {
    const newObj = { ..._.pick(formValues, _.keys(data)), propertyId };

    const localizedValues = Object.keys(formValues)
      .map(k => {
        if (k.startsWith('alias-')) {
          return {
            languageCode: k.substring('alias-'.length),
            value: formValues[k],
          };
        }
        return false;
      })
      .filter(x => x) as Array<IDictionaryItemLocalizedValue>;

    if (mode === 'new')
      create([
        {
          ...(Utils.withoutProperty(newObj, 'id') as IDictionaryItem),
          localizedValues,
        },
      ]);
    if (mode === 'edit')
      updateData([
        {
          ...(newObj as IDictionaryItem),
          localizedValues,
        },
      ]);
  };

  const loadData = useCallback(async () => {
    if (data) {
      const modifiedData = Object.keys(data || {}).reduce((obj, k) => {
        if (k != 'localizedValues') {
          obj[k] = data[k];
          return obj;
        } else {
          return {
            ...obj,
            ..._.flatMap(data[k], x => x).reduce((innerObj, k) => {
              innerObj[`alias-${k.languageCode}`] = k.value;
              return innerObj;
            }, {}),
          };
        }
      }, {});
      setValues(modifiedData);
      setLoadingStatus(DataLoadingStatus.done);
    } else onCancel();
  }, []);

  const updateData = useCallback(async (value: Array<IDictionaryItem>) => {
    setIsLoading(true);
    apiClient.create(endpoints.dictionaries.ingredients.edit, value).then(
      data => {
        if (data && data.status === 200) {
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
        if (err.includes('500')) {
          toast.error(t('ERR_INGREDIENT_EXISTS'));
        } else toast.error(err.toString());
        setIsLoading(false);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = useCallback(async (value: Array<IDictionaryItem>) => {
    setIsLoading(true);
    apiClient.create(endpoints.dictionaries.ingredients.add, value).then(
      data => {
        if (data && data.status === 200) {
          setTimeout(() => {
            setIsLoading(false);
            toast.success(t('CREATE_SUCCESS', { name: value[0].alias }));
            onSubmit();
          }, 300);
        } else {
          setIsLoading(false);
          toast.error(t('ERR_CREATE_GENERIC_MSG'));
        }
      },
      err => {
        if (err.includes('500')) {
          toast.error(t('ERR_INGREDIENT_EXISTS'));
        } else toast.error(err.toString());
        setIsLoading(false);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formFields) loadData();
  }, [formFields, loadData]);

  useEffect(() => {
    setFormFields(defaultFormFields());
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
export default IngredientBasicForm;

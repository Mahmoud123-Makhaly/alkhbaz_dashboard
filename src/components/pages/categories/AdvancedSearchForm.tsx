'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import { useEffect, useMemo, useState } from 'react';
import { useLookup, useToast, useTranslate } from '@app/hooks';
import { catalogLookup, storesLookup } from '@app/libs';
import { FormikHelpers, FormikValues } from 'formik';
interface ICategoryAdvancedSearchFormProps {
  initialValues?: any;
  onCancel: () => void;
  onSubmit: (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>) => void | Promise<any>;
}

const CategoryAdvancedSearchForm = (props: ICategoryAdvancedSearchFormProps) => {
  const { initialValues, onCancel, onSubmit } = props;
  const [filterCriteria, setFilterCriteria] = useState<{
    loadingStatus?: DataLoadingStatus;
    fields?: Array<FormFieldType> | null;
    values?: any;
  }>();
  const t = useTranslate('COMP_CategoryAdvancedSearchForm');
  const toast = useToast();
  const lookup = useLookup([catalogLookup, storesLookup]);
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'searchPhrase',
      label: t('KEYWORD_LABEL'),
      placeholder: t('KEYWORD_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'catalogIds',
      label: t('CATALOG_LABEL'),
      type: 'select',
      placeholder: t('DEFAULT_OPTION'),
      isMulti: true,
    },
    {
      name: 'storeId',
      label: t('STORE_LABEL'),
      type: 'select',
    },
  ];

  //Form fields initial values
  const resetValues = useMemo(() => {
    return (
      initialValues || {
        searchPhrase: '',
        catalogIds: '',
        storeId: '',
      }
    );
  }, []);

  useEffect(() => {
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'catalogIds')!.options = [...data.catalogs];
        defaultFormFields.find(x => x.name === 'storeId')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.stores,
        ];
        setFilterCriteria({ loadingStatus: DataLoadingStatus.done, fields: defaultFormFields, values: resetValues });
      },
      err => {
        toast.error(t('ERR_GENERIC_MSG'));
        onCancel();
      },
    );
  }, []);

  return (
    <Card className="shadow-none">
      <CardBody>
        <DataLoader status={filterCriteria?.loadingStatus}>
          {filterCriteria?.fields && (
            <FormControl
              initialValues={filterCriteria.values}
              validationSchema={null}
              onSubmit={onSubmit}
              fields={filterCriteria.fields}
              onCancel={onCancel}
              submitLabel={t('SUBMIT_BTN_LABEL')}
              cancelLabel={t('CANCEL_BTN_LABEL')}
            />
          )}
        </DataLoader>
      </CardBody>
    </Card>
  );
};
export default CategoryAdvancedSearchForm;

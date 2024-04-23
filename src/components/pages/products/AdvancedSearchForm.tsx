'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import { useEffect, useMemo, useState } from 'react';
import { useLookup, useToast, useTranslate } from '@app/hooks';
import { currencyLookup, storesLookup, priceListLookup, catalogLookup } from '@app/libs';
import { FormikHelpers, FormikValues } from 'formik';
interface IProductAdvancedSearchFormProps {
  initialValues?: any;
  onCancel: () => void;
  onSubmit: (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>) => void | Promise<any>;
}

const ProductAdvancedSearchForm = (props: IProductAdvancedSearchFormProps) => {
  const { initialValues, onCancel, onSubmit } = props;
  const [filterCriteria, setFilterCriteria] = useState<{
    loadingStatus?: DataLoadingStatus;
    fields?: Array<FormFieldType> | null;
    values?: any;
  }>();
  const t = useTranslate('COMP_ProductAdvancedSearchForm');
  const toast = useToast();
  const lookup = useLookup([currencyLookup, storesLookup, priceListLookup, catalogLookup]);
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'searchPhrase',
      label: t('KEYWORD_LABEL'),
      placeholder: t('KEYWORD_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'currency',
      label: t('CURRENCY_LABEL'),
      type: 'select',
      placeholder: t('DEFAULT_OPTION'),
    },
    {
      name: 'pricelists',
      label: t('PRICE_LABEL'),
      type: 'select',
      isMulti: true,
    },
    {
      name: 'storeId',
      label: t('STORE_LABEL'),
      type: 'select',
      placeholder: t('DEFAULT_OPTION'),
    },
    {
      name: 'catalogIds',
      label: t('CATALOG_LABEL'),
      type: 'select',
      isMulti: true,
    },
    {
      name: 'startDate',
      label: t('START_LABEL'),
      type: 'date',
      options: { altInput: true, altFormat: 'F j, Y ' },
    },
    {
      name: 'endDate',
      label: t('END_LABEL'),
      type: 'date',
      options: { altInput: true, altFormat: 'F j, Y ' },
    },
  ];

  //Form fields initial values
  const resetValues = useMemo(() => {
    return (
      initialValues || {
        searchPhrase: '',
        currency: '',
        pricelists: '',
        storeId: '',
        catalogIds: '',
        startDate: '',
        endDate: '',
      }
    );
  }, []);

  useEffect(() => {
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'currency')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.currency,
        ];
        defaultFormFields.find(x => x.name === 'catalogIds')!.options = [...data.catalogs];
        defaultFormFields.find(x => x.name === 'storeId')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.stores,
        ];
        defaultFormFields.find(x => x.name === 'pricelists')!.options = [...data.priceList];
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
export default ProductAdvancedSearchForm;

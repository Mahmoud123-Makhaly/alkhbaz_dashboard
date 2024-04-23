'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import { useEffect, useMemo, useState } from 'react';
import { useLookup, useToast, useTranslate } from '@app/hooks';
import { orderLookup, warehousesLookup, customerSecurityLookup, orderStatuses } from '@app/libs';
import { FormikHelpers, FormikValues } from 'formik';
interface IOrderAdvancedSearchFormProps {
  initialValues?: any;
  onCancel: () => void;
  onSubmit: (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>) => void | Promise<any>;
}

const OrderAdvancedSearchForm = (props: IOrderAdvancedSearchFormProps) => {
  const { initialValues, onCancel, onSubmit } = props;
  const [filterCriteria, setFilterCriteria] = useState<{
    loadingStatus?: DataLoadingStatus;
    fields?: Array<FormFieldType> | null;
    values?: any;
  }>();
  const t = useTranslate('COMP_OrderAdvancedSearchForm');
  const toast = useToast();
  const lookup = useLookup([ warehousesLookup, orderStatuses]);
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'keyword',
      label: t('KEYWORD_LABEL'),
      placeholder: t('KEYWORD_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'customerMobile',
      label: t('CUSTOMER_MOBILE_LABEL'),
      placeholder: t('CUSTOMER_MOBILE_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'fulfillmentCenterIds',
      label: t('FULFILLMENT_CENTERS_LABEL'),
      type: 'select',
      placeholder: t('DEFAULT_OPTION'),
      isMulti: true,
    },
    {
      name: 'statuses',
      label: t('STATUS_LABEL'),
      type: 'select',
      placeholder: t('DEFAULT_OPTION'),
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
        keyword: '',
        customerMobile: '',
        fulfillmentCenterIds: '',
        statuses: '',
        startDate: null,
        endDate: null,
      }
    );
  }, []);

  useEffect(() => {
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'fulfillmentCenterIds')!.options = [...data.warehouses];
        defaultFormFields.find(x => x.name === 'statuses')!.options = [...data.orderStatuses];
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
export default OrderAdvancedSearchForm;

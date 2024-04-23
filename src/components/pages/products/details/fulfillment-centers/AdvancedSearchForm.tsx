'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import { useEffect, useMemo, useState } from 'react';
import { useToast, useTranslate } from '@app/hooks';
import { FormikHelpers, FormikValues } from 'formik';
interface IProductFulfillmentCenterAdvancedSearchFormProps {
  initialValues?: any;
  onCancel: () => void;
  onSubmit: (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>) => void | Promise<any>;
}

const IProductFulfillmentCenterAdvancedSearchForm = (props: IProductFulfillmentCenterAdvancedSearchFormProps) => {
  const { initialValues, onCancel, onSubmit } = props;
  const [filterCriteria, setFilterCriteria] = useState<{
    loadingStatus?: DataLoadingStatus;
    fields?: Array<FormFieldType> | null;
    values?: any;
  }>();
  const t = useTranslate('COMP_ProductFulfillmentCenterAdvancedSearchForm');
  const toast = useToast();
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'keywords',
      label: t('KEYWORD_LABEL'),
      placeholder: t('KEYWORD_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'fulfillmentCenterName',
      label: t('FULFILLMENT_LABEL'),
      placeholder: t('FULFILLMENT_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'inStockQuantity',
      label: t('STOCK_LABEL'),
      type: 'number',
      placeholder: t('STOCK_PLACEHOLDER'),
    },
    {
      name: 'reservedQuantity',
      label: t('RESERVED_LABEL'),
      placeholder: t('RESERVED_PLACEHOLDER'),
      type: 'number',
    },
  ];

  //Form fields initial values
  const resetValues = useMemo(() => {
    return (
      initialValues || {
        keywords: '',
        fulfillmentCenterName: '',
        inStockQuantity: '',
        reservedQuantity: '',
      }
    );
  }, []);

  useEffect(() => {
    setFilterCriteria({ loadingStatus: DataLoadingStatus.done, fields: defaultFormFields, values: resetValues });
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
export default IProductFulfillmentCenterAdvancedSearchForm;

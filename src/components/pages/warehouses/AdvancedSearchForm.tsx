'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import { useEffect, useMemo, useState } from 'react';
import { useLookup, useToast, useTranslate } from '@app/hooks';
import { FormikHelpers, FormikValues } from 'formik';
import { warehousesOuterIdLookup } from '@app/libs';

interface IWarehousesAdvancedSearchFormProps {
  initialValues?: any;
  onCancel: () => void;
  onSubmit: (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>) => void | Promise<any>;
}

const WarehousesAdvancedSearchForm = (props: IWarehousesAdvancedSearchFormProps) => {
  const { initialValues, onCancel, onSubmit } = props;
  const [filterCriteria, setFilterCriteria] = useState<{
    loadingStatus?: DataLoadingStatus;
    fields?: Array<FormFieldType> | null;
    values?: any;
  }>();
  const t = useTranslate('COMP_WarehousesAdvancedSearchForm');
  const toast = useToast();
  const lookup = useLookup([warehousesOuterIdLookup]);
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'searchPhrase',
      label: t('KEYWORD_LABEL'),
      placeholder: t('KEYWORD_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'outerId',
      label: t('OUTERID_LABEL'),
      placeholder: t('OUTERID_PLACEHOLDER'),
      type: 'select',
    },
  ];

  //Form fields initial values
  const resetValues = useMemo(() => {
    return (
      initialValues || {
        searchPhrase: '',
        outerId: '',
        objectType: '',
      }
    );
  }, []);

  useEffect(() => {
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'outerId')!.options = [...data.warehouseOuterId];
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
export default WarehousesAdvancedSearchForm;

'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useLookup, useToast, useTranslate } from '@app/hooks';
import { endpoints, warehousesLookup } from '@app/libs';
import { IProductFulfillmentCenter } from '@app/types';
import { useSession } from 'next-auth/react';

interface IProductFulfillmentCenterBasicFormProps {
  id: string | null;
  fulfillment: any;
  fulfillmentsData: any;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const FulfillmentCenterBasicForm = (props: IProductFulfillmentCenterBasicFormProps) => {
  const { mode, id, onCancel, onSubmit, fulfillment, fulfillmentsData } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_ProductFulfillmentCenterBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([warehousesLookup]);
  const today = new Date();
  const { data: session } = useSession();

  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'fulfillmentCenterId',
      label: t('FULFILLMENT_LABEL'),
      type: 'select',
    },
    {
      name: 'inStockQuantity',
      label: t('STOCK_LABEL'),
      placeholder: t('STOCK_PLACEHOLDER'),
      type: 'number',
      col: 4,
    },
    {
      name: 'reservedQuantity',
      label: t('RESERVED_LABEL'),
      placeholder: t('RESERVED_PLACEHOLDER'),
      type: 'number',
      col: 4,
    },
    {
      name: 'reorderMinQuantity',
      label: t('MIN_QUANTITY_LABEL'),
      placeholder: t('MIN_QUANTITY_PLACEHOLDER'),
      type: 'number',
      col: 4,
    },
    {
      name: 'allowPreorder',
      label: t('PRE_ORDER_LABEL'),
      type: 'checkbox',
    },
    {
      name: 'preorderQuantity',
      label: t('PRE_ORDER_QUANTITY_LABEL'),
      placeholder: t('PRE_ORDER_QUANTITY_PLACEHOLDER'),
      type: 'number',
      col: 6,
    },
    {
      name: 'preorderAvailabilityDate',
      label: t('PRE_ORDER_DATE_LABEL'),
      type: 'date',
      options: { minDate: today, enableTime: true, altInput: true, altFormat: 'F j, Y H:i' },
      col: 6,
    },
    {
      name: 'allowBackorder',
      label: t('BACK_ORDER_LABEL'),
      type: 'checkbox',
    },
    {
      name: 'backorderQuantity',
      label: t('BACK_ORDER_QUANTITY_LABEL'),
      placeholder: t('BACK_ORDER_QUANTITY_PLACEHOLDER'),
      type: 'number',
      col: 6,
    },
    {
      name: 'backorderAvailabilityDate',
      label: t('BACK_ORDER_DATE_LABEL'),
      type: 'date',
      options: { minDate: today, enableTime: true, altInput: true, altFormat: 'F j, Y H:i' },
      col: 6,
    },
  ];
  //Form fields validation schema
  const validationSchema = Yup.object({
    inStockQuantity: Yup.number().min(0, t('ERR_STOCK_REQUIRED')),
    reservedQuantity: Yup.number().min(0, t('ERR_RESERVED_REQUIRED')),
    reorderMinQuantity: Yup.number().integer().min(0, t('ERR_REORDER_REQUIRED')),
    fulfillmentCenterId: Yup.string().required(t('ERR_FULFILLMENT_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      fulfillmentCenterId: '',
      inStockQuantity: 0,
      reservedQuantity: 0,
      reorderMinQuantity: 0,
      allowPreorder: false,
      preorderQuantity: 0,
      preorderAvailabilityDate: null,
      allowBackorder: false,
      backorderQuantity: 0,
      backorderAvailabilityDate: null,
    };
  }, []);
  const onFormSubmit = formValues => {
    if (mode === 'new') {
      create({
        ...formValues,
        productId: id,
        createdBy: session?.user.userName!,
        modifiedBy: session?.user.userName!,
      });
    }
    if (mode === 'edit')
      updateData({
        ...formValues,
        modifiedBy: session?.user.userName!,
      });
  };
  const loadData = useCallback(async () => {
    setValues(fulfillment);
    setTimeout(() => {
      setLoadingStatus(DataLoadingStatus.done);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateData = useCallback(async (value: IProductFulfillmentCenter) => {
    setIsLoading(true);
    apiClient
      .update<IProductFulfillmentCenter>(endpoints.products.fulfillmentCenters, { ...value, urlParams: { id } })
      .then(
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

  const create = useCallback(async (value: IProductFulfillmentCenter) => {
    setIsLoading(true);
    apiClient
      .update<IProductFulfillmentCenter>(endpoints.products.fulfillmentCenters, { ...value, urlParams: { id } })
      .then(
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
    if (formFields) {
      if (mode === 'new') {
        setValues(initialValues);
        setLoadingStatus(DataLoadingStatus.done);
      }
      if (mode === 'edit') {
        loadData();
      }
    }
  }, [formFields, initialValues, loadData, mode]);

  useEffect(() => {
    lookup.load().then(
      data => {
        if (mode === 'edit') {
          defaultFormFields.find(x => x.name === 'fulfillmentCenterId')!.readOnly = true;
          defaultFormFields.find(x => x.name === 'fulfillmentCenterId')!.options = [
            ...data.warehouses.filter(item => item.value === fulfillment.fulfillmentCenterId),
          ];
        } else {
          defaultFormFields.find(x => x.name === 'fulfillmentCenterId')!.options = [
            { value: '', label: t('DEFAULT_OPTION') },
            ...data.warehouses.filter(
              item => !fulfillmentsData.some(dataItem => dataItem.fulfillmentCenterId === item.value),
            ),
          ];
        }
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
export default FulfillmentCenterBasicForm;

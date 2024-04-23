'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import * as Yup from 'yup';

import {
  ClientOnly,
  ConfirmationModal,
  DataLoader,
  DataLoadingStatus,
  FormControl,
  FormFieldType,
} from '@components/common';
import { useAPIAuthClient, useToast, useTranslate, useLookup } from '@app/hooks';
import { endpoints, storesLookup, orderStatuses, customerOrderDynamicProperties } from '@app/libs';
import { ILookupOption, IOrder, IProperties, IPropertiesAttribute } from '@app/types';
import { CustomerOrderStatus, ObjectTypes } from '@helpers/constants';
import { Utils } from '@helpers/utils';

interface IOrderBasicFormProps {
  id?: string | null;
  data?: IOrder | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const OrderBasicForm = (props: IOrderBasicFormProps) => {
  const { mode, id, data, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConflictModal, setShowConflictModal] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [orderSourceDP, setOrderSourceDP] = useState<{
    property?: IProperties;
    propertyValues?: Array<IPropertiesAttribute>;
  }>();
  const t = useTranslate('COMP_OrderBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([storesLookup, orderStatuses, customerOrderDynamicProperties]);
  const { data: session } = useSession();

  const cancelReasonField: FormFieldType = {
    name: 'cancelReason',
    label: 'Reason',
    placeholder: 'Enter cancel reason',
    type: 'textarea',
  };

  const onStatusChange = (name, selectedOption, meta, values) => {
    if (selectedOption && selectedOption.value && selectedOption.value === 'Cancelled') {
      setFormFields(() => [...defaultFormFields, cancelReasonField]);
    } else setFormFields(() => [...defaultFormFields]);
  };

  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'number',
      label: t('NUMBER_LABEL'),
      placeholder: t('NUMBER_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'isApproved',
      label: t('APPROVED_LABEL'),
      type: 'checkbox',
      col: 6,
    },
    {
      name: 'status',
      label: t('STATUS_LABEL'),
      type: 'select',
      placeholder: t('STATUS_PLACEHOLDER'),
      onSelectChange: onStatusChange,
      col: 6,
    },
    {
      name: 'storeId',
      label: t('STORE_LABEL'),
      type: 'select',
      placeholder: t('STORE_PLACEHOLDER'),
      col: 6,
    },
    {
      name: 'discountAmount',
      label: t('DISCOUNT_AMOUNT_LABEL'),
      placeholder: t('DISCOUNT_AMOUNT_PLACEHOLDER'),
      type: 'number',
      col: 6,
    },
    {
      name: 'total',
      label: t('TOTAL_LABEL'),
      readOnly: true,
      type: 'number',
      col: 6,
    },
    {
      name: 'orderSource',
      label: t('ORDER_SOURCE'),
      type: 'select',
    },
  ];

  //Form fields validation schema
  const validationSchema = Yup.object({
    number: Yup.string()
      .min(3, t('ERR_NUMBER_MIN', { length: 3 }))
      .max(20, t('ERR_NUMBER_MAX', { length: 20 }))
      .trim()
      .required(t('ERR_NUMBER_REQUIRED')),
    status: Yup.string().required(t('ERR_STATUS_REQUIRED')),
    storeId: Yup.string().required(t('ERR_STORE_REQUIRED')),
    discountAmount: Yup.number()
      .required(t('ERR_DISCOUNT_REQUIRED'))
      .test('is-decimal', t('ERR_DISCOUNT_DECIMAL'), value => /^(?:\d+|\d*\.\d{1,4})$/.test(value.toString()))
      .test('is-less-than-total', t('ERR_DISCOUNT_LESS_OR_EQUAL_TOTAL'), function (value) {
        const total: number = this.resolve(Yup.ref('total'));
        return value <= total;
      }),
  });

  const onFormSubmit = formValues => {
    if (mode === 'edit') {
      setIsLoading(true);
      const updatedObj = {
        ...Utils.withoutProperty(formValues, 'orderSource'),
        modifiedBy: session?.user.userName,
      };

      if (formValues['orderSource'] && orderSourceDP?.property) {
        const selectedPropValue = orderSourceDP?.propertyValues?.find(x => x.id === formValues['orderSource']);
        if (selectedPropValue) {
          const newOrderSourceDP = {
            ...orderSourceDP!.property,
            values: [{ value: selectedPropValue }],
          };
          (formValues?.dynamicProperties || []).splice(
            formValues?.dynamicProperties?.findIndex(x => x.name === 'orderSource') || 0,
            1,
            newOrderSourceDP,
          );
        }
      }

      if (formValues.discountAmount != values.discountAmount)
        recalculate({
          ...updatedObj,
        });
      else
        updateData({
          ...updatedObj,
        });
    }
  };

  const loadData = useCallback(async () => {
    apiClient.select<IOrder>(endpoints.orders.details, { urlParams: { id } }).then(
      data => {
        const orderSourceProp = data.dynamicProperties?.find(dp => dp.name === 'orderSource');
        if (orderSourceProp && orderSourceProp.values && orderSourceProp.values.length > 0) {
          setValues({ ...data, orderSource: orderSourceProp.values[0].valueId });
        } else setValues(data);
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

  const recalculate = useCallback(async (value: IOrder) => {
    apiClient.update<IOrder>(endpoints.orders.recalculate, value).then(
      data => {
        if (data) {
          updateData(data);
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

  const updateData = useCallback(async (value: IOrder) => {
    apiClient.update<IOrder>(endpoints.orders.update, value).then(
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
        setIsLoading(false);
        if (err.includes('409')) setShowConflictModal(true);
        else toast.error(err.toString());
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrderSourceDictionary = useCallback(async (property: IProperties): Promise<Array<ILookupOption>> => {
    return apiClient
      .select<IPropertiesAttribute>(endpoints.dynamicProperties.dictionaryItems, {
        urlParams: { propertyId: property.id, objectType: ObjectTypes.CustomerOrder },
      })
      .then(
        data => {
          if (data && data.length > 0) {
            setOrderSourceDP({ property, propertyValues: data });
            return Promise.resolve(
              data.map(
                (item: IPropertiesAttribute): ILookupOption => ({
                  value: item.id!,
                  label: item.name,
                  meta: { property, propertyValue: item },
                }),
              ),
            );
          } else {
            setOrderSourceDP({ property });
            return Promise.resolve([]);
          }
        },
        err => {
          setOrderSourceDP({ property });
          toast.error(t('GENERIC_MSG'));
          return Promise.reject(err);
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formFields) {
      if (mode === 'edit')
        if (data) {
          const orderSourceProp = data.dynamicProperties?.find(dp => dp.name === 'orderSource');
          if (orderSourceProp && orderSourceProp.values && orderSourceProp.values.length > 0) {
            setValues({ ...data, orderSource: orderSourceProp.values[0].valueId });
          } else setValues(data);
          setTimeout(() => {
            setLoadingStatus(DataLoadingStatus.done);
          }, 200);
        } else loadData();
    }
  }, [data, formFields, loadData, mode]);

  useEffect(() => {
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'status')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.orderStatuses,
        ];
        defaultFormFields.find(x => x.name === 'storeId')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.stores,
        ];
        if (
          data.customerOrderDynamicProperties &&
          data.customerOrderDynamicProperties.find(item => item.label === 'orderSource')
        ) {
          loadOrderSourceDictionary(
            data.customerOrderDynamicProperties.find(item => item.label === 'orderSource').meta,
          ).then(
            dictionaryItems => {
              defaultFormFields.find(x => x.name === 'orderSource')!.options = [
                { value: '', label: t('DEFAULT_OPTION') },
                ...dictionaryItems,
              ];
              setFormFields(() => [...defaultFormFields]);
            },
            err => {
              setLoadingStatus(DataLoadingStatus.done);
            },
          );
        } else setFormFields(() => [...defaultFormFields]);
      },
      err => {
        toast.error(t('ERR_CREATE_GENERIC_MSG'));
        onCancel();
      },
    );
  }, []);

  const reloadData = () => {
    if (data) onSubmit();
    else {
      setLoadingStatus(DataLoadingStatus.pending);
      loadData();
    }
    setShowConflictModal(false);
  };

  return (
    <ClientOnly>
      <ConfirmationModal
        show={showConflictModal}
        isLoading={false}
        header={t('CONFLICT_MODAL_HEADER')}
        msg={t('CONFLICT_MODAL_MSG')}
        submitBtnLabel={t('CONFLICT_MODAL_SUBMIT_BTN_LABEL')}
        iconClass="ri-alert-fill text-warning"
        onSubmit={reloadData}
        onCancel={() => setShowConflictModal(false)}
      />
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
    </ClientOnly>
  );
};
export default OrderBasicForm;

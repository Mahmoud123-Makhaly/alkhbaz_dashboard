'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useLookup, useToast, useTranslate } from '@app/hooks';
import { endpoints, priceListLookup } from '@app/libs';
import { useSession } from 'next-auth/react';
import { IAddProductPrice } from '@app/types';
interface IProductPriceListBasicFormProps {
  id: string | null;
  productId: string | null;
  priceListItem: any;
  priceListData: any;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const PriceListBasicForm = (props: IProductPriceListBasicFormProps) => {
  const { mode, id, onCancel, onSubmit, priceListItem, priceListData, productId } = props;
  const { data: session } = useSession();
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_ProductPriceListBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([priceListLookup]);
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'pricelistId',
      label: t('PRICE_LIST_LABEL'),
      type: 'select',
    },
    {
      name: 'list',
      label: t('LIST_LABEL'),
      placeholder: t('LIST_PLACEHOLDER'),
      type: 'number',
      col: 4,
    },
    {
      name: 'sale',
      label: t('SALE_LABEL'),
      placeholder: t('SALE_PLACEHOLDER'),
      type: 'number',
      col: 4,
    },
    {
      name: 'minQuantity',
      label: t('MIN_QUANTITY_LABEL'),
      placeholder: t('MIN_QUANTITY_PLACEHOLDER'),
      type: 'number',
      col: 4,
    },
  ];
  //Form fields validation schema
  const validationSchema = Yup.object({
    list: Yup.number().min(1, t('ERR_LIST_REQUIRED')),
    sale: Yup.number().min(1, t('ERR_SALE_REQUIRED')).max(Yup.ref('list'), t('ERR_SALE_LESS_THAN_LIST')),
    minQuantity: Yup.number().integer().min(1, t('ERR_MIN_QUANTITY_REQUIRED')),
    pricelistId: Yup.string().required(t('ERR_PRICE_LIST_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      pricelistId: '',
      list: 0,
      sale: 0,
      minQuantity: 0,
    };
  }, []);
  const onFormSubmit = formValues => {
    if (mode === 'new') {
      create({
        ...formValues,
        productId: productId,
        prices: [
          {
            sale: formValues.sale,
            minQuantity: formValues.minQuantity,
            list: formValues.list,
            pricelistId: formValues.pricelistId,
            productId: productId,
          },
        ],
        createdBy: session?.user.userName,
        modifiedBy: session?.user.userName,
      });
    }
    if (mode === 'edit')
      updateData({
        ...formValues,
        productId: productId,
        prices: [
          {
            sale: formValues.sale,
            minQuantity: formValues.minQuantity,
            list: formValues.list,
            pricelistId: formValues.pricelistId,
            productId: productId,
          },
        ],
        modifiedBy: session?.user.userName,
      });
  };
  const loadData = useCallback(async () => {
    setValues(priceListItem);
    setTimeout(() => {
      setLoadingStatus(DataLoadingStatus.done);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateData = useCallback(async (value: IAddProductPrice) => {
    setIsLoading(true);
    apiClient
      .update<IAddProductPrice>(endpoints.products.createProductPrice, { ...value, urlParams: { productId } })
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

  const create = useCallback(async (value: IAddProductPrice) => {
    setIsLoading(true);
    apiClient
      .update<IAddProductPrice>(endpoints.products.createProductPrice, { ...value, urlParams: { productId } })
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
          //defaultFormFields.find(x => x.name === 'pricelistId')!.readOnly = true;
          defaultFormFields.find(x => x.name === 'pricelistId')!.options = [
            ...data.priceList.filter(item => item.value === priceListItem.id),
          ];
        } else {
          defaultFormFields.find(x => x.name === 'pricelistId')!.options = [
            { value: '', label: t('DEFAULT_OPTION') },
            ...data.priceList.filter(item => !priceListData.some(dataItem => dataItem.id === item.value)),
            ,
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
export default PriceListBasicForm;

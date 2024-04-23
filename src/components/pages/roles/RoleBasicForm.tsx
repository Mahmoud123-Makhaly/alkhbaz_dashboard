'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useToast, useTranslate, useLookup } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { endpoints, permissionsLookup } from '@app/libs';
import { IRole } from '@app/types';

interface IRoleBasicFormProps {
  dataKey: { id: string; name: string } | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const RoleBasicForm = (props: IRoleBasicFormProps) => {
  const { mode, dataKey, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const t = useTranslate('COMP_RoleBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([permissionsLookup]);
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'name',
      label: t('NAME_LABEL'),
      placeholder: t('NAME_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'description',
      label: t('DESCRIPTION'),
      placeholder: t('DESCRIPTION_PLACEHOLDER'),
      type: 'textarea',
    },
    {
      name: 'permissions',
      label: t('PERMISSIONS_PLACE_LABEL'),
      type: 'select',
      isMulti: true,
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
    description: Yup.string().required(t('ERR_DESCRIPTION_REQUIRED')),
    permissions: Yup.array().min(1, t('ERR_PERMISSIONS_MIN')).required(t('ERR_PERMISSION_REQUIRED')),
  });
  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      name: '',
      description: '',
      permissions: '',
    };
  }, []);

  const onFormSubmit = formValues => {
    const permissions = formFields
      ?.find(x => x.name === 'permissions')!
      .options.filter(x => formValues.permissions.includes(x.value))
      .map(item => {
        return {
          id: item.value,
          name: item.label,
        };
      });
    if (mode === 'new')
      create({
        ...formValues,
        permissions,
      });
    if (mode === 'edit')
      updateData({
        ...formValues,
        id: dataKey?.id,
        permissions,
      });
  };

  const loadData = useCallback(async () => {
    apiClient.select<IRole>(endpoints.roles.details, { urlParams: { roleName: dataKey?.name } }).then(
      data => {
        const manipulatedData = data;
        manipulatedData.permissions = data.permissions.map(item => item.id);
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

  const updateData = useCallback(async (value: IRole) => {
    setIsLoading(true);
    apiClient.update<IRole>(endpoints.roles.update, value).then(
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

  const create = useCallback(async (value: IRole) => {
    setIsLoading(true);
    apiClient.update<IRole>(endpoints.roles.create, value).then(
      data => {
        if (data) {
          if (data.succeeded) {
            setValues(data);
            setTimeout(() => {
              setIsLoading(false);
              toast.success(t('CREATE_SUCCESS', { name: data.name }));
              onSubmit();
            }, 300);
          } else {
            if (data.errors) {
              const msgErr = data.errors[0];
              switch (true) {
                case new RegExp(appRegx.ErrRoleName).test(msgErr):
                  toast.error(t('ERR_ROLE_NAME'));
                  break;
                default:
                  toast.error(t('ERR_CREATE_GENERIC_MSG'));
                  break;
              }
            }
          }
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 310);
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
        defaultFormFields.find(x => x.name === 'permissions')!.options = [...data.permissions];
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
export default RoleBasicForm;

'use client';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useToast, useTranslate, useLookup } from '@app/hooks';
import { endpoints, rolesLookup, accountStatusesLookup, accountTypes } from '@app/libs';
import { IUser } from '@app/types';
import { useSession } from 'next-auth/react';

interface IEditUserBasicFormProps {
  id: string | undefined;
  onCancel: () => void;
  onSubmit: () => void;
}

const EditUserBasicForm = (props: IEditUserBasicFormProps) => {
  const { id, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const t = useTranslate('COMP_EditUserBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([rolesLookup, accountStatusesLookup, accountTypes]);
  const { data: session } = useSession();

  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'userName',
      label: t('USERNAME_LABEL'),
      placeholder: t('USERNAME_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'email',
      label: t('EMAIL_LABEL'),
      placeholder: t('EMAIL_PLACEHOLDER'),
      type: 'email',
    },

    {
      name: 'phoneNumber',
      label: t('PHONE_NUMBER_LABEL'),
      placeholder: t('PHONE_NUMBER_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'status',
      label: t('STATUS_LABEL'),
      type: 'select',
      col: 6,
    },
    {
      name: 'userType',
      label: t('USER_TYPE_LABEL'),
      type: 'select',
    },
    {
      name: 'roles',
      label: t('ROLES_LABEL'),
      placeholder: t('ROLE_PLACEHOLDER'),
      type: 'select',
      isMulti: true,
    },
    {
      name: 'emailConfirmed',
      label: t('CONFIRM_EMAIL_LABEL'),
      type: 'checkbox',
      col: 6,
    },
    {
      name: 'isAdministrator',
      label: t('ADMINISTRATOR_LABEL'),
      type: 'checkbox',
      col: 6,
    },
    {
      name: 'phoneNumberConfirmed',
      label: t('CONFIRM_PHONE_LABEL'),
      type: 'checkbox',
      col: 6,
    },
    {
      name: 'lockoutEnabled',
      label: t('LOCK_LABEL'),
      type: 'checkbox',
      col: 6,
    },
  ];
  //Form fields validation schema
  const validationSchema = Yup.object({
    userName: Yup.string()
      .min(3, t('ERR_NAME_MIN', { length: 3 }))
      .max(128, t('ERR_NAME_MAX', { length: 20 }))
      .required(t('ERR_USERNAME_REQUIRED')),
    email: Yup.string().email().required(t('ERR_EMAIL_REQUIRED')),
    phoneNumber: Yup.string().required(t('ERR_PHONE_NUMBER_REQUIRED')),
    status: Yup.string().required(t('ERR_STATUS_REQUIRED')),
    userType: Yup.string().required(t('ERR_USER_TYPE_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      isAdministrator: false,
      emailConfirmed: false,
      phoneNumberConfirmed: false,
      lockoutEnabled: false,
      userName: '',
      email: '',
      phoneNumber: '',
      status: '',
      roles: '',
      userType: '',
    };
  }, []);
  const onFormSubmit = formValues => {
    const roles = formFields
      ?.find(x => x.name === 'roles')!
      .options.filter(x => formValues.roles.includes(x.value))
      .map(item => {
        return {
          id: item.value,
          name: item.label,
        };
      });
    updateData({
      ...formValues,
      id,
      roles,
      modifiedBy: session?.user.userName,
    });
  };
  const loadData = useCallback(async () => {
    apiClient.select<IUser>(endpoints.users.details, { urlParams: { id } }).then(
      data => {
        const manipulatedData = data;
        manipulatedData.roles = data.roles?.map(item => item.id);
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
  const updateData = useCallback(async (value: IUser) => {
    setIsLoading(true);
    apiClient.update<IUser>(endpoints.users.update, value).then(
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

  useEffect(() => {
    if (formFields) {
      loadData();
    }
  }, [formFields, initialValues, loadData]);

  useEffect(() => {
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'roles')!.options = [...data.roles];
        defaultFormFields.find(x => x.name === 'status')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.accountStatuses,
        ];
        defaultFormFields.find(x => x.name === 'userType')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.accountTypes,
        ];

        setFormFields(defaultFormFields);
      },
      err => {
        toast.error(t('ERR_CREATE_GENERIC_MSG'));
        onCancel();
      },
    );
  }, []);
  return (
    <div>
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
    </div>
  );
};

export default EditUserBasicForm;

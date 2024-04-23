'use client';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useToast, useTranslate, useLookup } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { endpoints, rolesLookup, accountStatusesLookup, accountTypes } from '@app/libs';
import { IUser } from '@app/types';
import { useSession } from 'next-auth/react';

interface IAddUserBasicFormProps {
  memberId?: string;
  onCancel: () => void;
  onSubmit: () => void;
}

const AddUserBasicForm = (props: IAddUserBasicFormProps) => {
  const { memberId, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const t = useTranslate('COMP_AddUserBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([rolesLookup, accountStatusesLookup, accountTypes]);
  const { data: session } = useSession();

  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'isAdministrator',
      label: t('ADMINISTRATOR_LABEL'),
      type: 'checkbox',
      col: 6,
    },
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
      name: 'password',
      label: t('PASSWORD_LABEL'),
      placeholder: t('PASSWORD_PLACEHOLDER'),
      type: 'password',
    },
    {
      name: 'passwordConfirmation',
      label: t('REPEAT_PASSWORD_LABEL'),
      placeholder: t('REPEAT_PASSWORD_PLACEHOLDER'),
      type: 'password',
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
      col: 6,
    },
    {
      name: 'roles',
      label: t('ROLES_LABEL'),
      placeholder: t('ROLE_PLACEHOLDER'),
      type: 'select',
      isMulti: true,
      col: 6,
    },
    {
      name: 'emailConfirmed',
      label: t('CONFIRM_EMAIL_LABEL'),
      type: 'checkbox',
      col: 6,
    },
    {
      name: 'phoneNumberConfirmed',
      label: t('CONFIRM_PHONE_LABEL'),
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
    password: Yup.string().matches(appRegx.PasswordRegExp, t('ERR_PASSWORD_REGX')).required(t('ERR_PASSWORD_REQUIRED')),
    status: Yup.string().required(t('ERR_STATUS_REQUIRED')),
    userType: Yup.string().required(t('ERR_USER_TYPE_REQUIRED')),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], t('REPEAT_PASSWORD_ERR'))
      .required(t('REPEAT_PASSWORD_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      isAdministrator: false,
      emailConfirmed: false,
      phoneNumberConfirmed: false,
      userName: '',
      email: '',
      phoneNumber: '',
      password: '',
      passwordConfirmation: '',
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

    create({
      ...formValues,
      roles,
      createdBy: session?.user.userName,
      modifiedBy: session?.user.userName,
    });
  };

  const create = useCallback(async (value: IUser) => {
    setIsLoading(true);
    apiClient.create<IUser>(endpoints.users.create, { ...value, memberId }).then(
      data => {
        if (data) {
          if (data.succeeded) {
            setValues(data);
            setTimeout(() => {
              toast.success(t('CREATE_SUCCESS', { name: data.name }));
              onSubmit();
            }, 300);
          } else {
            if (data.errors) {
              const msgErr = data.errors[0];
              switch (true) {
                case data.errors.includes('Username', 0) && data.errors.includes('Email', 1):
                  toast.error(t('ERR_USER_NAME_AND_EMAIL'));
                  break;
                case new RegExp(appRegx.ErrUserName).test(msgErr):
                  toast.error(t('ERR_USERNAME'));
                  break;
                case new RegExp(appRegx.ErrEmail).test(msgErr):
                  toast.error(t('ERR_EMAIL'));
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
      setValues(initialValues);
      setLoadingStatus(DataLoadingStatus.done);
    }
  }, [formFields, initialValues]);

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

export default AddUserBasicForm;

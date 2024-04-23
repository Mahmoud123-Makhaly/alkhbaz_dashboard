'use client';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useLookup, useToast, useTranslate } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { endpoints, employeeStatuses, companiesLookup, timezones, languagesLookup } from '@app/libs';
import { IEmployeeItem } from '@app/types';
import { useSession } from 'next-auth/react';

interface IEmployeesBasicFormProps {
  id: string | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}
const EmployeeData = {
  memberType: 'Employee',
};
const EmployeesBasicForm = (props: IEmployeesBasicFormProps) => {
  const { mode, id, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_EmployeesBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([employeeStatuses, companiesLookup, languagesLookup]);
  const { data: session } = useSession();

  const onElementChange = (e, values) => {
    const changedInputName = e.currentTarget.name;
    if (changedInputName === 'firstName' || changedInputName === 'lastName') {
      setValues({ ...values, fullName: `${values.firstName} ${values.lastName}` });
    }
  };
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'fullName',
      label: t('Full_NAME_LABEL'),
      placeholder: t('FULL_NAME_PLACEHOLDER'),
      type: 'text',
      readOnly: true,
    },
    {
      name: 'firstName',
      label: t('FIRST_NAME_LABEL'),
      placeholder: t('FIRST_NAME_PLACEHOLDER'),
      type: 'text',
      col: 6,
      onElementChange,
    },
    {
      name: 'middleName',
      label: t('MIDDLE_NAME_LABEL'),
      placeholder: t('MIDDLE_NAME_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'lastName',
      label: t('LAST_NAME_LABEL'),
      placeholder: t('LAST_NAME_PLACEHOLDER'),
      type: 'text',
      col: 6,
      onElementChange,
    },
    {
      name: 'outerId',
      label: t('OUTERID_LABEL'),
      placeholder: t('OUTERID_PLACEHOLDER'),
      type: 'text',
      col: 6,
    },
    {
      name: 'synced',
      label: t('SYNCED_LABEL'),
      type: 'checkbox',
      col: 6,
    },
    {
      name: 'defaultLanguage',
      label: t('DEFAULT_LANGUAGE_LABEL'),
      type: 'select',
      col: 6,
    },
    {
      name: 'timeZone',
      label: t('TIME_ZONE_LABEL'),
      type: 'select',
      options: timezones.map(item => ({
        label: item.text,
        value: item.utc[0],
      })),
      col: 6,
    },
    {
      name: 'organizations',
      label: t('ORGANIZATIONS_LABEL'),
      type: 'select',
      isMulti: true,
      col: 6,
    },
    {
      name: 'status',
      label: t('STATUS_LABEL'),
      type: 'select',
      col: 6,
    },
    {
      name: 'birthDate',
      label: t('DATE_LABEL'),
      type: 'date',
      options: { altInput: true, altFormat: 'F j, Y ' },
      col: 6,
    },
  ];
  //Form fields validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(3, t('ERR_FIRST_NAME_MIN', { length: 3 }))
      .max(20, t('ERR_FIRST_NAME_MAX', { length: 50 }))
      .trim()
      .matches(appRegx.StartWithCharAllowSpace, t('ERR_FIRST_NAME_REGX'))
      .required(t('ERR_FIRST_NAME_REQUIRED')),
    lastName: Yup.string()
      .min(3, t('ERR_LAST_NAME_MIN', { length: 3 }))
      .max(20, t('ERR_LAST_NAME_MAX', { length: 50 }))
      .trim()
      .matches(appRegx.StartWithCharAllowSpace, t('ERR_LAST_NAME_REGX'))
      .required(t('ERR_LAST_NAME_REQUIRED')),
    status: Yup.string().required(t('ERR_STATUS_REQUIRED')),
    birthDate: Yup.string().required(t('ERR_DATE_REQUIRED')) .test({
      name: 'birthDate',
      message: t('ERR_DATE'),
      test: ((value)=>{
        const currentDate = new Date();
        const birthDate = new Date(value);
        const differenceInYears = currentDate.getFullYear() - birthDate.getFullYear();
        return differenceInYears >= 15;
      })
    }),
    defaultLanguage: Yup.string().required(t('ERR_LANGUAGE_REQUIRED')),
    organizations: Yup.array().min(1, t('ERR_ORGANIZATIONS_MIN')).required(t('ERR_ORGANIZATIONS_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      firstName: '',
      lastName: '',
      status: 'New',
      birthDate: null,
      middleName: '',
      defaultLanguage: '',
      photoUrl: '',
      organizations: '',
      timeZone: '',
      synced: true,
      outerId: '',
    };
  }, []);
  const onFormSubmit = formValues => {
    if (mode === 'new')
      create({
        ...formValues,
        ...EmployeeData,
        createdBy: session?.user.userName,
        modifiedBy: session?.user.userName,
      });
    if (mode === 'edit')
      updateData({
        ...formValues,
        id,
        modifiedBy: session?.user.userName,
      });
  };
  const loadData = useCallback(async () => {
    apiClient.select<IEmployeeItem>(endpoints.employees.details, { urlParams: { id } }).then(
      data => {
        const manipulatedData = data;
        manipulatedData.organizations = data.organizations.map(item => item);
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
  const updateData = useCallback(async (value: IEmployeeItem) => {
    setIsLoading(true);
    apiClient.update<IEmployeeItem>(endpoints.employees.update, value).then(
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
  const create = useCallback(async (value: IEmployeeItem) => {
    setIsLoading(true);
    apiClient.create<IEmployeeItem>(endpoints.employees.create, value).then(
      data => {
        if (data) {
          setValues(data);
          setTimeout(() => {
            setIsLoading(false);
            toast.success(t('CREATE_SUCCESS', { name: data.firstName }));
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
        defaultFormFields.find(x => x.name === 'status')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.employeeStatuses,
        ];
        defaultFormFields.find(x => x.name === 'defaultLanguage')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.languages,
        ];
        defaultFormFields.find(x => x.name === 'organizations')!.options = [...data.companies];
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

export default EmployeesBasicForm;

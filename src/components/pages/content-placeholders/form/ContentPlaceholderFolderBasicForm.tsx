'use client';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useToast, useTranslate } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { endpoints } from '@app/libs';
import { IContentPlaceFolderItem } from '@app/types';
import { IFileAsset } from '@app/types';

interface IContentPlaceholderFolderBasicFormProps {
  id?: string | null;
  mode: 'new' | 'edit' | null;
  onCancel: () => void;
  onSubmit: () => void;
}
const ContentPlaceholderFolderBasicForm = (props: IContentPlaceholderFolderBasicFormProps) => {
  const { mode, id, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_ContentPlaceholdersFolderBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  //Form fields
  const formFields: Array<FormFieldType> = [
    {
      name: 'name',
      label: t('FOLDERNAME_LABEL'),
      placeholder: t('FOLDERNAME_PLACEHOLDER'),
      type: 'text',
    },
    {
      name: 'description',
      label: t('DESCRIPTION_LABEL'),
      placeholder: t('DESCRIPTION_PLACEHOLDER'),
      type: 'text',
    },
  ];

  //Form fields validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('ERR_NAME_MIN', { length: 3 }))
      .max(50, t('ERR_NAME_MAX', { length: 50 }))
      .trim()
      .matches(appRegx.StartWithCharAllowSpace, t('ERR_NAME_REGX'))
      .required(t('ERR_NAME_REQUIRED')),
    description: Yup.string().required(t('ERR_DESCRIPTION_REQUIRED')),
    // imageUrl: Yup.mixed().required(t('ERR_IMAGEURL_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      name: '',
      description: '',
    };
  }, []);

  const onFormSubmit = formValues => {
    if (mode === 'new') {
      create({ ...formValues });
    }
    if (mode === 'edit') updateData({ ...formValues, id });
  };

  const loadData = useCallback(async () => {
    apiClient.select<IContentPlaceFolderItem>(endpoints.contentPlaceholders.details, { urlParams: { id } }).then(
      data => {
        setValues(data);
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
  const updateData = useCallback(async (value: IContentPlaceFolderItem) => {
    setIsLoading(true);
    apiClient.create<IContentPlaceFolderItem>(endpoints.contentPlaceholders.update, value).then(
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
  const create = useCallback(async (value: IContentPlaceFolderItem) => {
    setIsLoading(true);
    apiClient.create<IContentPlaceFolderItem>(endpoints.contentPlaceholders.createContentPlaceholder, value).then(
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
  const uploadImage = useCallback(async (value: IContentPlaceFolderItem) => {
    setIsLoading(true);
    //upload image
    //  then create
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (mode === 'new') {
      setValues(initialValues);
      setLoadingStatus(DataLoadingStatus.done);
    }
    if (mode === 'edit') loadData();
  }, [initialValues, loadData, mode]);
  return (
    <div>
      <Row>
        <Col md={12}>
          <Card className="shadow-none">
            <CardBody>
              <DataLoader status={loadingStatus}>
                <FormControl
                  initialValues={values}
                  validationSchema={validationSchema}
                  onSubmit={onFormSubmit}
                  fields={formFields}
                  onCancel={onCancel}
                  isLoading={isLoading}
                />
              </DataLoader>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContentPlaceholderFolderBasicForm;

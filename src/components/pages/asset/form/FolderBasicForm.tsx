'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useToast, useTranslate } from '@app/hooks';
import { appRegx } from '@helpers/regex';
import { endpoints } from '@app/libs';
import { IAsset, ICatalogItem } from '@app/types';

interface IFolderBasicFormProps {
  mode: 'edit' | 'new';
  type: 'folder' | 'file';
  url: string;
  header: string;
  onCancel: () => void;
  onSubmit: () => void;
}

const FolderBasicForm = (props: IFolderBasicFormProps) => {
  const { mode, url, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_AssetFolderBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const constProps = {
    parentUrl: url,
  };
  //Form fields
  const formFields: Array<FormFieldType> = [
    {
      name: 'name',
      label: t('NAME_LABEL'),
      placeholder: t('NAME_PLACEHOLDER'),
      type: 'text',
      inputNotes: t.rich('NAME_NOTES', {
        p: chunks => <p className="text-muted fs-12 mt-2 mb-1">{chunks}</p>,
        ul: chunks => <ul className="text-muted fs-12">{chunks}</ul>,
        li: chunks => <li>{chunks}</li>,
      }),
    },
  ];

  //Form fields validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('ERR_NAME_MIN', { length: 3 }))
      .max(40, t('ERR_NAME_MAX', { length: 40 }))
      .trim()
      .matches(appRegx.FileName, t('ERR_NAME_REGX'))
      .required(t('ERR_NAME_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      name: '',
    };
  }, []);

  const onFormSubmit = formValues => {
    if (mode === 'new') create({ ...formValues, ...constProps });
    // if (mode === 'edit') updateData({ ...formValues, url });
  };

  const loadData = useCallback(async () => {
    // apiClient.select<ICatalogItem>(endpoints.catalogs.details, { urlParams: { url } }).then(
    //   data => {
    //     setValues(data);
    //     setTimeout(() => {
    //       setLoadingStatus(DataLoadingStatus.done);
    //     }, 1000);
    //   },
    //   err => {
    //     toast.error(err.toString());
    //     setLoadingStatus(DataLoadingStatus.done);
    //   },
    // );
  }, []);

  const updateData = useCallback(async (value: IAsset) => {
    // setIsLoading(true);
    // apiClient.update<ICatalogItem>(endpoints.asset.createFolder, value).then(
    //   data => {
    //     if (data) {
    //       setValues(data);
    //       setTimeout(() => {
    //         setIsLoading(false);
    //         toast.success(t('UPDATE_SUCCESS'));
    //         onSubmit();
    //       }, 300);
    //     } else {
    //       setIsLoading(false);
    //       toast.error(t('ERR_UPDATE_GENERIC_MSG'));
    //     }
    //   },
    //   err => {
    //     toast.error(err.toString());
    //     setIsLoading(false);
    //   },
    // );
    // // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = useCallback(async (value: IAsset) => {
    setIsLoading(true);
    apiClient.create<IAsset>(endpoints.asset.createFolder, value).then(
      data => {
        if (data) {
          setValues(data);
          setTimeout(() => {
            setIsLoading(false);
            toast.success(t('CREATE_SUCCESS', { name: data.name }));
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
    if (mode === 'new') {
      setValues(initialValues);
      setLoadingStatus(DataLoadingStatus.done);
    }
    if (mode === 'edit') loadData();
  }, [initialValues, loadData, mode]);

  return (
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
  );
};
export default FolderBasicForm;

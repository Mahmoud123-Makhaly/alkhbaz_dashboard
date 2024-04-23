'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useAPIAuthClient, useTranslate } from '@app/hooks';
import { endpoints } from '@app/libs';
import { IFileAsset } from '@app/types';

interface IFolderBasicFormProps {
  mode: 'edit' | 'new';
  type: 'folder' | 'file';
  url: string;
  header: string;
  onCancel: () => void;
  onSubmit: (errMsg?: string, successMsg?: string) => void;
}

const FileBasicForm = (props: IFolderBasicFormProps) => {
  const { mode, url, onCancel, onSubmit } = props;
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();

  const t = useTranslate('COMP_AssetFileBasicForm');
  const apiClient = useAPIAuthClient();

  //Form fields
  const formFields: Array<FormFieldType> = [
    {
      name: 'files',
      label: t('FILE_LABEL'),
      placeholder: t('FILE_PLACEHOLDER'),
      type: 'file',
      multiple: true,
      accept: {
        'application/pdf': [],
        'text/*': [],
        'image/*': [],
        'audio/*': [],
        'video/*': [],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
      },
    },
  ];

  //Form fields validation schema
  const validationSchema = Yup.object({
    files: Yup.mixed().required(t('ERR_FILE_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      files: undefined,
    };
  }, []);

  const onFormSubmit = async formValues => {
    setIsLoading(true);
    const promises: Array<Promise<string>> = [];
    formValues.files.map((file: File) => promises.push(upload({ file, urlParams: { folderUrl: url } })));
    Promise.allSettled(promises).then(results => {
      const uploadedFiles = _.flatMap(
        results.filter(x => x.status === 'fulfilled'),
        (item: PromiseFulfilledResult<string>) => item.value,
      );
      const failedUploadFiles = _.flatMap(
        results.filter(x => x.status === 'rejected'),
        (item: PromiseRejectedResult) => item.reason,
      );
      const successMsg =
        uploadedFiles && uploadedFiles.length > 0
          ? t('UPLOAD_FILE_SUCCESS', { name: uploadedFiles.join(', ') })
          : undefined;
      const errMsg =
        failedUploadFiles && failedUploadFiles.length > 0
          ? t('ERR_UPLOAD_FILE_MSG', { name: failedUploadFiles.join(', ') })
          : undefined;

      setTimeout(() => {
        setIsLoading(false);
        onSubmit(errMsg, successMsg);
      }, 300);
    });
  };

  const upload = (value: { file: File; urlParams: { folderUrl: string } }): Promise<string> =>
    new Promise((resolve, reject) =>
      apiClient
        .create<IFileAsset>(endpoints.asset.uploadFile, value, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(
          data => {
            if (data) {
              resolve(value.file.name);
            } else {
              reject(value.file.name);
            }
          },
          err => reject(value.file.name),
        )
        .catch(err => reject(value.file.name)),
    );

  useEffect(() => {
    if (mode === 'new') {
      setValues(initialValues);
      setLoadingStatus(DataLoadingStatus.done);
    }
  }, [initialValues, mode]);

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
export default FileBasicForm;

'use client';

import { Row, Col, Card, CardBody } from 'reactstrap';
import { DataLoader, DataLoadingStatus, FormControl, FormFieldType } from '@components/common';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useAPIAuthClient, useLookup, useToast, useTranslate } from '@app/hooks';
import { endpoints, languagesLookup, imageCategories } from '@app/libs';
import { IFileAsset, IProductItem } from '@app/types';
interface IProductImageBasicFormProps {
  id: string | null;
  product: IProductItem;
  onCancel: () => void;
  onSubmit: () => void;
}

const AddProductImagesBasicForm = (props: IProductImageBasicFormProps) => {
  const { product, onCancel, onSubmit } = props;
  const { data: session } = useSession();
  const [values, setValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<FormFieldType> | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const t = useTranslate('COMP_AddProductImageBasicForm');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const lookup = useLookup([languagesLookup, imageCategories]);
  //Form fields
  const defaultFormFields: Array<FormFieldType> = [
    {
      name: 'languageCode',
      label: t('LANGUAGE_LABEL'),
      type: 'select',
      col: 6,
    },
    {
      name: 'group',
      label: t('GROUP_LABEL'),
      type: 'select',
      col: 6,
    },
    {
      name: 'sortOrder',
      label: t('SORT_LABEL'),
      type: 'number',
    },
    {
      name: 'url',
      label: t('URL_LABEL'),
      type: 'file',
      multiple: true,
      accept: {
        'image/*': [],
      },
    },
  ];

  //Form fields validation schema
  const validationSchema = Yup.object({
    languageCode: Yup.string().required(t('ERR_LANGUAGE_REQUIRED')),
    group: Yup.string().required(t('ERR_GROUP_REQUIRED')),
    sortOrder: Yup.number().required(t('ERR_SORT_REQUIRED')),
    url: Yup.mixed().required(t('ERR_IMAGES_REQUIRED')),
  });

  //Form fields initial values
  const initialValues = useMemo(() => {
    return {
      languageCode: '',
      group: '',
      sortOrder: 1,
      url: undefined,
    };
  }, []);

  const upload = (value: { file: File; urlParams: { folderUrl: string } }): Promise<IFileAsset | string> =>
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
              resolve(data);
            } else {
              reject(value.file.name);
            }
          },
          () => reject(value.file.name),
        )
        .catch(() => reject(value.file.name)),
    );

  const onFormSubmit = async formValues => {
    setIsLoading(true);
    const selectedCategory = formValues.group
      ? formFields?.find(x => x.name === 'group')!.options.find(x => x.value === formValues.group.value)?.value
      : undefined;
    const promises: Array<Promise<IFileAsset | string>> = [];
    formValues.url.map((file: File) =>
      promises.push(
        upload({
          file,
          urlParams: {
            folderUrl: `catalog/${product.catalogId.substring(0, 5)}/${product.code}${
              selectedCategory ? '/' + selectedCategory : ''
            }`,
          },
        }),
      ),
    );
    Promise.allSettled(promises).then(results => {
      const uploadedFiles = _.flatMap(
        results.filter(x => x.status === 'fulfilled'),
        (item: PromiseFulfilledResult<IFileAsset>) => item.value,
      );
      const failedUploadFiles = _.flatMap(
        results.filter(x => x.status === 'rejected'),
        (item: PromiseRejectedResult) => item.reason,
      );
      const successMsg =
        uploadedFiles && uploadedFiles.length > 0
          ? t('UPLOAD_FILE_SUCCESS', { name: uploadedFiles.map(x => x.name).join(', ') })
          : undefined;
      const errMsg =
        failedUploadFiles && failedUploadFiles.length > 0
          ? t('ERR_UPLOAD_FILE_MSG', { name: failedUploadFiles.join(', ') })
          : undefined;

      updateProduct(formValues, { err: errMsg, success: successMsg }, uploadedFiles);
    });
  };
  const updateProduct = useCallback(
    async (formValues, status: { err?: string; success?: string }, uploadedFiles?: Array<IFileAsset>) => {
      if (uploadedFiles && uploadedFiles.length > 0) {
        let order = formValues.sortOrder;
        const newImgs = uploadedFiles.map((file: IFileAsset) => ({
          url: file.url,
          relativeUrl: file.relativeUrl,
          createdBy: session?.user.userName,
          modifiedBy: session?.user.userName,
          name: file.name,
          binaryData: null,
          altText: product.name,
          description: product.name,
          sortOrder: order++,
          typeId: 'Image',
          group: formValues.group,
          languageCode: formValues.languageCode,
          seoObjectType: 'Image',
          isInherited: false,
        }));
        apiClient
          .create<IProductItem>(endpoints.products.update, {
            ...product,
            modifiedBy: session?.user.userName,
            images: [...(product.images || []), ...newImgs],
          })
          .then(
            data => {
              if (data) {
                setValues(data);
                toast.success(status.success);
                if (status.err) toast.error(status.err);
                setTimeout(() => {
                  setIsLoading(false);
                  onSubmit();
                }, 2500);
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
      } else if (status.err) toast.error(status.err);
      else toast.error(t('ERR_UPDATE_GENERIC_MSG'));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [],
  );

  useEffect(() => {
    if (formFields) {
      initialValues.sortOrder =
        product.images && product.images.length > 0
          ? product.images?.map(x => x.sortOrder).reduce((a, b) => Math.max(a, b)) + 1
          : 1;
      setValues(initialValues);
      setLoadingStatus(DataLoadingStatus.done);
    }
  }, [formFields, initialValues]);

  useEffect(() => {
    lookup.load().then(
      data => {
        defaultFormFields.find(x => x.name === 'group')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.imageCategories,
        ];
        defaultFormFields.find(x => x.name === 'languageCode')!.options = [
          { value: '', label: t('DEFAULT_OPTION') },
          ...data.languages,
        ];

        setFormFields(defaultFormFields);
      },
      () => {
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
export default AddProductImagesBasicForm;

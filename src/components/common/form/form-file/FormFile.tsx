'use client';

import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Utils } from '@helpers/utils';
import { Field } from 'formik';
import { Card, Col, Row } from 'reactstrap';
import Image from 'next/image';
import Link from 'next-intl/link';
import { IFormFileProps } from './FormFile.types';
import { useTranslate } from '@app/hooks';

const FormFile = (props: IFormFileProps) => {
  const { readOnly, ...rest } = props;
  const t = useTranslate('COMP_FormFile');
  const [selectedFiles, setSelectedFiles] = useState<
    Array<
      File & {
        preview: string;
        formattedSize: {
          value: number;
          sizeType: any;
        };
      }
    >
  >([]);

  const handleImageChange = (files, form, field) => {
    if (files && files.length > 0) {
      const previewFiles = files;
      previewFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          formattedSize: Utils.formatBytes(file.size),
        }),
      );
      setSelectedFiles(previewFiles);
      const blobs: Array<File> = [];
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        if (file) {
          let reader = new FileReader();
          reader.onload = e => {
            const blob = new File([new Blob([e.target?.result!])], file.name, {
              type: file.type,
            });
            blobs.push(blob);
          };
          reader.readAsArrayBuffer(file);
        }
      }
      form.setFieldValue(field.name, rest.multiple ? blobs : blobs[0]);
    }
  };
  return (
    <Field {...rest}>
      {({
        field, // { name, value, onChange, onBlur }
        form, // also touched, errors, values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
      }) => (
        <div className="is-invalid">
          <Dropzone
            {...rest}
            disabled={readOnly}
            onDrop={acceptedFiles => {
              handleImageChange(acceptedFiles, form, field);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div className="dropzone dz-clickable">
                <div className="dz-message needsclick" {...getRootProps()}>
                  <div className="mb-3">
                    <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                  </div>
                  <h4>{t('DROP_FILE_MSG')}</h4>
                </div>
              </div>
            )}
          </Dropzone>
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="list-unstyled mb-0 overflow-auto" style={{ height: '100px' }}>
              {selectedFiles.map((f, i) => {
                return (
                  <Card
                    className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                    key={i + '-file'}
                  >
                    <div className="p-2">
                      <Row className="align-items-center m-0">
                        <Col className="col-auto">
                          {f.type.startsWith('image/') && (
                            <Image
                              src={f.preview}
                              className="avatar-sm"
                              alt={f.name}
                              width={0}
                              height={0}
                              loading="lazy"
                              sizes="100vw"
                              style={{ height: 'auto' }}
                            />
                          )}
                          {!f.type.startsWith('image/') && (
                            <i className={`${Utils.getFileIcon(f.name).icon} fs-1 align-bottom`}></i>
                          )}
                        </Col>
                        <Col>
                          <Link href="#" className="text-muted font-weight-bold">
                            {f.name}
                          </Link>
                          <p className="mb-0">
                            <strong>{`${f.formattedSize.value} ${f.formattedSize.sizeType}`}</strong>
                          </p>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Field>
  );
};
export default FormFile;

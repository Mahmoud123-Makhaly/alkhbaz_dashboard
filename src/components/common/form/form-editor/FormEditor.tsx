'use client';

import { CKEditor } from '@components/common';
import { Field } from 'formik';
import { IFormEditorProps } from './FormEditor.types';
const FormEditor = (props: IFormEditorProps) => {
  const { readOnly, ...rest } = props;
  return (
    <Field as={CKEditor} {...rest}>
      {({
        field, // { name, value, onChange, onBlur }
        form, // also touched, errors, values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
      }) => (
        <div className="is-invalid">
          <CKEditor
            {...rest}
            disabled={readOnly}
            data={field.value}
            onChange={(event, editor) => {
              form.setFieldValue(field.name, editor.getData());
            }}
            onBlur={(event, editor) => {
              form.setFieldTouched(field.name, true);
            }}
          />
        </div>
      )}
    </Field>
  );
};
export default FormEditor;

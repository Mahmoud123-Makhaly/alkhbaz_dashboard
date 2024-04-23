'use client';

import { IFormFieldProps } from './FormField.types';
import { FormInput } from '../form-input';
import { FormCheckbox } from '../form-checkbox';
import { FormSelect } from '../form-select';
import { FormEditor } from '../form-editor';
import { FormPicker } from '../form-picker';
import { FormFile } from '../form-file';

const FormField = (props: IFormFieldProps) => {
  const { type } = props;
  switch (type) {
    case 'text':
    case 'email':
    case 'number':
    case 'url':
    case 'password':
      return <FormInput {...props} />;
    case 'checkbox':
      return <FormCheckbox {...props} />;
    case 'select':
      return <FormSelect {...props} />;
    case 'editor':
      return <FormEditor {...props} />;
    case 'date':
      return <FormPicker {...props} />;
    case 'file':
      return <FormFile {...props} />;
    default:
      return <FormInput {...props} />;
  }
};
export default FormField;

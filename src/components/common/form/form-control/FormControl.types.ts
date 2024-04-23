import { FormikHelpers } from 'formik';
// type HTMLInputTypeAttribute =
//   | 'button'
//   | 'checkbox'
//   | 'color'
//   | 'date'
//   | 'datetime-local'
//   | 'email'
//   | 'file'
//   | 'hidden'
//   | 'image'
//   | 'month'
//   | 'number'
//   | 'password'
//   | 'radio'
//   | 'range'
//   | 'reset'
//   | 'search'
//   | 'submit'
//   | 'tel'
//   | 'text'
//   | 'time'
//   | 'url'
//   | 'week'
//   | (string & {});
export type FormInputTypes =
  | 'text'
  | 'email'
  | 'select'
  | 'file'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'textarea'
  | 'button'
  | 'reset'
  | 'submit'
  | 'date'
  | 'datetime-local'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'range'
  | 'search'
  | 'tel'
  | 'url'
  | 'week'
  | 'password'
  | 'datetime'
  | 'time'
  | 'color'
  | 'editor';

export interface FormikValues {
  [field: string]: any;
}

export interface FormFieldType {
  label: string;
  name: string;
  id?: string;
  placeholder?: string;
  type: FormInputTypes;
  col?: number;
  readOnly?: boolean | undefined;
  onElementChange?: (e: React.ChangeEvent<any>, values: any) => void;
  [key: string]: any;
}

export interface IFormControl<Values extends FormikValues = FormikValues> {
  initialValues: any;
  validationSchema: any | (() => any);
  fields: Array<FormFieldType>;
  withAdvancedLink?: { label?: string; url: string };
  isLoading?: boolean;
  onSubmit: (values: Values, formikHelpers: FormikHelpers<Values>) => void | Promise<any>;
  onCancel: () => void;
  submitLabel?: string | undefined;
  cancelLabel?: string | undefined;
}

import { IFormFieldProps } from '../form-field/FormField.types';

export interface IFormEditorProps extends Omit<IFormFieldProps, 'type' | 'className' | 'value'> {}

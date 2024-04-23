import { IFormFieldProps } from '../form-field/FormField.types';

export interface IFormCheckboxProps extends Omit<IFormFieldProps, 'placeholder' | 'type' | 'className'> {}

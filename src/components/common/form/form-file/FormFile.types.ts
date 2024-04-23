import { IFormFieldProps } from '../form-field/FormField.types';

export interface IFormFileProps extends Omit<IFormFieldProps, 'className'> {
  multiple?: boolean;
  accept?: { [key: string]: string[] };
}

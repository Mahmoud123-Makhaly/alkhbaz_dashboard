import { ReactNode } from 'react';
import { IFormFieldProps } from '../form-field';

export interface IFormInputProps extends IFormFieldProps {
  inputNotes?: ReactNode;
}

import { FormFieldType } from '../FormControl';

export interface IFormFieldProps extends Omit<FormFieldType, 'label' | 'id' | 'col'> {
  id: string;
  className: string;
  onBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  onChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | React.ChangeEvent<any>>(
      field: T_1,
    ): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
  };
  value: any;
  invalid: boolean;
}

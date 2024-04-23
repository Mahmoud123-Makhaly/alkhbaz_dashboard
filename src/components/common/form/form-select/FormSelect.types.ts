import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { IFormFieldProps } from '../form-field/FormField.types';

export interface IFormSelectProps extends Omit<IFormFieldProps, 'type' | 'className'> {
  options?: Array<{ value: string; label: string }>;
  isMulti?: boolean;
  onSelectChange?:
    | ((
        fieldName: string,
        newValue:
          | MultiValue<
              | {
                  value: string;
                  label: string;
                }
              | [
                  {
                    value: string;
                    label: string;
                  },
                ]
            >
          | SingleValue<
              | {
                  value: string;
                  label: string;
                }
              | [
                  {
                    value: string;
                    label: string;
                  },
                ]
            >,
        actionMeta: ActionMeta<
          | {
              value: string;
              label: string;
            }
          | [
              {
                value: string;
                label: string;
              },
            ]
        >,
        values?: Array<{ [k: string]: any }>,
      ) => void)
    | undefined;
}

import { IFormFieldProps } from '../form-field/FormField.types';
type DateOption = Date | string | number;
export declare type DateRangeLimit<D = DateOption> = {
  from: D;
  to: D;
};
export declare type DateLimit<D = DateOption> = D | DateRangeLimit<D> | ((date: Date) => boolean);
export interface IFormPickerProps extends Omit<IFormFieldProps, 'type' | 'className'> {
  options?: Partial<{
    enableTime: boolean;
    altInput: boolean;
    altFormat: string;
    maxDate: DateOption;
    maxTime: DateOption;
    minDate: DateOption;
    minTime: DateOption;
    defaultDate: DateOption | DateOption[];
    disable: DateLimit<DateOption>[];
    mode: 'single' | 'multiple' | 'range' | 'time';
  }>;
}

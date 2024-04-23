'use client';

import { Field } from 'formik';
import Flatpickr from 'react-flatpickr';
import { IFormPickerProps } from './FormPicker.types';
import { useRef, useEffect } from 'react';

//FIXME: Range issue value
const FormPicker = (props: IFormPickerProps) => {
  const { invalid, value, options, readOnly, onKeyUp, ...rest } = props;
  const inputRef = useRef<Flatpickr>();
  useEffect(() => {
    if (readOnly && inputRef.current && inputRef.current.flatpickr) {
      if (inputRef.current.flatpickr.altInput) {
        inputRef.current.flatpickr.altInput.value = value;
        inputRef.current.flatpickr.altInput.disabled = readOnly;
      }
      if (inputRef.current.flatpickr.input) {
        inputRef.current.flatpickr.input.value = value;
        inputRef.current.flatpickr.input.disabled = readOnly;
      }
    }
  }, [readOnly, value]);
  return (
    <Field as="input" {...rest}>
      {({
        field, // { name, value, onChange, onBlur }
        form, // also touched, errors, values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
      }) => (
        <div className="form-icon is-invalid">
          <Flatpickr
            ref={inputRef}
            {...rest}
            type="hidden"
            className="form-control form-control-icon"
            value={Array.isArray(field.value) ? field.value : [field.value]}
            options={{ ...(options || {}), dateFormat: `d M, Y${options?.enableTime ? ' H:i' : ''}` }}
            onChange={(dates: Date[], currentDateString: string, self: any, data?: any) => {
              if (options?.mode && options?.mode === 'range') {
                form.setFieldValue(field.name, dates);
              } else form.setFieldValue(field.name, new Date(currentDateString));
            }}
            // onBlur={() => form.setFieldTouched(field.name, true)}
          />
          <i className="ri-calendar-event-line"></i>
        </div>
      )}
    </Field>
  );
};
export default FormPicker;

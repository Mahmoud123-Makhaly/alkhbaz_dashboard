'use client';

import { Field } from 'formik';
import Select, { ActionMeta } from 'react-select';
import { IFormSelectProps } from './FormSelect.types';
import './FormSelect.css';
import { useTranslate } from '@app/hooks';
const FormSelect = (props: IFormSelectProps) => {
  const { isMulti, options, readOnly, onSelectChange, ...rest } = props;
  const t = useTranslate('COMP_FORMSELECT');
  return (
    <Field className="form-select" {...rest}>
      {({
        field, // { name, value, onChange, onBlur }
        form, // also touched, errors, values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
      }) => (
        <div className="is-invalid">
          <Select
            {...rest}
            isDisabled={readOnly}
            isMulti={isMulti}
            closeMenuOnSelect={isMulti ? false : true}
            noOptionsMessage={() => t('noOptionsMessage')}
            options={options}
            name={field.name}
            value={
              options
                ? Array.isArray(field.value)
                  ? options.filter(option => field.value.includes(option.value))
                  : options.find(option => option?.value === field.value)
                : undefined
            }
            onChange={(
              selectedOption: { value: string; label: string } | [{ value: string; label: string }],
              meta: ActionMeta<
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
            ) => {
              form.setFieldValue(
                field.name,
                Array.isArray(selectedOption)
                  ? selectedOption.map(option => option.value.toString()) || []
                  : selectedOption?.value.toString(),
              );
              if (onSelectChange) onSelectChange(field.name, selectedOption, meta, form.values);
            }}
            onBlur={field.onBlur}
            className="app-form-select"
          />
        </div>
      )}
    </Field>
  );
};
export default FormSelect;

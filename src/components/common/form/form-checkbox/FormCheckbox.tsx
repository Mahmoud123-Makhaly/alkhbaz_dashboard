'use client';

import { IFormCheckboxProps } from './FormCheckbox.types';

const FormCheckbox = (props: IFormCheckboxProps) => {
  const { value, invalid, readOnly, ...rest } = props;
  return (
    <div className="form-check form-switch d-flex">
      <input
        style={{ width: '45px', height: '22px' }}
        type="checkbox"
        role="switch"
        checked={value}
        disabled={readOnly}
        {...rest}
        className="form-check-input"
      />
    </div>
  );
};
export default FormCheckbox;

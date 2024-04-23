'use client';

import { Input } from 'reactstrap';
import { IFormInputProps } from './FormInput.types';
import React from 'react';

const FormInput = (props: IFormInputProps) => {
  const { inputNotes, ...rest } = props;
  return (
    <React.Fragment>
      <Input {...rest} />
      <React.Fragment>{inputNotes}</React.Fragment>
    </React.Fragment>
  );
};
export default FormInput;

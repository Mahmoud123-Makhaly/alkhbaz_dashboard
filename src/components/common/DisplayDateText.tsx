'use client';
import React from 'react';
import { Utils } from '@helpers/utils';

const DisplayDateText = ({
  date,
  fromNow,
  time,
  format,
}: {
  date?: string;
  fromNow?: true;
  time?: '12' | '24';
  format?: string;
}) => {
  return <React.Fragment>{Utils.formatDate(date, fromNow, time, format)}</React.Fragment>;
};
export default DisplayDateText;

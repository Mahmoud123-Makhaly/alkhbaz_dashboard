'use client';

import { ReactNode } from 'react';
import NonAuthLayout from '@components/layouts/NonAuthLayout';

type Props = {
  children: ReactNode;
};
const Template = (props: Props) => {
  const { children } = props;

  return <NonAuthLayout>{children}</NonAuthLayout>;
};
export default Template;

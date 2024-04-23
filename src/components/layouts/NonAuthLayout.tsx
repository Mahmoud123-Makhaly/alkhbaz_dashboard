import { useEffect } from 'react';
import { ClientOnly } from '@components/common';

const NonAuthLayout = ({ children }) => {
  useEffect(() => {
    if (document) {
      document.body.setAttribute('data-layout-mode', 'light');
    }
  }, []);
  return <ClientOnly>{children}</ClientOnly>;
};

export default NonAuthLayout;

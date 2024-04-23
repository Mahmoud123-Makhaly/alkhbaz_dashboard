'use client';

import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

// Auth
import { SessionProvider } from 'next-auth/react';

// Redux
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@slices/reducers';

type Props = {
  children?: ReactNode;
};

export default function ProviderLayout({ children }: Props) {
  const store = configureStore({ reducer: rootReducer, devTools: true });
  return (
    <SessionProvider>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </SessionProvider>
  );
}

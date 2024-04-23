import 'server-only';

import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import ProviderLayout from './provider';
// Fake Backend
import fakeBackend from '@helpers/AuthType/fakeBackend';
import ToastProvider from './ToastProvider';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout(props: Props) {
  const {
    children,
    params: { locale },
  } = props;
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
    fakeBackend();
  } catch (error) {
    notFound();
  }

  return (
    <ProviderLayout>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <html lang={locale} dir={locale === 'en' ? 'ltr' : 'rtl'} data-layout-dir={locale === 'en' ? 'ltr' : 'rtl'}>
          <head>
            <title>TOT Dashboard</title>
          </head>
          <body dir={locale === 'en' ? 'ltr' : 'rtl'}>
            <ToastProvider />
            {children}
          </body>
        </html>
      </NextIntlClientProvider>
    </ProviderLayout>
  );
}

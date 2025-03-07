import '@navikt/ds-css';
import 'styles/globals.css';

import { ReactNode } from 'react';
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr';
import Script from 'next/script';
import { getEnvironment } from 'lib/utils/environments';
import styles from 'app/[locale]/layout.module.css';
import { Heading } from '@navikt/ds-react';
import { Språkvelger } from 'components/språkvelger/Språkvelger';
import { getMessages, getTranslations } from 'next-intl/server';
import { redirect, routing } from 'i18n/routing';
import { NextIntlClientProvider } from 'next-intl';
import { logWarning } from '@navikt/aap-felles-utils';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    logWarning(`Invalid locale: ${locale}`);
    redirect({ href: '/', locale: routing.defaultLocale });
  }
  const Decorator = await fetchDecoratorReact({ env: getEnvironment() });

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <Decorator.HeadAssets />
      </head>
      <body>
        <Decorator.Header />
        <NextIntlClientProvider messages={messages}>
          <div className={styles.meldekortheader}>
            <div className={styles.innhold}>
              <Heading level={'1'} size={'xlarge'}>
                Meldekort - AAP
              </Heading>
              <Språkvelger />
            </div>
          </div>
          <main className={styles.meldekortcontainer}>{children}</main>
        </NextIntlClientProvider>
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}

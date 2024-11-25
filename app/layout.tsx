import '@navikt/ds-css';
import 'styles/globals.css';

import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr';
import Script from 'next/script';
import { getEnvironment } from 'lib/utils/environments';

export const metadata: Metadata = {
  title: 'AAP Meldekort',
  description: 'Innbyggerflate for å sende inn meldekort',

};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const Decorator = await fetchDecoratorReact({ env: getEnvironment() });

  return (
    <html lang="nb">
      <head>
        <Decorator.HeadAssets />
      </head>
      <body>
        <Decorator.Header />
        {children}
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}

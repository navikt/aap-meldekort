import '@navikt/ds-css';
import 'styles/globals.css';

import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr';
import Script from 'next/script';
import { getEnvironment } from 'lib/utils/environments';
import styles from 'app/[lang]/layout.module.css';
import {Heading, VStack} from '@navikt/ds-react';
import { Språkvelger } from 'components/språkvelger/Språkvelger';
import { SlettMockButton } from 'components/slettmockbutton/SlettMockButton';
import { isLocal } from 'lib/services/meldekortservice';
import { HjemKnapp } from 'components/hjemknapp/HjemKnapp';

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
        <div className={styles.rapporteringheader}>
          <div className={styles.innhold}>
            <Heading level={'1'} size={'xlarge'}>
              Meldekort - AAP
            </Heading>
            {isLocal() && <SlettMockButton />}
            <Språkvelger />
          </div>
        </div>
        <main className={styles.rapporteringcontainer}>
          <VStack gap={'4'}>
            <HjemKnapp />
            {children}
          </VStack>
        </main>
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}

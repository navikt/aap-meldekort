'use client';

import { BodyShort, Heading, Link, List } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';

//500 Page
const Error = () => {
  const router = useRouter();

  return (
    <div>
      <Heading level="1" size="large" spacing>
        Beklager, noe gikk galt.
      </Heading>
      <BodyShort spacing>En teknisk feil på våre servere gjør at meldekort er utilgjengelig.</BodyShort>
      <BodyShort>Du kan prøve å</BodyShort>
      <List>
        <List.Item>
          vente noen minutter og{' '}
          <Link href="#" onClick={() => location.reload()}>
            laste siden på nytt
          </Link>
        </List.Item>
        <List.Item>
          gå tilbake til{' '}
          <Link href="#" onClick={() => router.push('/')}>
            meldekort oversikt
          </Link>
        </List.Item>
      </List>
      <BodyShort spacing>
        Hvis problemet vedvarer, kan du {/* https://nav.no/kontaktoss for eksterne flater */}
        <Link href="https://www.nav.no/kontaktoss" target="_blank">
          kontakte oss (åpnes i ny fane)
        </Link>
      </BodyShort>
    </div>
  );
};

export default Error;

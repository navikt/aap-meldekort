'use client';

import { Accordion, Alert, Button, HGrid, Link } from '@navikt/ds-react';

import styles from 'components/steg/kvittering/Kvittering.module.css';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { useParams, useRouter } from 'next/navigation';
import { MeldekortResponse, Meldeperiode } from 'lib/types/types';

interface Props {
  meldekort: MeldekortResponse;
  ubesvartMeldeperiode?: Meldeperiode;
}

export const Kvittering = ({ meldekort, ubesvartMeldeperiode }: Props) => {
  const router = useRouter();
  const params = useParams<{ system: string }>();

  return (
    <HGrid columns={'1'} gap={'4'}>
      <Alert variant="success">
        Meldekortet ditt er sendt til Nav, du får beskjed hvis vi trenger noe mer fra deg.
      </Alert>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>Se hva du sendte inn</Accordion.Header>
          <Accordion.Content>
            <OppsummeringKalender meldekort={meldekort} />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <div className={styles.knapperad}>
        {ubesvartMeldeperiode && (
          <Button
            variant="primary"
            type="button"
            as={'a'}
            onClick={async () => {
              router.push(`/${params.system}/${ubesvartMeldeperiode.meldekortId}`);
            }}
          >
            Gå til neste meldekort
          </Button>
        )}
        <Link href={`/${params.system}`} className={styles.link}>
          Gå tilbake til oversikt
        </Link>
      </div>
    </HGrid>
  );
};

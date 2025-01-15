'use client';

import { Accordion, Alert, Button, HGrid } from '@navikt/ds-react';

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
        <Button variant="primary" type="button" as={'a'}>
          Gå til Mine AAP
        </Button>

        {ubesvartMeldeperiode && (
          <Button
            variant="primary"
            type="button"
            as={'a'}
            onClick={async () => {
              router.push(`/${params.system}`);
            }}
          >
            Gå tilbake til oversikt
          </Button>
        )}
      </div>
    </HGrid>
  );
};

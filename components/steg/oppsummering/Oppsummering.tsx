'use client';

import { Accordion, Alert, Button, HGrid } from '@navikt/ds-react';

import styles from './Oppsummering.module.css';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { useRouter } from 'next/navigation';
import { MeldekortResponse } from 'lib/types/types';

interface Props {
  meldekort: MeldekortResponse;
}

export const Oppsummering = ({ meldekort }: Props) => {
  const router = useRouter();
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
        <Button variant="primary" type="button" as={'a'} onClick={() => router.push('/')}>
          Send inn et nytt meldekort
        </Button>
      </div>
    </HGrid>
  );
};

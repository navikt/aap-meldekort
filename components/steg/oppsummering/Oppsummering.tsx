'use client';

import { Accordion, Alert, Button, HGrid } from '@navikt/ds-react';

import styles from './Oppsummering.module.css';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { useRouter } from 'next/navigation';
import { MeldekortResponse } from 'lib/types/types';
import { lagreMeldekortClient } from 'lib/client/clientApi';

interface Props {
  meldekort: MeldekortResponse;
  referanse: string;
}

export const Oppsummering = ({ referanse, meldekort }: Props) => {
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
        <Button
          variant="primary"
          type="button"
          as={'a'}
          onClick={async () => {
            await lagreMeldekortClient(referanse, { meldekort: meldekort.meldekort, nåværendeSteg: 'KVITTERING' });
            router.push('/');
          }}
        >
          Send inn et nytt meldekort
        </Button>
      </div>
    </HGrid>
  );
};

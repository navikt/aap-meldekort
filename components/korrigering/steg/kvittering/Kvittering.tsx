'use client';

import { Accordion, Alert, HGrid, Link } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { useParams } from 'next/navigation';

import styles from 'components/steg/kvittering/Kvittering.module.css';
import { useKorrigerMeldekort } from 'hooks/korrigerMeldekortHook';

export const Kvittering = () => {
  const { korrigering } = useKorrigerMeldekort();
  const params = useParams<{ system: string }>();

  return (
    <HGrid columns={'1'} gap={'4'}>
      <Alert variant="success">
        Meldekortet ditt er sendt til Nav, du får beskjed hvis vi trenger noe mer fra deg.
      </Alert>
      <Accordion className={styles.accordion}>
        <Accordion.Item>
          <Accordion.Header>Se hva du sendte inn</Accordion.Header>
          <Accordion.Content>
            <OppsummeringKalender
              timerArbeidet={korrigering.meldekort.timerArbeidet}
              periode={korrigering.meldekort.meldeperiode}
            />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <div className={styles.knapperad}>
        <Link href={`/${params.system}/innsendt`} className={styles.link}>
          Gå tilbake til oversikt
        </Link>
      </div>
    </HGrid>
  );
};

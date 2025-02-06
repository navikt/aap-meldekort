'use client';

import { Accordion, Alert, HGrid, Link } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';

import styles from 'components/flyt/innsending/steg/kvittering/KvitteringInnsending.module.css';
import { useKorrigerMeldekort } from 'hooks/korrigerMeldekortHook';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';
import { regnUtTimer } from 'lib/utils/meldekort';

export const KvitteringKorrigering = () => {
  const { korrigering } = useKorrigerMeldekort();

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
            >
              <OppsummeringTimer timer={regnUtTimer(korrigering.meldekort.timerArbeidet)} />
            </OppsummeringKalender>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <div className={styles.knapperad}>
        <Link href={`/innsendt`} className={styles.link}>
          Gå tilbake til oversikt
        </Link>
      </div>
    </HGrid>
  );
};

'use client';

import { Accordion, Alert, Button, HGrid, Link } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { KommendeMeldekort, MeldekortResponse } from 'lib/types/types';
import NextLink from 'next/link';

import styles from 'components/flyt/innsending/steg/kvittering/KvitteringInnsending.module.css';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';
import { regnUtTimer } from 'lib/utils/meldekort';

interface Props {
  meldekort: MeldekortResponse;
  kommendeMeldekort?: KommendeMeldekort;
}

export const KvitteringInnsending = ({ meldekort, kommendeMeldekort }: Props) => {
  return (
    <HGrid columns={'1'} gap={'4'}>
      <Alert variant="success">
        Meldekortet ditt er sendt til Nav, du får beskjed hvis vi trenger noe mer fra deg.
      </Alert>
      <Accordion className={styles.accordion}>
        <Accordion.Item>
          <Accordion.Header>Se hva du sendte inn</Accordion.Header>
          <Accordion.Content>
            <OppsummeringKalender timerArbeidet={meldekort.meldekort.timerArbeidet} periode={meldekort.periode}>
              <OppsummeringTimer timer={regnUtTimer(meldekort.meldekort.timerArbeidet)} />
            </OppsummeringKalender>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <div className={styles.knapperad}>
        {kommendeMeldekort?.nesteMeldekort && (
          <NextLink href={`/${kommendeMeldekort.nesteMeldekort.meldekortId}`} passHref legacyBehavior>
            <Button variant="primary" type="button" as={'a'}>
              Gå til neste meldekort
            </Button>
          </NextLink>
        )}
        <Link href={`/`} className={styles.link}>
          Gå tilbake til oversikt
        </Link>
      </div>
    </HGrid>
  );
};

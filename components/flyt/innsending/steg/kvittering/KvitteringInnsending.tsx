'use client';

import { Accordion, Alert, Button, HGrid, Link, List } from '@navikt/ds-react';
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
      <List>
        <List.Item>Du kan endre opplysningene hvis du oppdager at du har ført feil.</List.Item>
        <List.Item>Pengene vil bli utbetalt en til tre virkedager etter at vi har mottatt meldekortet.</List.Item>
        <List.Item>Du får beskjed hvis vi trenger noe mer fra deg.</List.Item>
      </List>
      <Accordion className={styles.accordion}>
        <Accordion.Item>
          <Accordion.Header>Se hva du sendte inn</Accordion.Header>
          <Accordion.Content>
            <OppsummeringKalender timerArbeidet={meldekort.meldekort.dager} periode={meldekort.periode}>
              <OppsummeringTimer timer={regnUtTimer(meldekort.meldekort.dager)} />
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

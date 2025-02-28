'use client';

import { Accordion, Alert, HGrid, List } from '@navikt/ds-react';
import { KommendeMeldekort, UtfyllingResponse } from 'lib/types/types';
import { Link } from 'i18n/routing';

import styles from 'components/flyt/steg/kvittering/Kvittering.module.css';
import { SkjemaOppsummering } from 'components/skjemaoppsummering/SkjemaOppsummering';

interface Props {
  utfylling: UtfyllingResponse;
  kommendeMeldekort?: KommendeMeldekort;
}

export const Kvittering = ({ utfylling }: Props) => {
  return (
    <HGrid columns={'1'} gap={'4'}>
      <Alert variant="success">Vi har mottatt meldekortet ditt.</Alert>
      <List>
        <List.Item>Du kan endre opplysningene hvis du oppdager at du har ført feil.</List.Item>
        <List.Item>Du vil få utbetalt AAP om cirka 2 til 3 virkerdager.</List.Item>
      </List>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>Se hva du sendte inn</Accordion.Header>
          <Accordion.Content>
            <SkjemaOppsummering utfylling={utfylling} />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <div className={styles.knapperad}>
        {/*{kommendeMeldekort?.nesteMeldeperiode && (*/}
        {/*  <Link href={`/${kommendeMeldekort..meldekortId}`}>*/}
        {/*    <Button variant="primary" type="button">*/}
        {/*      Gå til neste meldekort*/}
        {/*    </Button>*/}
        {/*  </Link>*/}
        {/*)}*/}
        <Link href={`/`} className={styles.link}>
          Gå tilbake til oversikt
        </Link>
      </div>
    </HGrid>
  );
};

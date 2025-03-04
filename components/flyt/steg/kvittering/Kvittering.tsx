'use client';

import { Accordion, Alert, List, VStack } from '@navikt/ds-react';
import { KommendeMeldekort, UtfyllingResponse } from 'lib/types/types';
import { Link } from 'i18n/routing';

import styles from 'components/flyt/steg/kvittering/Kvittering.module.css';
import { SkjemaOppsummering } from 'components/skjemaoppsummering/SkjemaOppsummering';
import { InnsendingType, useParamsMedType } from 'lib/utils/url';

interface Props {
  utfylling: UtfyllingResponse;
  kommendeMeldekort?: KommendeMeldekort;
}

export const Kvittering = ({ utfylling }: Props) => {
  const { innsendingtype } = useParamsMedType();

  return (
    <VStack gap={'8'}>
      <Alert variant="success">
        {innsendingtype === InnsendingType.INNSENDING
          ? 'Vi har mottatt meldekortet ditt.'
          : 'Vi har mottatt endringene på meldekortet'}
      </Alert>

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

      <Link href={`/`} className={styles.link}>
        Gå tilbake til oversikt
      </Link>
    </VStack>
  );
};

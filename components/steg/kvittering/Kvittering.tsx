'use client';

import { Accordion, Alert, Button, HGrid, Link } from '@navikt/ds-react';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { useParams } from 'next/navigation';
import { KommendeMeldekort, MeldekortResponse } from 'lib/types/types';
import NextLink from 'next/link';

import styles from 'components/steg/kvittering/Kvittering.module.css';

interface Props {
  meldekort: MeldekortResponse;
  kommendeMeldekort?: KommendeMeldekort;
}

export const Kvittering = ({ meldekort, kommendeMeldekort }: Props) => {
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
            <OppsummeringKalender timerArbeidet={meldekort.meldekort.timerArbeidet} periode={meldekort.periode} />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <div className={styles.knapperad}>
        {kommendeMeldekort?.nesteMeldekort && (
          <NextLink href={`/${params.system}/${kommendeMeldekort.nesteMeldekort.meldekortId}`} passHref legacyBehavior>
            <Button variant="primary" type="button" as={'a'}>
              Gå til neste meldekort
            </Button>
          </NextLink>
        )}
        <Link href={`/${params.system}`} className={styles.link}>
          Gå tilbake til oversikt
        </Link>
      </div>
    </HGrid>
  );
};

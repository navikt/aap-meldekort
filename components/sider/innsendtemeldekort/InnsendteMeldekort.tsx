'use client';

import { Accordion, Alert, BodyShort, Heading, HGrid, Link } from '@navikt/ds-react';
import { MeldekortResponse, Meldeperiode } from 'lib/types/types';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { useParams } from 'next/navigation';

import styles from './InnsendteMeldekort.module.css';

export interface InnsendteMeldekortType {
  meldekort: MeldekortResponse;
  meldeperiode: Meldeperiode;
}

interface Props {
  innsendteMeldeperioder: InnsendteMeldekortType[];
}

export const InnsendteMeldekort = ({ innsendteMeldeperioder }: Props) => {
  const params = useParams<{ system: string }>();

  return (
    <HGrid gap={'4'}>
      <Heading size={'medium'} level={'2'} spacing>
        Oversikt over innsendte meldekort
      </Heading>
      <BodyShort>
        Her kan du se alle tidligere meldekort du har sendt til Nav. Du kan endre et meldekort ved å klikke på
        oversikten under.
      </BodyShort>

      {innsendteMeldeperioder.length > 0 ? (
        <div>
          {innsendteMeldeperioder.map((innsendtMeldekort) => {
            return (
              <Accordion key={innsendtMeldekort.meldeperiode.meldekortId} className={styles.accordion}>
                <Accordion.Item>
                  <Accordion.Header>{innsendtMeldekort.meldeperiode.meldekortId}</Accordion.Header>
                  <Accordion.Content>
                    <OppsummeringKalender meldekort={innsendtMeldekort.meldekort} />
                    <Link href={`/${params.system}`} className={styles.link}>
                      Endre meldekort
                    </Link>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            );
          })}
        </div>
      ) : (
        <Alert variant={'info'}>Du har ingen innsendte meldekort</Alert>
      )}
    </HGrid>
  );
};

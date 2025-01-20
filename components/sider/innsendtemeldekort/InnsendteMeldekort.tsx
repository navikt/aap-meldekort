'use client';

import { Accordion, Alert, BodyShort, Heading, HGrid, Link } from '@navikt/ds-react';
import { MeldekortResponse } from 'lib/types/types';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';
import { useParams } from 'next/navigation';

import styles from './InnsendteMeldekort.module.css';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';

export interface InnsendteMeldekortType {
  meldekort: MeldekortResponse;
  meldekortId: string;
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
        <>
          {innsendteMeldeperioder.map((innsendtMeldekort) => {
            return (
              <Accordion key={innsendtMeldekort.meldekortId} className={styles.accordion}>
                <Accordion.Item>
                  <Accordion.Header>
                    <div>
                      <Heading size={'medium'}>
                        {`Uke
                        ${hentUkeNummerForPeriode(
                          new Date(innsendtMeldekort.meldekort.periode.fom),
                          new Date(innsendtMeldekort.meldekort.periode.tom)
                        )}`}
                      </Heading>
                      <BodyShort>
                        {`${formaterDatoForFrontend(new Date(innsendtMeldekort.meldekort.periode.fom))} - ${formaterDatoForFrontend(new Date(innsendtMeldekort.meldekort.periode.tom))}`}
                      </BodyShort>
                    </div>
                  </Accordion.Header>
                  <Accordion.Content>
                    <OppsummeringKalender meldekort={innsendtMeldekort.meldekort} visPeriode={false} />
                    <Link href={`/${params.system}`} className={styles.link}>
                      Endre meldekort
                    </Link>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            );
          })}
        </>
      ) : (
        <Alert variant={'info'}>Du har ingen innsendte meldekort</Alert>
      )}
    </HGrid>
  );
};

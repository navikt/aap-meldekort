'use client';

import { Accordion, Alert, BodyShort, Heading } from '@navikt/ds-react';
import { Meldeperiode } from 'lib/types/types';

interface Props {
  innsendteMeldeperioder: Meldeperiode[];
}

export const InnsendteMeldekort = ({ innsendteMeldeperioder }: Props) => {
  return (
    <div>
      <div>
        <Heading size={'medium'} level={'2'} spacing>
          Oversikt over innsendte meldekort
        </Heading>
        <BodyShort>
          Her kan du se alle tidligere meldekort du har sendt til Nav. Du kan endre et meldekort ved å klikke på
          oversikten under.
        </BodyShort>

        {innsendteMeldeperioder.length > 0 ? (
          <div>
            {innsendteMeldeperioder.map((meldeperiode) => {
              return (
                <Accordion key={meldeperiode.meldekortId}>
                  <Accordion.Item>
                    <Accordion.Header>{meldeperiode.meldekortId}</Accordion.Header>
                    <Accordion.Content>{JSON.stringify(meldeperiode)}</Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              );
            })}
          </div>
        ) : (
          <Alert variant={'info'}>Du har ingen innsendte meldekort</Alert>
        )}
      </div>
    </div>
  );
};

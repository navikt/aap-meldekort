'use client';

import { Accordion, Alert, BodyShort, Heading } from '@navikt/ds-react';
import { Meldeperiode } from 'lib/types/types';

interface Props {
  ettersendinger?: Meldeperiode[];
}

export const Etterregistrering = ({ ettersendinger }: Props) => {
  return (
    <div className={'flex-column'}>
      <Heading size={'medium'} level={'2'} spacing>
        Etterregistrering av meldekort
      </Heading>
      <BodyShort>
        Her kan du se alle tilgjengelige meldekort som kan sendes inn. Du kan fylle ut meldekort ved å klikke på
        oversikten under.
      </BodyShort>

      {ettersendinger && ettersendinger.length > 0 ? (
        <div>
          {ettersendinger.map((meldeperiode) => {
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
        <Alert variant={'info'}>Du har ingen tilgjengelige meldekort</Alert>
      )}
    </div>
  );
};

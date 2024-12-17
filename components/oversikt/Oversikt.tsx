'use client';

import { Meldeperiode } from 'lib/types/types';
import { Accordion, Alert, BodyShort, Heading } from '@navikt/ds-react';

interface Props {
  meldeperioder: Meldeperiode[];
}

export const Oversikt = ({ meldeperioder }: Props) => {
  return (
    <div className={'flex-column'}>
      <Alert variant={'info'}>Du har ingen meldekort som må sendes inn.</Alert>

      <div>
        <Heading size={'medium'} level={'2'} spacing>
          Oversikt over innsendte meldekort
        </Heading>
        <BodyShort>
          Her kan du se alle tidligere meldekort du har sendt til Nav. Du kan endre et meldekort ved å klikke på
          oversikten under.
        </BodyShort>
        {meldeperioder
          .filter((meldeperiode) => meldeperiode.kanEndres)
          .map((meldeperiode) => {
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
    </div>
  );
};

'use client';

import { Alert, BodyShort, Heading, HGrid } from '@navikt/ds-react';
import { HistoriskMeldekortDto, MeldekortResponse } from 'lib/types/types';
import { useParams } from 'next/navigation';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { LinkPanelMeldekort } from 'components/linkpanel/meldekort/LinkPanelMeldekort';

export interface InnsendteMeldekortType {
  meldekort: MeldekortResponse;
  meldekortId: string;
}

interface Props {
  innsendteMeldeperioder: HistoriskMeldekortDto[];
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
              <LinkPanelMeldekort
                key={innsendtMeldekort.meldekortId}
                title={`${formaterDatoForFrontend(innsendtMeldekort.meldeperiode.fom)} - ${formaterDatoForFrontend(innsendtMeldekort.meldeperiode.tom)}`}
                href={`/${params.system}/innsendt/${innsendtMeldekort.meldekortId}`}
                description={`Uke ${hentUkeNummerForPeriode(
                  new Date(innsendtMeldekort.meldeperiode.fom),
                  new Date(innsendtMeldekort.meldeperiode.tom)
                )}`}
                status={'hellopello'}
              />
            );
          })}
        </>
      ) : (
        <Alert variant={'info'}>Du har ingen innsendte meldekort</Alert>
      )}
    </HGrid>
  );
};

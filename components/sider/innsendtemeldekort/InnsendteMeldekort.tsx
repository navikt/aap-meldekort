'use client';

import { Alert, BodyShort, Heading, HGrid } from '@navikt/ds-react';
import { HistoriskMeldekort } from 'lib/types/types';
import { useParams } from 'next/navigation';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { LinkPanel } from 'components/linkpanel/LinkPanel';
import { HjemKnapp } from 'components/hjemknapp/HjemKnapp';

interface Props {
  innsendteMeldeperioder: HistoriskMeldekort[];
}

export const InnsendteMeldekort = ({ innsendteMeldeperioder }: Props) => {
  const params = useParams<{ system: string }>();

  return (
    <HGrid gap={'4'}>
      <HjemKnapp label={'Tilbake til oversikten'} href={`/${params.system}`} />
      <Heading size={'medium'} level={'2'} spacing>
        Oversikt over innsendte meldekort
      </Heading>
      <BodyShort>
        Her kan du se alle tidligere meldekort du har sendt til Nav. Du kan endre et meldekort ved å klikke på
        oversikten under.
      </BodyShort>

      {innsendteMeldeperioder.length > 0 ? (
        <>
          {innsendteMeldeperioder.map((innsendtMeldekort, key) => {
            const urlSearchParams = new URLSearchParams();
            urlSearchParams.append('fom', innsendtMeldekort.meldeperiode.fom);
            urlSearchParams.append('tom', innsendtMeldekort.meldeperiode.tom);
            const url = `/${params.system}/innsendt/periode?${urlSearchParams}`;

            return (
              <LinkPanel
                key={key}
                variant={'secondary'}
                title={`${formaterDatoForFrontend(innsendtMeldekort.meldeperiode.fom)} - ${formaterDatoForFrontend(innsendtMeldekort.meldeperiode.tom)}`}
                href={url}
                description={`Uke ${hentUkeNummerForPeriode(
                  new Date(innsendtMeldekort.meldeperiode.fom),
                  new Date(innsendtMeldekort.meldeperiode.tom)
                )}`}
                status={innsendtMeldekort.status}
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

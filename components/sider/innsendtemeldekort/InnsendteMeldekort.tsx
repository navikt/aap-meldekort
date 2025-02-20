'use client';

import { Alert, BodyShort, Heading, HGrid } from '@navikt/ds-react';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { NavigationPanel } from 'components/navigationpanel/NavigationPanel';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { HistoriskMeldeperiode } from 'lib/types/types';

interface Props {
  innsendteMeldeperioder: HistoriskMeldeperiode[];
}

export const InnsendteMeldekort = ({ innsendteMeldeperioder }: Props) => {
  return (
    <HGrid gap={'4'}>
      <MeldekortLenke label={'Tilbake til oversikten'} href={`/`} />
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
            const url = `/innsendt/periode?${urlSearchParams}`;

            return (
              <NavigationPanel
                key={key}
                type={'link'}
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

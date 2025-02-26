'use client';

import { Alert, BodyShort, Heading, HGrid } from '@navikt/ds-react';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { NavigationPanel } from 'components/navigationpanel/NavigationPanel';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { HistoriskMeldeperiode } from 'lib/types/types';
import { PencilIcon } from '@navikt/aksel-icons';

import styles from './InnsendteMeldekort.module.css';

interface Props {
  innsendteMeldeperioder: HistoriskMeldeperiode[];
}

export const InnsendteMeldekort = ({ innsendteMeldeperioder }: Props) => {
  return (
    <HGrid gap={'4'}>
      <MeldekortLenke label={'Tilbake til oversikten'} href={`/`} />
      <Heading size={'medium'} level={'2'} spacing>
        Dine innsendte meldekort
      </Heading>
      <BodyShort>
        Du kan endre innsendte meldekort 20 uker tilbake i tid. Hvis du endrer et meldekort vi allerede har utbetalt,
        vil vi vurdere om du har rett på mer penger eller om du har fått for mye utbetalt.
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
                rightIcon={
                  <div className={styles.endreicon}>
                    <PencilIcon aria-hidden="true" />
                    <span>Endre</span>
                  </div>
                }
                title={`${formaterDatoForFrontend(innsendtMeldekort.meldeperiode.fom)} - ${formaterDatoForFrontend(innsendtMeldekort.meldeperiode.tom)}`}
                href={url}
                description={`Uke ${hentUkeNummerForPeriode(
                  new Date(innsendtMeldekort.meldeperiode.fom),
                  new Date(innsendtMeldekort.meldeperiode.tom)
                )}`}
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

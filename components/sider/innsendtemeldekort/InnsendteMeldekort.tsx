'use client';

import {Alert, BodyLong, BodyShort, Heading, HGrid, VStack} from '@navikt/ds-react';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { NavigationPanel } from 'components/navigationpanel/NavigationPanel';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { HistoriskMeldeperiode } from 'lib/types/types';
import { PencilIcon } from '@navikt/aksel-icons';

import styles from './InnsendteMeldekort.module.css';
import { startKorrigeringClient } from 'lib/client/clientApi';
import { useRouter } from 'i18n/routing';
import { InnsendingType } from 'lib/utils/url';

interface Props {
  innsendteMeldeperioder: HistoriskMeldeperiode[];
}

export const InnsendteMeldekort = ({ innsendteMeldeperioder }: Props) => {
  const router = useRouter();

  return (
    <VStack gap={'8'}>
      <MeldekortLenke label={'Tilbake til oversikten'} href={`/`} />
      <VStack gap={'4'}>
        <Heading size={'large'} level={'2'}>
          Dine innsendte meldekort
        </Heading>
        <BodyLong>
          Du kan endre innsendte meldekort 20 uker tilbake i tid. Hvis du endrer et meldekort vi allerede har utbetalt,
          vil vi vurdere om du har rett på mer penger eller om du har fått for mye utbetalt.
        </BodyLong>
      </VStack>

      <VStack gap={'4'}>
        {innsendteMeldeperioder.length > 0 ? (
          <>
            {innsendteMeldeperioder.map((innsendtMeldekort, key) => {
              return (
                <NavigationPanel
                  key={key}
                  type={'button'}
                  onClick={async () => {
                    const startInnsendingAvMeldekortResponse = await startKorrigeringClient(
                      innsendtMeldekort.meldeperiode
                    );

                    if (!startInnsendingAvMeldekortResponse?.feil && startInnsendingAvMeldekortResponse) {
                      router.push(
                        `/${InnsendingType.KORRIGERING}/${startInnsendingAvMeldekortResponse.metadata?.referanse}/${startInnsendingAvMeldekortResponse.tilstand?.aktivtSteg}`
                      );
                    }
                  }}
                  rightIcon={
                    <div className={styles.endreicon}>
                      <PencilIcon aria-hidden="true" />
                      <span>Endre</span>
                    </div>
                  }
                  title={`${formaterDatoForFrontend(innsendtMeldekort.meldeperiode.fom)} - ${formaterDatoForFrontend(innsendtMeldekort.meldeperiode.tom)}`}
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
      </VStack>
    </VStack>
  );
};

'use client';

import { Alert, BodyLong, Heading, VStack } from '@navikt/ds-react';
import { formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { NavigationPanel } from 'components/navigationpanel/NavigationPanel';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { HistoriskMeldeperiode } from 'lib/types/types';
import { PencilIcon } from '@navikt/aksel-icons';
import { startKorrigeringClient } from 'lib/client/clientApi';
import { useRouter } from 'i18n/routing';
import { InnsendingType } from 'lib/utils/url';
import { useTranslations } from 'next-intl';

interface Props {
  innsendteMeldeperioder: HistoriskMeldeperiode[];
}

export const InnsendteMeldekort = ({ innsendteMeldeperioder }: Props) => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <VStack gap={'8'}>
      <MeldekortLenke label={'Tilbake til oversikten'} href={`/`} />
      <VStack gap={'4'}>
        <Heading size={'large'} level={'2'}>
          {t('client.innsendteMeldekort.heading')}
        </Heading>
        <BodyLong>{t('client.innsendteMeldekort.info')}</BodyLong>
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
                  rightIcon={<PencilIcon aria-hidden="true" fontSize={'1.5rem'} />}
                  title={t('client.innsendteMeldekort.innsendtMeldekort.title', {
                    uker: hentUkeNummerForPeriode(
                      new Date(innsendtMeldekort.meldeperiode.fom),
                      new Date(innsendtMeldekort.meldeperiode.tom)
                    ),
                    datoperiode: `${formaterDatoMedÅrForFrontend(innsendtMeldekort.meldeperiode.fom)} - ${formaterDatoMedÅrForFrontend(innsendtMeldekort.meldeperiode.tom)}`,
                  })}
                  description={t('client.innsendteMeldekort.innsendtMeldekort.description', {
                    timer: innsendtMeldekort.antallTimerArbeidetIPerioden,
                  })}
                />
              );
            })}
          </>
        ) : (
          <Alert variant={'info'}>{t('client.innsendteMeldekort.ingenInnsendteMeldekort')}</Alert>
        )}
      </VStack>
    </VStack>
  );
};

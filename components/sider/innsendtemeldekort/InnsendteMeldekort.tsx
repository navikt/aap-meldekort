'use client';

import { Alert, BodyLong, BodyShort, Heading, HStack, VStack } from '@navikt/ds-react';
import { formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';
import { HistoriskMeldeperiode } from 'lib/types/types';
import { PencilIcon } from '@navikt/aksel-icons';
import { startKorrigeringClient } from 'lib/client/clientApi';
import { useRouter } from 'i18n/routing';
import { InnsendingType } from 'lib/utils/url';
import { useTranslations } from 'next-intl';

import styles from 'components/navigationpanel/NavigationPanel.module.css';

interface Props {
  innsendteMeldeperioder: HistoriskMeldeperiode[];
}

export const InnsendteMeldekort = ({ innsendteMeldeperioder }: Props) => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <VStack gap={'space-32'}>
      <MeldekortLenke label={t('client.link.gåTilOversikten')} href={`/`} />
      <VStack gap={'space-16'}>
        <Heading size={'large'} level={'2'}>
          {t('client.innsendteMeldekort.heading')}
        </Heading>
        <BodyLong>{t('client.innsendteMeldekort.info')}</BodyLong>
      </VStack>

      <VStack gap={'space-16'}>
        {innsendteMeldeperioder.length > 0 ? (
          <>
            {innsendteMeldeperioder.map((innsendtMeldekort, key) => {
              return (
                <button
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
                  key={key}
                  className={styles.link}
                >
                  <HStack justify={'space-between'} align={'center'}>
                    <HStack align={'center'} gap={'space-0 space-16'}>
                      <VStack align={'start'} gap={'space-4'}>
                        <BodyShort size={'large'} weight={'semibold'}>
                          {t('client.innsendteMeldekort.innsendtMeldekort.title', {
                            uker: hentUkeNummerForPeriode(
                              new Date(innsendtMeldekort.meldeperiode.fom),
                              new Date(innsendtMeldekort.meldeperiode.tom)
                            ),
                          })}
                        </BodyShort>

                        <BodyShort
                          size={'large'}
                        >{`${formaterDatoMedÅrForFrontend(innsendtMeldekort.meldeperiode.fom)} - ${formaterDatoMedÅrForFrontend(innsendtMeldekort.meldeperiode.tom)}`}</BodyShort>

                        <BodyShort size={'large'}>
                          {t('client.innsendteMeldekort.innsendtMeldekort.description', {
                            timer: innsendtMeldekort.antallTimerArbeidetIPerioden,
                          })}
                        </BodyShort>
                      </VStack>
                    </HStack>
                    <PencilIcon aria-hidden="true" fontSize={'1.5rem'} />
                  </HStack>
                </button>
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

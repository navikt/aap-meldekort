'use client';

import { KommendeMeldekort } from 'lib/types/types';
import { Alert, BodyShort, Box, Heading, LinkCard, VStack } from '@navikt/ds-react';
import { useTranslations } from 'next-intl';
import { startInnsendingClient } from 'lib/client/clientApi';
import { useRouter } from 'i18n/routing';
import { formaterDatoMedMånedIBokstaver, formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { TasklistIcon } from '@navikt/aksel-icons';
import { InnsendingType } from 'lib/utils/url';
import { useSkjermBredde } from 'hooks/skjermbreddeHook';
import { useMemo } from 'react';
import styles from 'components/navigationpanel/NavigationPanel.module.css';

interface Props {
  kommendeMeldeperiode?: KommendeMeldekort;
  harInnsendteMeldeperioder: boolean;
}

export const Oversikt = ({ kommendeMeldeperiode, harInnsendteMeldeperioder }: Props) => {
  const t = useTranslations();
  const router = useRouter();

  const { erLitenSkjerm } = useSkjermBredde();

  async function startInnsending() {
    if (kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode) {
      const startInnsendingAvMeldekortResponse = await startInnsendingClient(
        kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode
      );

      if (!startInnsendingAvMeldekortResponse?.feil && startInnsendingAvMeldekortResponse) {
        router.push(
          `/${InnsendingType.INNSENDING}/${startInnsendingAvMeldekortResponse.metadata?.referanse}/${startInnsendingAvMeldekortResponse.tilstand?.aktivtSteg}`
        );
      }
    }
  }

  const title =
    !kommendeMeldeperiode?.manglerOpplysninger && kommendeMeldeperiode?.nesteMeldeperiode
      ? t('client.oversikt.sendMeldekort.klarTilUtfylling', {
          periode: hentUkeNummerForPeriode(
            new Date(kommendeMeldeperiode.nesteMeldeperiode.meldeperiode.fom),
            new Date(kommendeMeldeperiode.nesteMeldeperiode.meldeperiode.tom)
          ),
        })
      : t('client.oversikt.sendMeldekort.antallKlareMeldekort', {
          antallMeldekort: kommendeMeldeperiode?.antallUbesvarteMeldeperioder ?? 0,
        });

  const description = useMemo(() => {
    if (kommendeMeldeperiode?.manglerOpplysninger) {
      return `${formaterDatoMedÅrForFrontend(kommendeMeldeperiode.manglerOpplysninger.fom)} - ${formaterDatoMedÅrForFrontend(kommendeMeldeperiode.manglerOpplysninger.tom)}`;
    } else {
      return `${formaterDatoMedÅrForFrontend(kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode.fom)} - ${formaterDatoMedÅrForFrontend(kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode.tom)}`;
    }
  }, [kommendeMeldeperiode]);

  return (
    <VStack gap={'space-32'}>
      <BodyShort spacing>{t('client.oversikt.mottaAAP')}</BodyShort>

      <VStack gap={'space-16'}>
        <Heading level={'2'} size={'medium'}>
          {t('client.oversikt.sendMeldekort.heading')}
        </Heading>
        {kommendeMeldeperiode?.nesteMeldeperiode ? (
          <>
            <LinkCard onClick={startInnsending}>
              <Box asChild borderRadius={'12'} padding={'space-8'}>
                {!erLitenSkjerm && (
                  <LinkCard.Icon>
                    <div className={styles.icon}>
                      <TasklistIcon fontSize={'2rem'} />
                    </div>
                  </LinkCard.Icon>
                )}
              </Box>
              <LinkCard.Title>{title}</LinkCard.Title>
              <LinkCard.Description>{description}</LinkCard.Description>
            </LinkCard>

            {kommendeMeldeperiode.antallUbesvarteMeldeperioder === 0 && kommendeMeldeperiode.nesteMeldeperiode && (
              <Alert variant={'info'}>
                {
                  // Infotekst som dekker julen 2025
                  hentUkeNummerForPeriode(
                    new Date(kommendeMeldeperiode.nesteMeldeperiode.meldeperiode.fom),
                    new Date(kommendeMeldeperiode.nesteMeldeperiode.meldeperiode.tom)
                  ) === '50 og 51' && new Date().getFullYear() === 2025
                    ? t('client.oversikt.infoAlertJulen2025')
                    : t('client.oversikt.infoAlert', {
                        dato: formaterDatoMedMånedIBokstaver(
                          kommendeMeldeperiode.nesteMeldeperiode.innsendingsvindu.fom
                        ),
                      })
                }
              </Alert>
            )}
          </>
        ) : (
          <BodyShort spacing>{t('client.oversikt.sendMeldekort.ingenMeldekort')}</BodyShort>
        )}
      </VStack>

      {harInnsendteMeldeperioder && (
        <VStack gap={'space-16'}>
          <Heading level={'2'} size={'medium'}>
            {t('client.oversikt.innsendteMeldekort.heading')}
          </Heading>
          <LinkCard onClick={startInnsending}>
            <Box asChild borderRadius={'12'} padding={'space-8'}>
              {!erLitenSkjerm && (
                <LinkCard.Icon>
                  <div className={styles.icon}>
                    <TasklistIcon fontSize={'2rem'} />
                  </div>
                </LinkCard.Icon>
              )}
            </Box>
            <LinkCard.Title>{t('client.oversikt.innsendteMeldekort.title')}</LinkCard.Title>
            <LinkCard.Description>{description}</LinkCard.Description>
          </LinkCard>
        </VStack>
      )}
    </VStack>
  );
};

'use client';

import { KommendeMeldekort } from 'lib/types/types';
import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { NavigationPanel } from 'components/navigationpanel/NavigationPanel';
import { useTranslations } from 'next-intl';
import { startInnsendingClient } from 'lib/client/clientApi';
import { useRouter } from 'i18n/routing';
import { formaterDatoMedMånedIBokstaver, formaterDatoMedÅrForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { ChevronRightIcon, PencilIcon, TasklistIcon } from '@navikt/aksel-icons';
import { InnsendingType } from 'lib/utils/url';
import { useSkjermBredde } from 'hooks/skjermbreddeHook';
import { useMemo } from 'react';
import { isProduction } from 'lib/utils/environments';

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
          antallMeldekort: kommendeMeldeperiode?.antallUbesvarteMeldeperioder,
        });

  const description = useMemo(() => {
    if (kommendeMeldeperiode?.manglerOpplysninger) {
      return `${formaterDatoMedÅrForFrontend(kommendeMeldeperiode.manglerOpplysninger.fom)} - ${formaterDatoMedÅrForFrontend(kommendeMeldeperiode.manglerOpplysninger.tom)}`;
    } else {
      return `${formaterDatoMedÅrForFrontend(kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode.fom)} - ${formaterDatoMedÅrForFrontend(kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode.tom)}`;
    }
  }, []);

  return (
    <VStack gap={'8'}>
      <BodyShort spacing>{t('client.oversikt.mottaAAP')}</BodyShort>

      <VStack gap={'4'}>
        <Heading level={'2'} size={'medium'}>
          {t('client.oversikt.sendMeldekort.heading')}
        </Heading>
        {kommendeMeldeperiode?.nesteMeldeperiode ? (
          <>
            <NavigationPanel
              type={'button'}
              title={title}
              description={description}
              rightIcon={<ChevronRightIcon fontSize={'1.6rem'} aria-hidden="true" />}
              leftIcon={erLitenSkjerm ? undefined : <TasklistIcon fontSize={'2rem'} />}
              onClick={startInnsending}
            />

            {kommendeMeldeperiode.antallUbesvarteMeldeperioder === 0 && kommendeMeldeperiode.nesteMeldeperiode && (
              <Alert variant={'info'}>
                {
                  // Infotekst som dekker julen 2025
                  !isProduction() &&
                  hentUkeNummerForPeriode(
                    new Date(kommendeMeldeperiode.nesteMeldeperiode.meldeperiode.fom),
                    new Date(kommendeMeldeperiode.nesteMeldeperiode.meldeperiode.tom)
                  ) === '50 og 51' &&
                  new Date().getFullYear() === 2025
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
        <VStack gap={'4'}>
          <Heading level={'2'} size={'medium'}>
            {t('client.oversikt.innsendteMeldekort.heading')}
          </Heading>
          <NavigationPanel
            type={'link'}
            title={t('client.oversikt.innsendteMeldekort.title')}
            href={`/innsendt`}
            leftIcon={erLitenSkjerm ? undefined : <PencilIcon fontSize={'2rem'} />}
            rightIcon={<ChevronRightIcon fontSize={'1.6rem'} aria-hidden="true" />}
          />
        </VStack>
      )}
    </VStack>
  );
};

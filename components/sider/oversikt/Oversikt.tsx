'use client';

import { KommendeMeldekort } from 'lib/types/types';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { NavigationPanel } from 'components/navigationpanel/NavigationPanel';
import { useTranslations } from 'next-intl';
import { startInnsendingClient } from 'lib/client/clientApi';
import { useRouter } from 'i18n/routing';
import { formaterDatoForFrontend, hentUkeNummerForPeriode } from 'lib/utils/date';
import { ChevronRightIcon, PencilIcon, TasklistIcon } from '@navikt/aksel-icons';
import { InnsendingType } from 'lib/utils/url';

interface Props {
  kommendeMeldeperiode?: KommendeMeldekort;
  harInnsendteMeldeperioder: boolean;
}

export const Oversikt = ({ kommendeMeldeperiode, harInnsendteMeldeperioder }: Props) => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <VStack gap={'8'}>
      <BodyShort spacing>{t('client.oversikt.mottaAAP')}</BodyShort>

      <VStack gap={'4'}>
        <Heading level={'2'} size={'medium'}>
          {t('client.oversikt.sendMeldekort.heading')}
        </Heading>
        {kommendeMeldeperiode?.nesteMeldeperiode ? (
          <NavigationPanel
            type={'button'}
            title={t('client.oversikt.sendMeldekort.antallKlareMeldekort', {
              uker: hentUkeNummerForPeriode(
                new Date(kommendeMeldeperiode.nesteMeldeperiode.meldeperiode.fom),
                new Date(kommendeMeldeperiode.nesteMeldeperiode.meldeperiode.tom)
              ),
            })}
            description={`${formaterDatoForFrontend(kommendeMeldeperiode.nesteMeldeperiode.meldeperiode.fom)} - ${formaterDatoForFrontend(kommendeMeldeperiode.nesteMeldeperiode.meldeperiode.tom)}`}
            rightIcon={<ChevronRightIcon fontSize={'1.6rem'} aria-hidden="true" />}
            leftIcon={<TasklistIcon fontSize={'2rem'} />}
            onClick={async () => {
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
            }}
          />
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
            leftIcon={<PencilIcon fontSize={'2rem'} />}
            rightIcon={<ChevronRightIcon fontSize={'1.6rem'} aria-hidden="true" />}
          />
        </VStack>
      )}
    </VStack>
  );
};

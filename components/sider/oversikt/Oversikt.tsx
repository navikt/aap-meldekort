'use client';

import { KommendeMeldekort } from 'lib/types/types';
import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { NavigationPanel } from 'components/navigationpanel/NavigationPanel';
import { useTranslations } from 'next-intl';
import { startInnsendingClient } from 'lib/client/clientApi';
import { useRouter } from 'i18n/routing';

interface Props {
  kommendeMeldeperiode?: KommendeMeldekort;
  harInnsendteMeldeperioder: boolean;
}

export const Oversikt = ({ kommendeMeldeperiode, harInnsendteMeldeperioder }: Props) => {
  const t = useTranslations();
  const router = useRouter();

  if (!kommendeMeldeperiode) {
    return <div>{t('client.oversikt.ingenMeldekort')}</div>;
  }

  return (
    <VStack gap={'4'}>
      <BodyShort size={'large'} spacing>
        {t('client.oversikt.mottaAAP')}
      </BodyShort>

      <VStack gap={'2'}>
        <Heading level={'2'} size={'medium'}>
          {t('client.oversikt.sendMeldekort.heading')}
        </Heading>
        <BodyShort size={'large'}>{t('client.oversikt.sendMeldekort.klareMeldekort')}</BodyShort>
        {kommendeMeldeperiode.nesteMeldeperiode ? (
          <NavigationPanel
            type={'button'}
            variant={'primary'}
            title={t('client.oversikt.sendMeldekort.antallKlareMeldekort', {
              antall: kommendeMeldeperiode.antallUbesvarteMeldeperioder,
            })}
            onClick={async () => {
              if (kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode) {
                const startInnsendingAvMeldekortResponse = await startInnsendingClient(
                  kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode
                );

                console.log(startInnsendingAvMeldekortResponse);
                if (!startInnsendingAvMeldekortResponse?.feil && startInnsendingAvMeldekortResponse) {
                  router.push(
                    `/${startInnsendingAvMeldekortResponse.metadata?.referanse}/${startInnsendingAvMeldekortResponse.tilstand?.aktivtSteg}`
                  );
                }
              }
            }}
          />
        ) : (
          <Alert variant={'info'}>
            <BodyShort size={'large'} weight={'semibold'} spacing>
              {t('client.oversikt.sendMeldekort.ingenMeldekort')}
            </BodyShort>
            <BodyShort size={'large'}>{t('client.oversikt.sendMeldekort.nyeMeldekort')}</BodyShort>
          </Alert>
        )}
      </VStack>

      <VStack gap={'2'}>
        <Heading level={'2'} size={'medium'}>
          Tidligere innsendte meldekort
        </Heading>
        <BodyShort size={'large'}>Her kan du se og endre meldekort</BodyShort>
        {harInnsendteMeldeperioder ? (
          <NavigationPanel type={'link'} variant={'primary'} title={'Gå til innsendte meldekort'} href={`/innsendt`} />
        ) : (
          <Alert variant={'info'}>
            <BodyShort size={'large'} weight={'semibold'} spacing>
              Ingen meldekort innsendt
            </BodyShort>
            <BodyShort size={'large'}>
              Du har ingen innsendte meldekort. Hvis du nettopp har sendt et meldekort, kan det ta en stund før det
              vises her.
            </BodyShort>
          </Alert>
        )}
      </VStack>
    </VStack>
  );
};

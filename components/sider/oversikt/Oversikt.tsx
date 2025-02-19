'use client';

import { KommendeMeldekort } from 'lib/types/types';
import { Alert, BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import { LinkPanel } from 'components/linkpanel/LinkPanel';
import { useTranslations } from 'next-intl';
import { startInnsendingClient } from 'lib/client/clientApi';
import { useRouter } from 'i18n/routing';

interface Props {
  kommendeMeldeperiode?: KommendeMeldekort;
  harInnsendteMeldeperioder: boolean;
}

export const Oversikt = ({ kommendeMeldeperiode, harInnsendteMeldeperioder }: Props) => {
  const t = useTranslations();
  // const router = useRouter();

  if (!kommendeMeldeperiode) {
    return <div>{t('client.oversikt.ingenMeldekort')}</div>;
  }

  return (
    <VStack gap={'4'}>
      <BodyShort size={'large'} spacing>
        {t('client.oversikt.mottaAAP')}
      </BodyShort>
      <BodyShort size={'large'}>{t('client.oversikt.fylleUtJobb')}</BodyShort>

      <VStack gap={'2'}>
        <Heading level={'2'} size={'medium'}>
          {t('client.oversikt.sendMeldekort.heading')}
        </Heading>
        <BodyShort size={'large'}>{t('client.oversikt.sendMeldekort.klareMeldekort')}</BodyShort>
        {kommendeMeldeperiode.nesteMeldeperiode ? (
          // <LinkPanel
          //   href={`/hei`} // TODO Legg inn korrekt lenke her
          //   title={t('client.oversikt.sendMeldekort.antallKlareMeldekort', {
          //     antall: kommendeMeldeperiode.antallUbesvarteMeldeperioder,
          //   })}
          // />

          <Button
            onClick={async () => {
              // TODO
              // startInnsending();
              // redirect til flyt

              if (kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode) {
                const startInnsendingAvMeldekortResponse = await startInnsendingClient(
                  kommendeMeldeperiode?.nesteMeldeperiode?.meldeperiode
                );

                console.log(startInnsendingAvMeldekortResponse);
                // if (!startInnsendingAvMeldekortResponse?.feil && startInnsendingAvMeldekortResponse) {
                //   router.push(
                //     `/${startInnsendingAvMeldekortResponse.metadata?.referanse}/${startInnsendingAvMeldekortResponse.tilstand?.aktivtSteg}`
                //   );
                // }
              }
            }}
          >
            {t('client.oversikt.sendMeldekort.antallKlareMeldekort', {
              antall: kommendeMeldeperiode.antallUbesvarteMeldeperioder,
            })}
          </Button>
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
          <LinkPanel title={'Gå til innsendte meldekort'} href={`/innsendt`} />
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

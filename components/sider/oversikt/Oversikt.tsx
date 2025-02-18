'use client';

import { KommendeMeldekort } from 'lib/types/types';
import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { LinkPanel } from 'components/linkpanel/LinkPanel';
import { useTranslations } from 'next-intl';

interface Props {
  kommendeMeldekort?: KommendeMeldekort;
  harInnsendteMeldekort: boolean;
}

export const Oversikt = ({ kommendeMeldekort, harInnsendteMeldekort }: Props) => {
  const t = useTranslations();

  if (!kommendeMeldekort) {
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
        {kommendeMeldekort.nesteMeldekort ? (
          <LinkPanel
            href={`/${kommendeMeldekort.nesteMeldekort.meldekortId}`}
            title={t('client.oversikt.sendMeldekort.antallKlareMeldekort', {
              antall: kommendeMeldekort.antallUbesvarteMeldekort,
            })}
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
        {harInnsendteMeldekort ? (
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

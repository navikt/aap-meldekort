'use client';

import { KommendeMeldekort } from 'lib/types/types';
import { Alert, BodyShort, Heading, Label, VStack } from '@navikt/ds-react';
import { useParams } from 'next/navigation';
import { LinkPanel } from 'components/linkpanel/LinkPanel';

interface Props {
  kommendeMeldekort?: KommendeMeldekort;
  harInnsendteMeldekort: boolean;
}

export const Oversikt = ({ kommendeMeldekort, harInnsendteMeldekort }: Props) => {
  const params = useParams<{ system: string }>();

  if (!kommendeMeldekort) {
    return <div>Kunne ikke finne noen meldeperioder</div>;
  }

  return (
    <VStack gap={'4'}>
      <BodyShort size={'large'} spacing>
        For å motta AAP må du sende meldekort hver 14. dag
      </BodyShort>
      <BodyShort size={'large'}>På meldekortet må du fylle ut hvor mye du har jobbet</BodyShort>

      <VStack gap={'2'}>
        <Heading level={'2'} size={'medium'}>
          Send meldekort
        </Heading>
        <BodyShort size={'large'}>Meldekort som er klare for innsending vises her</BodyShort>
        {kommendeMeldekort.nesteMeldekort ? (
          <LinkPanel
            href={`/${params.system}/${kommendeMeldekort.nesteMeldekort.meldekortId}`}
            title={`${kommendeMeldekort.antallUbesvarteMeldekort} meldekort klare for innsending`}
          />
        ) : (
          <Alert variant={'info'}>
            <BodyShort size={'large'} weight={'semibold'} spacing>
              Ingen meldekort klare
            </BodyShort>
            <BodyShort size={'large'}>
              Du har ingen meldekort som er åpne for innsending. Nye meldekort vil automatisk vises her.
            </BodyShort>
          </Alert>
        )}
      </VStack>

      <VStack gap={'2'}>
        <Heading level={'2'} size={'medium'}>
          Tidligere innsendte meldekort
        </Heading>
        <BodyShort size={'large'}>Her kan du se og endre meldekort</BodyShort>
        {harInnsendteMeldekort ? (
          <LinkPanel title={'Gå til innsendte meldekort'} href={`/${params.system}/innsendt`} />
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

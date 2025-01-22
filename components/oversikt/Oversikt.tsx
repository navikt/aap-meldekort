'use client';

import { KommendeMeldekortDto } from 'lib/types/types';
import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useParams } from 'next/navigation';
import { LinkPanel } from 'components/linkpanel/LinkPanel';

interface Props {
  kommendeMeldekort?: KommendeMeldekortDto;
}

export const Oversikt = ({ kommendeMeldekort }: Props) => {
  const params = useParams<{ system: string }>();

  if (!kommendeMeldekort) {
    return <div>Kunne ikke finne noen meldeperioder</div>;
  }

  return (
    <VStack gap={'4'}>
      <Heading level={'2'} size={'medium'}>
        Velg hva du vil gjøre
      </Heading>
      {kommendeMeldekort ? (
        <VStack gap={'4'}>
          <BodyShort
            size={'large'}
          >{`Du har ${kommendeMeldekort.antallUbesvarteMeldekort}  meldekort klart for innsending. Du må fylle ut den eldste først.`}</BodyShort>
          <LinkPanel
            href={`/${params.system}/${kommendeMeldekort.nesteMeldekort.meldekortId}`}
            title={`Send meldekort for perioden (${formaterDatoForFrontend(kommendeMeldekort.nesteMeldekort.meldeperiode.fom)} - ${formaterDatoForFrontend(kommendeMeldekort.nesteMeldekort.meldeperiode.tom)})`}
          />
        </VStack>
      ) : (
        <Alert variant={'info'}>Du har ingen meldekort som må sendes inn.</Alert>
      )}

      <VStack gap={'4'}>
        <BodyShort size={'large'}>Se eller endre tidligere innsendte meldekort</BodyShort>
        <LinkPanel title={'Gå til innsendte meldekort'} href={`/${params.system}/innsendt`} />
      </VStack>
    </VStack>
  );
};

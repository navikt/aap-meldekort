'use client';

import { Meldeperiode } from 'lib/types/types';
import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { hentUbesvarteMeldeperioder } from 'lib/utils/meldeperioder';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useParams } from 'next/navigation';
import { LinkPanel } from 'components/linkpanel/LinkPanel';

interface Props {
  meldeperioder?: Meldeperiode[];
}

export const Oversikt = ({ meldeperioder }: Props) => {
  const params = useParams<{ system: string }>();

  if (!meldeperioder) {
    return <div>Kunne ikke finne noen meldeperioder</div>;
  }

  const ubesvarteMeldeperioder = hentUbesvarteMeldeperioder(meldeperioder);

  return (
    <VStack gap={'4'}>
      <Heading level={'2'} size={'medium'}>
        Velg hva du vil gjøre
      </Heading>
      {ubesvarteMeldeperioder ? (
        <VStack gap={'4'}>
          <BodyShort
            size={'large'}
          >{`Du har ${ubesvarteMeldeperioder.antallUbesvarteMeldeperioder}  meldekort klart for innsending. Du må fylle ut den eldste først.`}</BodyShort>
          <LinkPanel
            href={`/${params.system}/${ubesvarteMeldeperioder.eldsteUbesvarteMeldeperiode.meldekortId}`}
            title={`Send meldekort for perioden (${formaterDatoForFrontend(ubesvarteMeldeperioder.eldsteUbesvarteMeldeperiode.periode.fom)} - ${formaterDatoForFrontend(ubesvarteMeldeperioder.eldsteUbesvarteMeldeperiode.periode.tom)})`}
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

'use client';

import { Meldeperiode } from 'lib/types/types';
import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { meldeperioderSomKanEtterregistreres, nåværendeMeldeperiode } from 'lib/utils/meldeperioder';
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

  const meldeperiodeTilEtterregistrering = meldeperioderSomKanEtterregistreres(meldeperioder);
  const nåværendePeriode = nåværendeMeldeperiode(meldeperioder);

  return (
    <VStack gap={'4'}>
      <Heading level={'2'} size={'medium'}>
        Velg hva du vil gjøre
      </Heading>
      {nåværendePeriode ? (
        <VStack gap={'4'}>
          <BodyShort size={'large'}>Du har et meldekort klart for innsending</BodyShort>
          <LinkPanel
            href={`/${params.system}/${nåværendePeriode?.meldekortId}`}
            title={`Send meldekort for denne perioden (${formaterDatoForFrontend(nåværendePeriode.periode.fom)} - ${formaterDatoForFrontend(nåværendePeriode.periode.tom)})`}
          />
        </VStack>
      ) : (
        <Alert variant={'info'}>Du har ingen meldekort som må sendes inn.</Alert>
      )}

      {meldeperiodeTilEtterregistrering && (
        <VStack gap={'4'}>
          <BodyShort size={'large'}>Du har et eller flere tidligere meldekort som ikke er sendt inn</BodyShort>
          <LinkPanel
            title={`Etterregistrer meldekort (${meldeperiodeTilEtterregistrering.length})`}
            href={`/${params.system}/etterregistrering`}
          />
        </VStack>
      )}

      {meldeperiodeTilEtterregistrering && (
        <VStack gap={'4'}>
          <BodyShort size={'large'}>Se eller endre tidligere innsendte meldekort</BodyShort>
          <LinkPanel title={'Gå til innsendte meldekort'} href={`/${params.system}/innsendt`} />
        </VStack>
      )}
    </VStack>
  );
};

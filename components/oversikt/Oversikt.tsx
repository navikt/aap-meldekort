'use client';

import { Meldeperiode } from 'lib/types/types';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { meldeperioderSomKanEtterregistreres, nåværendeMeldeperiode } from 'lib/utils/meldeperioder';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useParams, useRouter } from 'next/navigation';
import { LinkButton } from 'components/linkbutton/LinkButton';

interface Props {
  meldeperioder?: Meldeperiode[];
}

export const Oversikt = ({ meldeperioder }: Props) => {
  const router = useRouter();
  const params = useParams<{ system: string }>();

  if (!meldeperioder) {
    return <div>Kunne ikke finne noen meldeperioder</div>;
  }

  const meldeperiodeTilEtterregistrering = meldeperioderSomKanEtterregistreres(meldeperioder);
  const nåværendePeriode = nåværendeMeldeperiode(meldeperioder);

  return (
    <div className={'flex-column'}>
      <Heading level={'2'} size={'medium'}>
        Velg hva du vil gjøre
      </Heading>
      {nåværendePeriode ? (
        <div className={'flex-column'}>
          <BodyShort size={'large'}>Du har et meldekort klart for innsending</BodyShort>
          <LinkButton
            onClick={() => router.push(`/${params.system}/${nåværendePeriode?.meldekortId}`)}
            title={`Send meldekort for denne perioden (${formaterDatoForFrontend(nåværendePeriode.periode.fom)} - ${formaterDatoForFrontend(nåværendePeriode.periode.tom)})`}
          />
        </div>
      ) : (
        <Alert variant={'info'}>Du har ingen meldekort som må sendes inn.</Alert>
      )}

      {meldeperiodeTilEtterregistrering && (
        <div className={'flex-column'}>
          <BodyShort size={'large'}>Du har et eller flere tidligere meldekort som ikke er sendt inn</BodyShort>
          <LinkButton
            title={`Etterregistrer meldekort (${meldeperiodeTilEtterregistrering.length})`}
            onClick={() => router.push(`/${params.system}/etterregistrering`)}
          />
        </div>
      )}

      {meldeperiodeTilEtterregistrering && (
        <div className={'flex-column'}>
          <BodyShort size={'large'}>Se eller endre tidligere innsendte meldekort</BodyShort>
          <LinkButton title={'Gå til innsendte meldekort'} onClick={() => router.push(`/${params.system}/innsendt`)} />
        </div>
      )}
    </div>
  );
};

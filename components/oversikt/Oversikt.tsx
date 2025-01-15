'use client';

import { Meldeperiode } from 'lib/types/types';
import { Accordion, Alert, BodyShort, Heading, Label, LinkPanel } from '@navikt/ds-react';
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

  const meldeperioderSomKanEndres = meldeperioder?.filter((meldeperiode) => meldeperiode.kanEndres);

  const meldeperiodeTilEtterregistrering = meldeperioderSomKanEtterregistreres(meldeperioder);
  const nåværendePeriode = nåværendeMeldeperiode(meldeperioder);

  return (
    <div className={'flex-column'}>
      <div>
        {nåværendePeriode ? (
          <div>
            <Label>Du har et meldekort klart for innsending</Label>
            <LinkButton
              onClick={() => router.push(`/${params.system}/${nåværendePeriode?.meldekortId}`)}
              title={`Send meldekort for denne perioden (${formaterDatoForFrontend(nåværendePeriode.periode.fom)} - ${formaterDatoForFrontend(nåværendePeriode.periode.tom)})`}
            />
          </div>
        ) : (
          <Alert variant={'info'}>Du har ingen meldekort som må sendes inn.</Alert>
        )}
      </div>

      {meldeperiodeTilEtterregistrering && (
        <div>
          <Label>Du har et eller flere tidligere meldekort som ikke er sendt inn</Label>
          <LinkButton
            title={`Etterregistrer meldekort (${meldeperiodeTilEtterregistrering.length})`}
            onClick={() => router.push(`/${params.system}/etterregistrering`)}
          />
        </div>
      )}

      {meldeperiodeTilEtterregistrering && (
        <div>
          <Label>Se eller endre tidligere innsendte meldekort</Label>
          <LinkButton title={'Gå til innsendte meldekort'} onClick={() => router.push(`/${params.system}/innsendt`)} />
        </div>
      )}
    </div>
  );
};

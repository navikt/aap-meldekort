'use client';

import { Form } from 'components/form/Form';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { BodyShort, Heading, HGrid } from '@navikt/ds-react';
import { formaterDatoForFrontend, hentUkeNummerForDato } from 'lib/utils/date';
import { MeldekortResponse } from 'lib/types/types';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { useRouter } from 'next/navigation';
import { MeldekortLenke } from 'components/meldekortlenke/MeldekortLenke';

interface Props {
  meldekort: MeldekortResponse;
  referanse: string;
}

interface FormFields {
  harDuJobbet: JaEllerNei;
}

export const SpRsmL = ({ meldekort, referanse }: Props) => {
  const { isLoading, løsStegOgGåTilNeste, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);

  const { form, formFields } = useConfigForm<FormFields>({
    harDuJobbet: {
      type: 'radio',
      options: JaEllerNeiOptions,
      defaultValue: getJaNeiEllerUndefined(meldekort.meldekort.harDuJobbet),
      label: 'Har du arbeidet i perioden?',
      rules: { required: 'Du må svare på om du har arbeidet i perioden' },
    },
  });

  const fraDato = new Date(meldekort.periode.fom);
  const tilDato = new Date(meldekort.periode.tom);

  const router = useRouter();

  return (
    <Form
      forrigeStegOnClick={() => router.push(`/${referanse}/BEKREFT_SVARER_ÆRLIG`)}
      onSubmit={form.handleSubmit(async (data) => {
        løsStegOgGåTilNeste({
          meldekort: {
            ...meldekort.meldekort,
            harDuJobbet: data.harDuJobbet === JaEllerNei.Ja,
            dager: meldekort.meldekort.dager.map((dag) => {
              return {
                dato: dag.dato,
                timerArbeidet: data.harDuJobbet === JaEllerNei.Nei ? 0 : dag.timerArbeidet,
              };
            }),
          },
          nåværendeSteg: 'SPØRSMÅL',
        });
      })}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <HGrid gap={'8'}>
        <MeldekortLenke label={'Tilbake'} href={`/${referanse}/BEKREFT_SVARER_ÆRLIG`} />
        <div>
          <Heading level={'2'} size={'medium'}>
            {`Arbeid i uke ${hentUkeNummerForDato(fraDato)} og ${hentUkeNummerForDato(tilDato)}`}
          </Heading>
          <BodyShort>{`${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)}`}</BodyShort>
        </div>
        <FormField form={form} formField={formFields.harDuJobbet} size={'medium'} />
      </HGrid>
    </Form>
  );
};

'use client';

import { Form } from 'components/form/Form';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { BodyShort, Heading, HGrid } from '@navikt/ds-react';
import { formaterDatoForFrontend, hentUkeNummerForDato, hentUkeNummerForPeriode } from 'lib/utils/date';
import { useLøsStegOgGåTilNesteSteg } from 'hooks/løsStegOgGåTilNesteStegHook';
import { useRouter } from 'i18n/routing';
import { UtfyllingResponse } from 'lib/types/types';

interface Props {
  utfylling: UtfyllingResponse;
  referanse: string;
}

interface FormFields {
  harDuJobbet: JaEllerNei;
}

export const Spørsmål = ({ utfylling, referanse }: Props) => {
  const { isLoading, løsStegOgGåTilNeste, errorMessage } = useLøsStegOgGåTilNesteSteg(referanse);

  const { form, formFields } = useConfigForm<FormFields>({
    harDuJobbet: {
      type: 'radio',
      options: JaEllerNeiOptions,
      defaultValue: getJaNeiEllerUndefined(utfylling.tilstand.svar.harDuJobbet),
      label: 'Har du arbeidet i perioden?',
      rules: { required: 'Du må svare på om du har arbeidet i perioden' },
    },
  });

  const fraDato = new Date(utfylling.metadata.periode.fom);
  const tilDato = new Date(utfylling.metadata.periode.tom);

  const router = useRouter();

  return (
    <Form
      forrigeStegOnClick={() => router.push(`/${referanse}/INTRODUKSJON`)}
      onSubmit={form.handleSubmit(async (data) => {
        løsStegOgGåTilNeste({
          nyTilstand: {
            aktivtSteg: 'SPØRSMÅL',
            svar: {
              ...utfylling.tilstand.svar,
              dager: utfylling.tilstand.svar.dager.map((dag) => {
                return {
                  dato: dag.dato,
                  timerArbeidet: data.harDuJobbet === JaEllerNei.Nei ? 0 : dag.timerArbeidet,
                };
              }),
              harDuJobbet: data.harDuJobbet === JaEllerNei.Ja,
            },
          },
        });
      })}
      isLoading={isLoading}
      errorMessage={errorMessage}
    >
      <HGrid gap={'6'}>
        <div>
          <Heading level={'2'} size={'large'} spacing>
            Fyll ut meldekort
          </Heading>
          <BodyShort>{`Uke ${hentUkeNummerForPeriode(fraDato, tilDato)} (${formaterDatoForFrontend(fraDato)} - ${formaterDatoForFrontend(tilDato)})`}</BodyShort>
        </div>
        <FormField form={form} formField={formFields.harDuJobbet} size={'medium'} />
      </HGrid>
    </Form>
  );
};
